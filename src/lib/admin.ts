// Checking and saving what an admin types. The database enforces the same rules
// (see supabase/schema.sql), so these checks exist to give clear messages early.

import { z } from "zod";
import type { Dictionary } from "@/i18n";
import { CONTENT_KEYS, CONTENT_MAX_LENGTH, type ContentRow } from "@/lib/content";
import type { SiteSettings } from "@/lib/farm";
import { MENU_CATEGORIES, type MenuCategory } from "@/lib/menu";
import { STATUS_CODES, type Source, type Species } from "@/lib/species/types";
import { SPECIES_BUCKET, STORAGE_PREFIX, supabase } from "@/lib/supabase";

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

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Uploads a photograph and returns its public address, or null when it could not be uploaded.
 * `name` starts the file name, and may include a folder such as "menu/item".
 */
export async function uploadPhoto(file: File, name: string): Promise<string | null> {
  if (!supabase || file.size > MAX_UPLOAD_BYTES) return null;
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${name}-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from(SPECIES_BUCKET).upload(path, file, { cacheControl: "31536000" });
  return error ? null : supabase.storage.from(SPECIES_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** What the menu form holds while it is being edited. */
export type MenuFormValues = {
  category: MenuCategory;
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  /** Whole baht, or empty while there is no price. */
  price: string;
  image: string;
  sort_order: string;
  published: boolean;
};

const wholeNumber = (digits: number) => text(digits).regex(/^\d*$/);

const menuSchema = z.object({
  category: z.enum(MENU_CATEGORIES),
  name_th: required(120),
  name_en: text(120),
  description_th: text(300),
  description_en: text(300),
  price: wholeNumber(6),
  image: text(1000).refine(isAllowedImage),
  sort_order: wholeNumber(4),
  published: z.boolean(),
});

function menuFieldError(field: string): AdminError {
  if (field === "price" || field === "sort_order") return "number";
  if (field === "image") return "image";
  return "required";
}

/** Adds a menu item, or updates the one with `existingId`. */
export async function saveMenuItem(values: MenuFormValues, existingId: string | null): Promise<SaveResult> {
  if (!supabase) return { ok: false, code: "forbidden" };

  const parsed = menuSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, code: "invalid", fields: collectFields(parsed.error.issues, menuFieldError) };
  }

  const { price, sort_order, ...rest } = parsed.data;
  const row = { ...rest, price: price === "" ? null : Number(price), sort_order: Number(sort_order) };

  // Asking for the row back shows whether the change was allowed: a non-admin changes nothing.
  const { data, error } = existingId
    ? await supabase.from("menu_items").update(row).eq("id", existingId).select("id")
    : await supabase.from("menu_items").insert(row).select("id");
  if (error) return { ok: false, code: error.code === "42501" ? "forbidden" : "unknown" };
  if (data.length === 0) return { ok: false, code: "forbidden" };
  return { ok: true };
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  return !error;
}

const link = text(500).refine((value) => value === "" || /^https:\/\/\S+$/.test(value));

/**
 * A link copied from Facebook carries language and tracking parameters.
 * Only `id` is part of a page's address, so the rest is dropped before saving.
 */
function tidyFacebookUrl(value: string): string {
  if (!URL.canParse(value)) return value;
  const url = new URL(value);
  if (!/(^|\.)facebook\.com$/.test(url.hostname)) return value;
  const id = url.searchParams.get("id");
  url.search = id ? `?id=${encodeURIComponent(id)}` : "";
  url.hash = "";
  return url.toString();
}

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
  const row = { ...parsed.data, facebook_url: tidyFacebookUrl(parsed.data.facebook_url) };
  const { data, error } = await supabase.from("site_settings").update(row).eq("id", 1).select("id");
  if (error) return { ok: false, code: "unknown" };
  if (data.length === 0) return { ok: false, code: "forbidden" };
  return { ok: true };
}

const contentSchema = z.array(
  z.object({ key: z.enum(CONTENT_KEYS), th: text(CONTENT_MAX_LENGTH), en: text(CONTENT_MAX_LENGTH) }),
);

/** Saves the site's texts. A row with both languages empty puts the built-in text back. */
export async function saveContent(rows: ContentRow[]): Promise<SaveResult> {
  if (!supabase) return { ok: false, code: "forbidden" };

  const parsed = contentSchema.safeParse(rows);
  if (!parsed.success) return { ok: false, code: "invalid" };
  if (parsed.data.length === 0) return { ok: true };

  // Asking for the rows back shows whether the change was allowed: a non-admin changes nothing.
  const { data, error } = await supabase.from("site_content").upsert(parsed.data).select("key");
  if (error) return { ok: false, code: error.code === "42501" ? "forbidden" : "unknown" };
  if (data.length !== parsed.data.length) return { ok: false, code: "forbidden" };
  return { ok: true };
}
