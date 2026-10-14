import { Link } from "react-router-dom";
import { format, localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { addressFor, formatPhone } from "@/lib/farm";
import { useData } from "@/state/data";

export default function SiteFooter() {
  const lang = useLang();
  const t = useT();
  const { settings: contact } = useData();

  const explore = [
    { href: "/gallery?tab=animals", label: t.common.animals },
    { href: "/gallery?tab=plants", label: t.common.plants },
    { href: "/gallery?tab=activities", label: t.gallery.tabActivities },
    { href: "/gallery?tab=rates", label: t.gallery.tabRates },
    { href: "/cafe", label: t.nav.cafe },
    { href: "/about", label: t.nav.about },
    { href: "/visit", label: t.nav.visit },
  ];

  return (
    <footer className="mt-24 border-t border-line">
      <div className="shell grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl">{t.site.name}</p>
          <p className="mt-3 max-w-sm text-[0.9375rem] text-muted">{t.footer.about}</p>
        </div>

        <nav aria-label={t.footer.explore}>
          <h2 className="eyebrow">{t.footer.explore}</h2>
          <ul className="mt-4 space-y-2 text-[0.9375rem]">
            {explore.map((link) => (
              <li key={link.href}>
                <Link to={localePath(lang, link.href)} className="text-muted transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow">{t.footer.contact}</h2>
          <address className="mt-4 space-y-2 text-[0.9375rem] not-italic text-muted">
            <p>{addressFor(contact, lang)}</p>
            <p>
              <a href={`tel:${contact.phone}`} className="transition-colors hover:text-ink">
                {formatPhone(contact.phone)}
              </a>
            </p>
            {contact.facebook_url && (
              <p>
                <a href={contact.facebook_url} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
                  {t.visit.facebook}
                </a>
              </p>
            )}
          </address>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-2 py-6 text-[0.8125rem] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>{format(t.footer.rights, { year: new Date().getFullYear() })}</p>
          <Link to={localePath(lang, "/privacy")} className="transition-colors hover:text-ink">
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
