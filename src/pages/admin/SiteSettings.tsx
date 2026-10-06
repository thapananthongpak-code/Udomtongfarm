import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import PageLoading from "@/components/PageLoading";
import { useT } from "@/i18n/hooks";
import { useData } from "@/state/data";

export default function SiteSettings() {
  const t = useT().admin.siteForm;
  const { status, settings } = useData();

  if (status === "loading") return <PageLoading />;

  return (
    <>
      <h1 className="display text-4xl md:text-5xl">{t.title}</h1>
      <p className="mt-4 max-w-xl text-[0.9375rem] text-muted">{t.lede}</p>
      <SiteSettingsForm settings={settings} />
    </>
  );
}
