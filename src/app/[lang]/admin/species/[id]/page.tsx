import { notFound } from "next/navigation";
import DeleteSpeciesButton from "@/components/admin/DeleteSpeciesButton";
import SpeciesForm from "@/components/admin/SpeciesForm";
import { getDictionary, isLocale, localePath } from "@/i18n";
import { speciesName } from "@/lib/species/helpers";
import { getSpeciesForAdmin } from "@/lib/species/repository";
import { deleteSpecies, saveSpecies } from "../../actions";

type Props = { params: Promise<{ lang: string; id: string }> };

export default async function EditSpeciesPage({ params }: Props) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const species = await getSpeciesForAdmin(id);
  if (!species) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <p className="eyebrow">{dict.admin.editSpecies}</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">{speciesName(species, lang)}</h1>
      <SpeciesForm
        action={saveSpecies.bind(null, lang, species.id)}
        species={species}
        cancelHref={localePath(lang, "/admin/species")}
        labels={dict.admin.form}
        errors={dict.admin.errors}
        statusLabels={dict.status}
        typeLabels={{ animal: dict.common.animal, plant: dict.common.plant }}
      />
      <div className="mt-16 border-t border-line pt-8">
        <DeleteSpeciesButton
          action={deleteSpecies.bind(null, lang, species.id)}
          label={dict.admin.form.delete}
          confirmText={dict.admin.form.deleteConfirm}
        />
      </div>
    </>
  );
}
