// Checking and saving what an admin types. The database enforces the same rules
// (see supabase/schema.sql), so these checks exist to give clear messages early.

import { z } from "zod";
import type { Dictionary } from "@/i18n";
import type { SiteSettings } from "@/lib/farm";
import { STATUS_CODES, type Source, type Species } from "@/lib/species/types";
import { STORAGE_PREFIX, supabase } from "@/lib/supabase";

export type AdminError = keyof Dictionary["admin"]["errors"];

export type SaveResult = { ok: true } | { ok: false; code: AdminError; fields?: Record<string, AdminError> };

/** What the species form holds while it is being edited. */
export type SpeciesFormValues = {
  id: string;
  type: Species["type"];
  name_th: string;
  name_en: string;
  scientific_name: string;
  status: string;
  summary_th: string;
  summary_en: string;
  body_th: string;
  body_en: string;
  image: string;
  /** Comma-separated. */
  tags: string;
  featured: boolean;
  published: boolean;
};

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Photos must be files shipped with the site or uploads in this project's storage bucket. */
const isAllowedImage = (value: string) =>
  value === "" || /^\/images\/[\w\-./]+$/.test(value) || (STORAGE_PREFIX !== null && value.startsWith(STORAGE_PREFIX));

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
  featured: z.boolean(),
  published: z.boolean(),
  sources: z.array(z.object({ title: required(300), url: z.url({ protocol: /^https?$/ }).max(1000) })).max(20),
});

function speciesFieldError(field: string): AdminError {
  if (field === "id") return "id_format";
  if (field === "sources") return "url";
  if (field === "image") return "image";
  return "required";
}

function collectFields(issues: z.core.$ZodIssue[], describe: (field: string) => AdminError) {
  const fields: Record<string, AdminError> = {};
  for (const issue of issues) {
    const field = String(issue.path[0]);
    fields[field] ??= describe(field);
  }
  return fields;
}

/** Adds a species, or updates the one with `existingId`. */
export async function saveSpecies(
  values: SpeciesFormValues,
  sources: Source[],
  existingId: string | null,
): Promise<SaveResult> {
  if (!supabase) return { ok: false, code: "forbidden" };

  const parsed = speciesSchema.safeParse({ ...values, id: existingId ?? values.id, sources });
  if (!parsed.success) {
    return { ok: false, code: "invalid", fields: collectFields(parsed.error.issues, speciesFieldError) };
  }

  const { status, tags, scientific_name, ...rest } = parsed.data;
  const row = {
    ...rest,
    scientific_name: scientific_name || null,
    status: status || null,
    tags: [...new Set(tags.split(",").map((tag) => tag.trim()).filter(Boolean))],
  };

  const { error } = existingId
    ? await supabase.from("species").update(row).eq("id", existingId)
    : await supabase.from("species").insert(row);
  if (!error) return { ok: true };
  if (error.code === "23505") return { ok: false, code: "invalid", fields: { id: "id_taken" } };
  // 42501 is "row level security refused this", which means the account is not an admin.
  return { ok: false, code: error.code === "42501" ? "forbidden" : "unknown" };
}

export async function deleteSpecies(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("species").delete().eq("id", id);
  return !error;
}

const link = text(500).refine((value) => value === "" || /^https:\/\/\S+$/.test(value));

const siteSchema = z.object({
  phone: text(20).regex(/^\d{9,10}$/),
  facebook_url: link,
  map_url: link,
  address_th: required(300),
  address_en: required(300),
});

export async function saveSiteSettings(values: SiteSettings): Promise<SaveResult> {
  if (!supabase) return { ok: false, code: "forbidden" };

  const parsed = siteSchema.safeParse(values);
  if (!parsed.success) {
    const describe = (field: string): AdminError => (field === "phone" ? "phone" : field.endsWith("_url") ? "url" : "required");
    return { ok: false, code: "invalid", fields: collectFields(parsed.error.issues, describe) };
  }

  // Asking for the row back shows whether the update was allowed: a non-admin updates nothing.
  const { data, error } = await supabase.from("site_settings").update(parsed.data).eq("id", 1).select("id");
  if (error) return { ok: false, code: "unknown" };
  if (data.length === 0) return { ok: false, code: "forbidden" };
  return { ok: true };
}
