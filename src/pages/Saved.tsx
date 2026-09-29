import { Link } from "react-router-dom";
import { Bookmark, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import SpeciesCard from "../components/SpeciesCard";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../lib/i18n";
import { SPECIES_BY_ID, speciesName } from "../lib/species";
import { useLibrary } from "../store/library";
import { usePrefs } from "../store/prefs";
import { useUI } from "../store/ui";
import type { Species } from "../types/species";

export default function Saved() {
  const t = useT();
  const lang = usePrefs((s) => s.lang);
  const saved = useLibrary((s) => s.saved);
  const removeSaved = useLibrary((s) => s.removeSaved);
  const clearSaved = useLibrary((s) => s.clearSaved);
  const showToast = useUI((s) => s.showToast);
  useDocumentMeta({ title: t.nav.saved, description: t.meta.savedDescription });

  const list = saved.map((id) => SPECIES_BY_ID.get(id)).filter((sp): sp is Species => !!sp);

  function onRemove(sp: Species) {
    removeSaved(sp.id);
    showToast(`${t.article.removedToast}: ${speciesName(sp, lang)}`);
  }

  function onClear() {
    if (window.confirm(t.saved.confirmClear)) clearSaved();
  }

  return (
    <>
      <PageHeader eyebrow={t.saved.eyebrow} title={t.saved.title} lede={t.saved.lede} />
      <div className="container">
        {list.length === 0 ? (
          <div className="empty-state">
            <Bookmark size={40} aria-hidden />
            <h2>{t.saved.emptyTitle}</h2>
            <p>{t.saved.emptyBody}</p>
            <Link to="/encyclopedia" className="btn btn--primary">
              {t.saved.emptyCta}
            </Link>
          </div>
        ) : (
          <>
            <div className="results-bar">
              <p>{t.saved.count(list.length)}</p>
              <button type="button" className="text-link text-link--danger" onClick={onClear}>
                <Trash2 size={16} aria-hidden /> {t.saved.clearAll}
              </button>
            </div>
            <div className="card-grid">
              {list.map((sp) => (
                <SpeciesCard key={sp.id} sp={sp} onRemove={onRemove} headingLevel="h2" />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
