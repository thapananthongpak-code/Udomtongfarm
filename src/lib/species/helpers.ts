// Pure helpers for species data. Safe to import from server and client components.

import type { Locale } from "@/i18n/config";
import { STATUS_CODES, type Species, type SpeciesCardData, type SpeciesType, type Status } from "./types";

type Named = Pick<Species, "name_th" | "name_en">;
type Summarised = Pick<Species, "summary_th" | "summary_en">;

// ── Accessors ────────────────────────────────────────────────

export const speciesPath = (id: string) => `/species/${id}`;

export const speciesName = (sp: Named, lang: Locale) => (lang === "th" ? sp.name_th : sp.name_en) || sp.name_en || sp.name_th;

export const speciesSummary = (sp: Summarised, lang: Locale) =>
  (lang === "th" ? sp.summary_th : sp.summary_en) || sp.summary_th || sp.summary_en;

export const speciesBody = (sp: Pick<Species, "body_th" | "body_en">, lang: Locale) =>
  (lang === "th" ? sp.body_th : sp.body_en) || sp.body_th || sp.body_en;

export const isSpeciesType = (value: string | null | undefined): value is SpeciesType =>
  value === "animal" || value === "plant";

export const isStatus = (value: string | null | undefined): value is Status =>
  STATUS_CODES.includes(value as Status);

/**
 * Splits a description into paragraphs. Blank lines always start a new paragraph.
 * English text without blank lines is grouped into paragraphs of about three sentences.
 * Thai has no sentence punctuation, so it stays whole.
 */
export function toParagraphs(text: string, lang: Locale): string[] {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  if (blocks.length !== 1 || lang === "th") return blocks;

  const sentences = blocks[0].split(/(?<=[.!?])\s+(?=[A-Z])/);
  if (sentences.length <= 3) return blocks;
  const groups = Math.ceil(sentences.length / 3);
  const size = Math.ceil(sentences.length / groups);
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += size) paragraphs.push(sentences.slice(i, i + size).join(" "));
  return paragraphs;
}

// ── Conservation status ──────────────────────────────────────

export const isThreatened = (status: Status | null) => status === "VU" || status === "EN" || status === "CR";

export const statusRank = (status: Status | null) => (status ? STATUS_CODES.indexOf(status) : -1);

// ── Groups (tags) ────────────────────────────────────────────

const TAG_TH: Record<string, string> = {
  Avian: "สัตว์ปีก",
  Waterfowl: "นกน้ำ",
  Domestic: "สัตว์เลี้ยง",
  Pheasant: "ไก่ฟ้า",
  Parrot: "นกแก้ว",
  Galliformes: "อันดับไก่",
  Hardwood: "ไม้เนื้อแข็ง",
  Protected: "ไม้หวงห้าม",
  "Large tree": "ไม้ยืนต้นขนาดใหญ่",
  Resin: "ให้ชันและน้ำมัน",
  Grass: "พืชวงศ์หญ้า",
  Ornamental: "ไม้ประดับ",
  Edible: "พืชกินได้",
  "Fruit tree": "ไม้ผล",
  Botanical: "พืชสมุนไพร",
};

/** Groups are stored in English. Known ones have a Thai label; others are shown as written. */
export const tagLabel = (tag: string, lang: Locale) => (lang === "th" ? (TAG_TH[tag] ?? tag) : tag);

export const tagSlug = (tag: string) => tag.toLowerCase().trim().replace(/\s+/g, "-");

export function listTags(list: Pick<Species, "tags">[]): { tag: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const sp of list) for (const tag of sp.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: tagSlug(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// ── Search and sorting ───────────────────────────────────────

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function matchScore(sp: SpeciesCardData, query: string): number {
  let score = 0;
  for (const name of [sp.name_en, sp.name_th].map(normalize)) {
    if (name === query) score = Math.max(score, 100);
    else if (name.startsWith(query)) score = Math.max(score, 80);
    else if (name.split(/[\s\-()]+/).some((word) => word.startsWith(query))) score = Math.max(score, 65);
    else if (name.includes(query)) score = Math.max(score, 50);
  }
  if (score) return score;
  if (normalize(sp.scientific_name ?? "").includes(query)) return 40;
  if (sp.tags.some((tag) => normalize(tag).includes(query) || normalize(TAG_TH[tag] ?? "").includes(query))) return 30;
  if ([sp.summary_th, sp.summary_en].some((text) => normalize(text).includes(query))) return 15;
  return 0;
}

/** Returns matching species, best matches first. An empty query returns the list unchanged. */
export function searchSpecies<T extends SpeciesCardData>(list: T[], rawQuery: string): T[] {
  const query = normalize(rawQuery);
  if (!query) return list;
  return list
    .map((sp) => ({ sp, score: matchScore(sp, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.sp);
}

export type SortMode = "az" | "za" | "status";

export const isSortMode = (value: string | null | undefined): value is SortMode =>
  value === "az" || value === "za" || value === "status";

export function sortSpecies<T extends Named & Pick<Species, "status">>(list: T[], mode: SortMode, lang: Locale): T[] {
  const collator = new Intl.Collator(lang, { sensitivity: "base" });
  const byName = (a: T, b: T) => collator.compare(speciesName(a, lang), speciesName(b, lang));
  const sorted = [...list];
  switch (mode) {
    case "za":
      return sorted.sort((a, b) => byName(b, a));
    case "status":
      return sorted.sort((a, b) => statusRank(b.status) - statusRank(a.status) || byName(a, b));
    default:
      return sorted.sort(byName);
  }
}

// ── Relationships ────────────────────────────────────────────

export function relatedSpecies(sp: Species, all: Species[], count = 4): Species[] {
  const tags = new Set(sp.tags);
  return all
    .filter((other) => other.id !== sp.id)
    .map((other) => {
      const shared = other.tags.filter((tag) => tags.has(tag)).length;
      const score =
        shared * 3 + (other.type === sp.type ? 1 : 0) + (isThreatened(other.status) && isThreatened(sp.status) ? 0.5 : 0);
      return { other, score };
    })
    .sort((a, b) => b.score - a.score || a.other.name_en.localeCompare(b.other.name_en))
    .slice(0, count)
    .map((entry) => entry.other);
}

/** Previous and next entry within the same department, in alphabetical order, wrapping around. */
export function neighbours(sp: Species, all: Species[], lang: Locale): { prev: Species; next: Species } | null {
  const list = sortSpecies(
    all.filter((other) => other.type === sp.type),
    "az",
    lang,
  );
  const index = list.findIndex((other) => other.id === sp.id);
  if (index === -1 || list.length < 2) return null;
  return {
    prev: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  };
}
