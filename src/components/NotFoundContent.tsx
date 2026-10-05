import { Link } from "react-router-dom";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { usePageMeta } from "@/lib/usePageMeta";

export default function NotFoundContent() {
  const lang = useLang();
  const t = useT().notFound;
  usePageMeta(t.title);

  return (
    <div className="shell py-28 md:py-40">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-4xl md:text-6xl">{t.title}</h1>
      <p className="lede mt-6 max-w-xl">{t.body}</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link to={localePath(lang)} className="btn btn-primary">
          {t.home}
        </Link>
        <Link to={localePath(lang, "/collection")} className="btn">
          {t.browse}
        </Link>
      </div>
    </div>
  );
}
