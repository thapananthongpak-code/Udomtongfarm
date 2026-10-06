import PageIntro from "@/components/PageIntro";
import { useT } from "@/i18n/hooks";
import { displayUrl, formatPhone } from "@/lib/farm";
import { usePageMeta } from "@/lib/usePageMeta";
import { useData } from "@/state/data";

export default function Privacy() {
  const t = useT();
  const { settings: contact } = useData();
  usePageMeta(t.privacy.title, t.meta.privacy);

  return (
    <>
      <PageIntro eyebrow={t.privacy.eyebrow} title={t.privacy.title} lede={t.privacy.updated} />
      <div className="shell pb-8">
        <div className="max-w-2xl border-t border-ink">
          {t.privacy.sections.map((section) => (
            <section key={section.title} className="border-b border-line py-8">
              <h2 className="font-serif text-2xl">{section.title}</h2>
              <div className="prose mt-3 text-base text-muted">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
          <p className="py-8 text-[0.9375rem]">
            <a href={`tel:${contact.phone}`} className="link">
              {formatPhone(contact.phone)}
            </a>
            {contact.facebook_url && (
              <>
                <span className="mx-3 text-faint">·</span>
                <a href={contact.facebook_url} target="_blank" rel="noreferrer" className="link">
                  {displayUrl(contact.facebook_url)}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
