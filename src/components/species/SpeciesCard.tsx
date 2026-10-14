import { Link } from "react-router-dom";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { isNew, speciesName, speciesPath } from "@/lib/species/helpers";
import type { SpeciesCardData } from "@/lib/species/types";
import SpeciesImage from "./SpeciesImage";

/** A photo with a caption beneath it, like a work and its label on a gallery wall. */
export default function SpeciesCard({ species, priority = false }: { species: SpeciesCardData; priority?: boolean }) {
  const lang = useLang();
  const t = useT();

  return (
    <Link to={localePath(lang, speciesPath(species.id))} className="group block">
      <div className="relative">
        <SpeciesImage
          src={species.image}
          alt=""
          priority={priority}
          placeholder={species.type}
          className="aspect-[4/5] transition-opacity duration-300 group-hover:opacity-85"
        />
        {isNew(species) && (
          <span className="absolute left-2.5 top-2.5 bg-accent px-2 py-0.5 text-[0.75rem] font-medium text-on-accent">
            {t.common.isNew}
          </span>
        )}
      </div>
      <div className="mt-3.5">
        <h3 className="font-serif text-lg leading-snug decoration-line-strong decoration-1 underline-offset-4 group-hover:underline">
          {speciesName(species, lang)}
        </h3>
        {species.scientific_name && (
          <p lang="la" className="scientific mt-0.5 text-[0.9375rem] leading-snug text-muted">{species.scientific_name}</p>
        )}
      </div>
    </Link>
  );
}
