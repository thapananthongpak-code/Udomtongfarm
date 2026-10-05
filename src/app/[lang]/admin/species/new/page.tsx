import { notFound } from "next/navigation";
import SpeciesForm from "@/components/admin/SpeciesForm";
import { getDictionary, isLocale, localePath } from "@/i18n";
import { saveSpecies } from "../../actions";

type Props = { params: Promise<{ lang: string }> };

export default async function NewSpeciesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <h1 className="display text-4xl md:text-5xl">{dict.admin.newSpecies}</h1>
      <SpeciesForm
        action={saveSpecies.bind(null, lang, null)}
        species={null}
        cancelHref={localePath(lang, "/admin/species")}
        labels={dict.admin.form}
        errors={dict.admin.errors}
        statusLabels={dict.status}
        typeLabels={{ animal: dict.common.animal, plant: dict.common.plant }}
      />
    </>
  );
}
