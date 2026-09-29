import { useState } from "react";
import { Bookmark, BookmarkCheck, Leaf, PawPrint } from "lucide-react";
import { useT } from "../lib/i18n";
import { STATUS_ORDER, speciesName } from "../lib/species";
import { useLibrary } from "../store/library";
import { usePrefs } from "../store/prefs";
import { useUI } from "../store/ui";
import type { ConservationStatus, Species, SpeciesType } from "../types/species";

/** Species photo with lazy loading and a neutral fallback when the file is missing. */
export function SpeciesImage({ sp, className = "", eager = false }: { sp: Species; className?: string; eager?: boolean }) {
  const lang = usePrefs((s) => s.lang);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const alt = speciesName(sp, lang);

  if (failedSrc === sp.image) {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt}>
        {sp.type === "animal" ? <PawPrint size={28} /> : <Leaf size={28} />}
      </div>
    );
  }
  return (
    <img
      src={sp.image}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSrc(sp.image)}
    />
  );
}

export function TypeLabel({ type, withIcon = true }: { type: SpeciesType; withIcon?: boolean }) {
  const t = useT();
  return (
    <span className="type-label">
      {withIcon && (type === "animal" ? <PawPrint size={14} aria-hidden /> : <Leaf size={14} aria-hidden />)}
      {type === "animal" ? t.common.animal : t.common.plant}
    </span>
  );
}

export function StatusBadge({ status, compact = false }: { status: ConservationStatus; compact?: boolean }) {
  const t = useT();
  const label = t.status[status];
  return (
    <span className={`status status--${status.toLowerCase()}`} title={compact ? label : undefined}>
      <span className="status__code">{status}</span>
      {compact ? <span className="sr-only">{label}</span> : <span className="status__label">{label}</span>}
    </span>
  );
}

/** Five-step IUCN scale with the current category highlighted. */
export function StatusScale({ status }: { status?: ConservationStatus }) {
  const t = useT();
  return (
    <div className="status-scale">
      <ol className="status-scale__steps" aria-label={t.status.scaleLabel}>
        {STATUS_ORDER.map((code) => (
          <li
            key={code}
            className={`status-scale__step status-scale__step--${code.toLowerCase()}${code === status ? " is-active" : ""}`}
            aria-current={code === status ? "true" : undefined}
            title={t.status[code]}
          >
            {code}
          </li>
        ))}
      </ol>
      <p className="status-scale__label">{status ? t.status[status] : t.common.notEvaluated}</p>
    </div>
  );
}

export function SaveButton({ sp, variant = "icon" }: { sp: Species; variant?: "icon" | "button" }) {
  const t = useT();
  const saved = useLibrary((s) => s.saved.includes(sp.id));
  const toggleSaved = useLibrary((s) => s.toggleSaved);
  const showToast = useUI((s) => s.showToast);
  const lang = usePrefs((s) => s.lang);
  const Icon = saved ? BookmarkCheck : Bookmark;

  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const nowSaved = toggleSaved(sp.id);
    showToast(nowSaved ? t.article.savedToast : t.article.removedToast);
  }

  if (variant === "button") {
    return (
      <button type="button" className={`btn btn--secondary${saved ? " is-on" : ""}`} aria-pressed={saved} onClick={onClick}>
        <Icon size={18} aria-hidden />
        {saved ? t.common.saved : t.common.save}
      </button>
    );
  }
  return (
    <button
      type="button"
      className={`save-toggle${saved ? " is-on" : ""}`}
      aria-pressed={saved}
      aria-label={`${saved ? t.common.saved : t.common.save}: ${speciesName(sp, lang)}`}
      title={saved ? t.common.saved : t.common.save}
      onClick={onClick}
    >
      <Icon size={18} aria-hidden />
    </button>
  );
}
