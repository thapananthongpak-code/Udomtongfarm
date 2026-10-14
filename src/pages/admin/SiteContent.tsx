import ContentForm from "@/components/admin/ContentForm";
import { useT } from "@/i18n/hooks";

export default function SiteContent() {
  const t = useT().admin.contentForm;

  return (
    <>
      <h1 className="display text-4xl md:text-5xl">{t.title}</h1>
      <p className="mt-4 max-w-xl text-[0.9375rem] text-muted">{t.lede}</p>
      <ContentForm />
    </>
  );
}
