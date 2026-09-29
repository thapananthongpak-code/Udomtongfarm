import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useT } from "../lib/i18n";
import { readingMinutes, speciesName, speciesPath, speciesSummary } from "../lib/species";
import { usePrefs } from "../store/prefs";
import type { Species } from "../types/species";
import { SaveButton, SpeciesImage, StatusBadge, TypeLabel } from "./SpeciesBits";

type Props = {
  sp: Species;
  variant?: "grid" | "list" | "compact";
  /** Shows a remove button instead of the save toggle (used on the Saved page). */
  onRemove?: (sp: Species) => void;
  headingLevel?: "h2" | "h3";
};

export default function SpeciesCard({ sp, variant = "grid", onRemove, headingLevel = "h3" }: Props) {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const name = speciesName(sp, lang);
  const Heading = headingLevel;

  if (variant === "compact") {
    return (
      <article className="card card--compact">
        <div className="card__media">
          <SpeciesImage sp={sp} />
        </div>
        <div className="card__body">
          <TypeLabel type={sp.type} />
          <Heading className="card__title">
            <Link to={speciesPath(sp)} className="card__link">
              {name}
            </Link>
          </Heading>
        </div>
      </article>
    );
  }

  return (
    <article className={`card card--${variant}`}>
      <div className="card__media">
        <SpeciesImage sp={sp} />
      </div>
      <div className="card__body">
        <div className="card__meta">
          <TypeLabel type={sp.type} />
          {sp.status && <StatusBadge status={sp.status} compact />}
        </div>
        <Heading className="card__title">
          <Link to={speciesPath(sp)} className="card__link">
            {name}
          </Link>
        </Heading>
        {sp.scientific_name && <p className="card__sci">{sp.scientific_name}</p>}
        <p className="card__summary">{speciesSummary(sp, lang)}</p>
        {variant === "list" && <p className="card__foot">{t.common.minRead(readingMinutes(sp, lang))}</p>}
      </div>
      <div className="card__action">
        {onRemove ? (
          <button
            type="button"
            className="save-toggle"
            onClick={() => onRemove(sp)}
            aria-label={`${t.common.remove}: ${name}`}
            title={t.common.remove}
          >
            <X size={18} aria-hidden />
          </button>
        ) : (
          <SaveButton sp={sp} />
        )}
      </div>
    </article>
  );
}
