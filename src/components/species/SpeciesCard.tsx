import Link from "next/link";
import { localePath, type Dictionary, type Locale } from "@/i18n";
import { speciesName, speciesPath } from "@/lib/species/helpers";
import type { SpeciesCardData } from "@/lib/species/types";
import SpeciesImage from "./SpeciesImage";
import { StatusBadge } from "./StatusBadge";

type Props = {
  species: SpeciesCardData;
  lang: Locale;
  statusLabels: Dictionary["status"];
  sizes?: string;
  priority?: boolean;
};

/** A photo with a caption beneath it, like a work and its label on a gallery wall. */
export default function SpeciesCard({
  species,
  lang,
  statusLabels,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  priority = false,
}: Props) {
  const name = speciesName(species, lang);

  return (
    <Link href={localePath(lang, speciesPath(species.id))} className="group block">
      <SpeciesImage
        src={species.image}
        alt=""
        sizes={sizes}
        priority={priority}
        className="aspect-[4/5] transition-opacity duration-300 group-hover:opacity-85"
      />
      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-lg leading-snug decoration-line-strong decoration-1 underline-offset-4 group-hover:underline">
            {name}
          </h3>
          {species.scientific_name && (
            <p className="scientific mt-0.5 text-[0.9375rem] leading-snug text-muted">{species.scientific_name}</p>
          )}
        </div>
        {species.status && (
          <span className="mt-1 shrink-0">
            <StatusBadge status={species.status} labels={statusLabels} />
          </span>
        )}
      </div>
    </Link>
  );
}
