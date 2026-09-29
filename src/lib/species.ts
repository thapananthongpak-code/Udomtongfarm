import { animals } from "../data/animals";
import { plants } from "../data/plants";
import type { Lang } from "../store/prefs";
import type { ConservationStatus, Species, SpeciesType } from "../types/species";

export const ALL_SPECIES: Species[] = [...animals, ...plants];
export const SPECIES_BY_ID = new Map(ALL_SPECIES.map((sp) => [sp.id, sp]));

export const FEATURED_IDS = [
  "scarlet-macaw",
  "siamese-rosewood",
  "golden-pheasant",
  "yang-na",
  "black-swan",
  "golden-shower",
];

export const COUNTS = {
  all: ALL_SPECIES.length,
  animal: animals.length,
  plant: plants.length,
};

// ── Accessors ────────────────────────────────────────────────

export const speciesPath = (sp: Species) => `/species/${sp.type}/${sp.id}`;

export const speciesName = (sp: Species, lang: Lang) => (lang === "th" ? sp.name_th : sp.name_en) || sp.name_en;

export const speciesSummary = (sp: Species, lang: Lang) =>
  (lang === "th" ? sp.short_description : sp.short_description_en) || sp.short_description;

export const speciesBody = (sp: Species, lang: Lang) =>
  (lang === "th" ? sp.description : sp.description_en) || sp.description;

export function isSpeciesType(value: string | null | undefined): value is SpeciesType {
  return value === "animal" || value === "plant";
}

/** Splits English text into paragraphs of about three sentences. Thai has no sentence punctuation, so it stays whole. */
export function toParagraphs(text: string, lang: Lang): string[] {
  const clean = text.trim();
  if (lang === "th" || !clean) return clean ? [clean] : [];
  const sentences = clean.split(/(?<=[.!?])\s+(?=[A-Z])/);
  if (sentences.length <= 3) return [clean];
  const groups = Math.ceil(sentences.length / 3);
  const size = Math.ceil(sentences.length / groups);
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += size) paragraphs.push(sentences.slice(i, i + size).join(" "));
  return paragraphs;
}

export function readingMinutes(sp: Species, lang: Lang): number {
  const text = `${speciesSummary(sp, lang)} ${speciesBody(sp, lang)}`;
  const minutes = lang === "th" ? text.replace(/\s+/g, "").length / 900 : text.split(/\s+/).length / 200;
  return Math.max(1, Math.round(minutes));
}

// ── Conservation status ──────────────────────────────────────

export const STATUS_ORDER: ConservationStatus[] = ["LC", "NT", "VU", "EN", "CR"];

export const isThreatened = (status?: ConservationStatus) => status === "VU" || status === "EN" || status === "CR";

export const statusRank = (status?: ConservationStatus) => (status ? STATUS_ORDER.indexOf(status) : -1);

export const THREATENED = ALL_SPECIES.filter((sp) => isThreatened(sp.status)).sort(
  (a, b) => statusRank(b.status) - statusRank(a.status) || a.name_en.localeCompare(b.name_en),
);

// ── Tags ─────────────────────────────────────────────────────

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

export const tagLabel = (tag: string, lang: Lang) => (lang === "th" ? TAG_TH[tag] ?? tag : tag);

export const tagSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, "-");

export type TagInfo = { tag: string; slug: string; count: number; cover: Species };

export const TAGS: TagInfo[] = (() => {
  const map = new Map<string, Species[]>();
  for (const sp of ALL_SPECIES) for (const tag of sp.tags ?? []) map.set(tag, [...(map.get(tag) ?? []), sp]);
  return [...map.entries()]
    .map(([tag, list]) => ({ tag, slug: tagSlug(tag), count: list.length, cover: list[0] }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
})();

export const findTag = (slug: string | null) => (slug ? TAGS.find((t) => t.slug === slug) : undefined);

// ── Search and sorting ───────────────────────────────────────

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function matchScore(sp: Species, query: string): number {
  const names = [sp.name_en, sp.name_th].map(normalize);
  let score = 0;
  for (const name of names) {
    if (name === query) score = Math.max(score, 100);
    else if (name.startsWith(query)) score = Math.max(score, 80);
    else if (name.split(/[\s\-()]+/).some((word) => word.startsWith(query))) score = Math.max(score, 65);
    else if (name.includes(query)) score = Math.max(score, 50);
  }
  if (score) return score;
  if (normalize(sp.scientific_name ?? "").includes(query)) return 40;
  if ((sp.tags ?? []).some((tag) => normalize(tag).includes(query) || normalize(TAG_TH[tag] ?? "").includes(query))) return 30;
  if ([sp.short_description, sp.short_description_en ?? ""].some((s) => normalize(s).includes(query))) return 15;
  if ([sp.description, sp.description_en ?? ""].some((s) => normalize(s).includes(query))) return 5;
  return 0;
}

/** Returns matching species, best matches first. An empty query returns the list unchanged. */
export function searchSpecies(list: Species[], rawQuery: string): Species[] {
  const query = normalize(rawQuery);
  if (!query) return list;
  return list
    .map((sp) => ({ sp, score: matchScore(sp, query) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.sp);
}

export type SortMode = "az" | "za" | "status" | "length";

export function sortSpecies(list: Species[], mode: SortMode, lang: Lang): Species[] {
  const collator = new Intl.Collator(lang === "th" ? "th" : "en", { sensitivity: "base" });
  const byName = (a: Species, b: Species) => collator.compare(speciesName(a, lang), speciesName(b, lang));
  const sorted = [...list];
  switch (mode) {
    case "za":
      return sorted.sort((a, b) => byName(b, a));
    case "status":
      return sorted.sort((a, b) => statusRank(b.status) - statusRank(a.status) || byName(a, b));
    case "length":
      return sorted.sort((a, b) => speciesBody(b, lang).length - speciesBody(a, lang).length || byName(a, b));
    default:
      return sorted.sort(byName);
  }
}

// ── Relationships ────────────────────────────────────────────

export function relatedSpecies(sp: Species, count = 4): Species[] {
  const tags = new Set(sp.tags ?? []);
  return ALL_SPECIES.filter((other) => other.id !== sp.id)
    .map((other) => {
      const shared = (other.tags ?? []).filter((t) => tags.has(t)).length;
      const score = shared * 3 + (other.type === sp.type ? 1 : 0) + (isThreatened(other.status) && isThreatened(sp.status) ? 0.5 : 0);
      return { other, score };
    })
    .sort((a, b) => b.score - a.score || a.other.name_en.localeCompare(b.other.name_en))
    .slice(0, count)
    .map((x) => x.other);
}

/** Previous and next article within the same category, in alphabetical order, wrapping around. */
export function neighbours(sp: Species, lang: Lang): { prev: Species; next: Species } {
  const list = sortSpecies(
    ALL_SPECIES.filter((x) => x.type === sp.type),
    "az",
    lang,
  );
  const index = list.findIndex((x) => x.id === sp.id);
  return {
    prev: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Picks a species for the given day. The stride spreads consecutive days across the list. */
export function speciesOfTheDay(date = new Date()): Species {
  const n = ALL_SPECIES.length;
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  let stride = 7;
  while (gcd(stride, n) !== 1) stride++;
  return ALL_SPECIES[(day * stride) % n];
}
