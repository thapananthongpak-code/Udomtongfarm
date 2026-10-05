import { notFound } from "next/navigation";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import { getDictionary, isLocale } from "@/i18n";
import { getSiteSettings } from "@/lib/settings";
import { saveSiteSettings } from "../actions";

type Props = { params: Promise<{ lang: string }> };

export default async function AdminSitePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang).admin;
  const settings = await getSiteSettings();

  return (
    <>
      <h1 className="display text-4xl md:text-5xl">{t.siteForm.title}</h1>
      <p className="mt-4 max-w-xl text-[0.9375rem] text-muted">{t.siteForm.lede}</p>
      <SiteSettingsForm action={saveSiteSettings} settings={settings} labels={t.siteForm} errors={t.errors} />
    </>
  );
}
