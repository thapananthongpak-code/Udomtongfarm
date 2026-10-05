import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { speciesPath } from "@/lib/species/helpers";
import { getAllSpecies } from "@/lib/species/repository";

export const revalidate = 3600;

const STATIC_PATHS = ["", "/collection", "/about", "/visit", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const species = await getAllSpecies();
  const paths = [
    ...STATIC_PATHS.map((path) => ({ path, lastModified: undefined as string | undefined, priority: path === "" ? 1 : 0.8 })),
    ...species.map((sp) => ({ path: speciesPath(sp.id), lastModified: sp.updated_at, priority: 0.7 })),
  ];

  return paths.flatMap(({ path, lastModified, priority }) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified,
      priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
    })),
  );
}
