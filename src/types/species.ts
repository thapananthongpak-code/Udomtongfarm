export type SpeciesType = "animal" | "plant";

/** IUCN Red List category codes used on the site. */
export type ConservationStatus = "LC" | "NT" | "VU" | "EN" | "CR";

export type Reference = {
  title: string;
  url: string;
};

export type Species = {
  id: string;
  type: SpeciesType;

  name_th: string;
  name_en: string;
  scientific_name?: string;
  status?: ConservationStatus;

  short_description: string;
  short_description_en?: string;

  description: string;
  description_en?: string;

  image: string;
  tags?: string[];

  references: Reference[];
};
