import { Link } from "react-router-dom";
import QrCode from "@/components/QrCode";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { speciesQrUrl } from "@/lib/site";
import { speciesName } from "@/lib/species/helpers";
import { useAdminSpecies } from "@/lib/useAdminSpecies";

/** Every published entry's QR code with its name, laid out to be printed as signs. */
export default function QrSheet() {
  const lang = useLang();
  const t = useT().admin;
  const labels = t.qr;
  const species = useAdminSpecies();
  const collator = new Intl.Collator(lang);
  const published = species
    ?.filter((sp) => sp.published)
    .sort((a, b) => collator.compare(speciesName(a, lang), speciesName(b, lang)));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="display text-4xl md:text-5xl">{labels.sheetTitle}</h1>
          <p className="mt-4 max-w-xl text-[0.9375rem] text-muted">{labels.sheetLede}</p>
        </div>
        <div className="flex gap-3">
          <Link to={localePath(lang, "/admin/species")} className="btn btn-quiet">
            {t.species}
          </Link>
          <button type="button" className="btn btn-primary" onClick={() => window.print()} disabled={!published?.length}>
            {labels.print}
          </button>
        </div>
      </div>

      {published === undefined ? (
        <div className="mt-10 h-40 animate-pulse bg-wall print:hidden" aria-busy="true" />
      ) : published.length === 0 ? (
        <p className="mt-10 border-t border-line pt-8 text-muted">{labels.empty}</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-6 print:mt-0 print:grid-cols-3 sm:grid-cols-3 lg:grid-cols-4">
          {published.map((sp) => (
            <li key={sp.id} className="break-inside-avoid border border-line-strong p-4 text-center print:border-black">
              <QrCode url={speciesQrUrl(sp.id)} label={speciesName(sp, lang)} className="mx-auto w-full max-w-44" />
              <p className="mt-3 font-serif text-lg leading-snug print:text-black">{speciesName(sp, lang)}</p>
              {sp.scientific_name && (
                <p lang="la" className="scientific text-[0.875rem] text-muted print:text-black">
                  {sp.scientific_name}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
