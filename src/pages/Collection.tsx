import PageIntro from "@/components/PageIntro";
import PageLoading from "@/components/PageLoading";
import CollectionBrowser from "@/components/species/CollectionBrowser";
import { useT } from "@/i18n/hooks";
import { usePageMeta } from "@/lib/usePageMeta";
import { useData } from "@/state/data";

export default function Collection() {
  const t = useT();
  const { status, species } = useData();
  usePageMeta(t.collection.title, t.meta.collection);

  return (
    <>
      <PageIntro eyebrow={t.collection.eyebrow} title={t.collection.title} lede={t.collection.lede} />
      {status === "loading" ? <PageLoading /> : <CollectionBrowser species={species} />}
    </>
  );
}
