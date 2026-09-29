import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useT } from "../lib/i18n";
import { useUI } from "../store/ui";

export default function NotFound() {
  const t = useT();
  const openSearch = useUI((s) => s.openSearch);
  useDocumentMeta({ title: t.notFound.title, description: t.notFound.body });

  return (
    <section className="container state-page">
      <p className="state-page__code" aria-hidden>
        404
      </p>
      <h1 className="state-page__title">{t.notFound.title}</h1>
      <p className="state-page__text">{t.notFound.body}</p>
      <div className="state-page__actions">
        <Link to="/" className="btn btn--primary">
          {t.notFound.home}
        </Link>
        <Link to="/encyclopedia" className="btn btn--secondary">
          {t.notFound.browse}
        </Link>
        <button type="button" className="btn btn--ghost" onClick={openSearch}>
          <Search size={18} aria-hidden /> {t.nav.search}
        </button>
      </div>
    </section>
  );
}
