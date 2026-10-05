export type SpeciesType = "animal" | "plant";

/** IUCN Red List category codes, from least to most threatened. */
export const STATUS_CODES = ["LC", "NT", "VU", "EN", "CR"] as const;
export type Status = (typeof STATUS_CODES)[number];

export type Source = {
  title: string;
  url: string;
};

/** One entry in the collection. The shape matches the `species` table in Supabase. */
export type Species = {
  id: string;
  type: SpeciesType;

  name_th: string;
  name_en: string;
  scientific_name: string | null;
  status: Status | null;

  summary_th: string;
  summary_en: string;
  body_th: string;
  body_en: string;

  /** A path under /public or a full URL in Supabase Storage. Empty when there is no photo yet. */
  image: string;
  tags: string[];
  sources: Source[];

  featured: boolean;
  published: boolean;
  created_at?: string;
  updated_at?: string;
};

/** The fields needed to draw a card. Passed to client components in place of the full entry. */
export type SpeciesCardData = Pick<
  Species,
  "id" | "type" | "name_th" | "name_en" | "scientific_name" | "status" | "summary_th" | "summary_en" | "image" | "tags"
>;

export const toCardData = (sp: Species): SpeciesCardData => ({
  id: sp.id,
  type: sp.type,
  name_th: sp.name_th,
  name_en: sp.name_en,
  scientific_name: sp.scientific_name,
  status: sp.status,
  summary_th: sp.summary_th,
  summary_en: sp.summary_en,
  image: sp.image,
  tags: sp.tags,
});
