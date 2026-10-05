"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { localePath, type Dictionary, type Locale } from "@/i18n";
import { getProfile } from "@/lib/auth";
import { STATUS_CODES } from "@/lib/species/types";
import { supabaseEnv, SPECIES_BUCKET } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AdminError = keyof Dictionary["admin"]["errors"];

export type SpeciesFormState = {
  status: "idle" | "error";
  code?: AdminError;
  /** Field name to the problem with it. */
  fields?: Record<string, AdminError>;
};

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Photos must be files shipped with the site or uploads in this project's storage bucket. */
function isAllowedImage(value: string): boolean {
  if (value === "" || /^\/images\/[\w\-./]+$/.test(value)) return true;
  return supabaseEnv !== null && value.startsWith(`${supabaseEnv.url}/storage/v1/object/public/${SPECIES_BUCKET}/`);
}

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => text(max).min(1);

const speciesSchema = z.object({
  id: text(80).regex(ID_PATTERN),
  type: z.enum(["animal", "plant"]),
  name_th: required(200),
  name_en: required(200),
  scientific_name: text(200),
  status: z.enum(["", ...STATUS_CODES]),
  summary_th: text(500),
  summary_en: text(500),
  body_th: text(20000),
  body_en: text(20000),
  image: text(1000).refine(isAllowedImage),
  tags: text(500),
  sources: z.array(z.object({ title: required(300), url: z.url({ protocol: /^https?$/ }).max(1000) })).max(20),
});

function parseSources(raw: FormDataEntryValue | null): unknown {
  try {
    return JSON.parse(String(raw ?? "[]"));
  } catch {
    return null;
  }
}

function fieldError(field: string): AdminError {
  if (field === "id") return "id_format";
  if (field === "sources") return "url";
  if (field === "image") return "image";
  return "required";
}

async function adminClient() {
  const [supabase, profile] = await Promise.all([createClient(), getProfile()]);
  return supabase && profile?.role === "admin" ? supabase : null;
}

/** Published pages are static, so every change to the collection rebuilds them. */
const refreshSite = () => revalidatePath("/", "layout");

export async function saveSpecies(
  lang: Locale,
  /** The id being edited, or null when adding a new species. */
  existingId: string | null,
  _prev: SpeciesFormState,
  formData: FormData,
): Promise<SpeciesFormState> {
  const supabase = await adminClient();
  if (!supabase) return { status: "error", code: "forbidden" };

  const parsed = speciesSchema.safeParse({
    ...Object.fromEntries(formData),
    id: existingId ?? formData.get("id"),
    sources: parseSources(formData.get("sources")),
  });
  if (!parsed.success) {
    const fields: Record<string, AdminError> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0]);
      fields[field] ??= fieldError(field);
    }
    return { status: "error", code: "invalid", fields };
  }

  const { status, tags, scientific_name, ...rest } = parsed.data;
  const row = {
    ...rest,
    scientific_name: scientific_name || null,
    status: status || null,
    tags: [...new Set(tags.split(",").map((tag) => tag.trim()).filter(Boolean))],
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };

  const { error } = existingId
    ? await supabase.from("species").update(row).eq("id", existingId)
    : await supabase.from("species").insert(row);
  if (error) {
    if (error.code === "23505") return { status: "error", code: "invalid", fields: { id: "id_taken" } };
    return { status: "error", code: "unknown" };
  }

  refreshSite();
  redirect(localePath(lang, "/admin/species"));
}

export async function deleteSpecies(lang: Locale, id: string) {
  const supabase = await adminClient();
  if (!supabase) return;
  const { error } = await supabase.from("species").delete().eq("id", id);
  if (error) throw new Error(`Could not delete species: ${error.message}`);

  refreshSite();
  redirect(localePath(lang, "/admin/species"));
}

export type SiteFormState = {
  status: "idle" | "saved" | "error";
  code?: AdminError;
  fields?: Record<string, AdminError>;
};

const link = text(500).refine((value) => value === "" || /^https:\/\/\S+$/.test(value));

const siteSchema = z.object({
  phone: text(20).regex(/^\d{9,10}$/),
  facebook_url: link,
  map_url: link,
  address_th: required(300),
  address_en: required(300),
});

export async function saveSiteSettings(_prev: SiteFormState, formData: FormData): Promise<SiteFormState> {
  const supabase = await adminClient();
  if (!supabase) return { status: "error", code: "forbidden" };

  const parsed = siteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fields: Record<string, AdminError> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0]);
      fields[field] ??= field === "phone" ? "phone" : field.endsWith("_url") ? "url" : "required";
    }
    return { status: "error", code: "invalid", fields };
  }

  const { error } = await supabase.from("site_settings").update(parsed.data).eq("id", 1);
  if (error) return { status: "error", code: "unknown" };

  refreshSite();
  return { status: "saved" };
}
