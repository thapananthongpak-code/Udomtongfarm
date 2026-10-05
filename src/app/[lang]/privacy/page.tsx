import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import { getDictionary, isLocale } from "@/i18n";
import { displayUrl, formatPhone, getSiteSettings } from "@/lib/settings";

export const revalidate = 3600;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.privacy.title,
    description: t.meta.privacy,
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: { th: "/th/privacy", en: "/en/privacy", "x-default": "/th/privacy" },
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const contact = await getSiteSettings();

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
