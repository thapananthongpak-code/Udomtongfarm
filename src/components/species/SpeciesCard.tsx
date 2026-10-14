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
          // Without a photo a shorter frame is enough, so a page of entries is not mostly empty frames.
          className={species.image ? "aspect-[4/5]" : "aspect-[4/3]"}
        />
        {isNew(species) && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-2.5 py-0.5 text-[0.75rem] font-semibold text-on-accent">
            {t.common.isNew}
          </span>
        )}
      </div>
      <div className="mt-3.5">
        <h3 className="font-serif text-lg leading-snug transition-colors group-hover:text-accent">
          {speciesName(species, lang)}
        </h3>
        {species.scientific_name && (
          <p lang="la" className="scientific mt-0.5 text-[0.9375rem] leading-snug text-muted">{species.scientific_name}</p>
        )}
      </div>
    </Link>
  );
}
