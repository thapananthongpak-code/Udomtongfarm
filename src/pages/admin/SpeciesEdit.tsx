import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QrPanel from "@/components/admin/QrPanel";
import SpeciesForm from "@/components/admin/SpeciesForm";
import NotFoundContent from "@/components/NotFoundContent";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { deleteSpecies } from "@/lib/admin";
import { speciesName } from "@/lib/species/helpers";
import type { Species } from "@/lib/species/types";
import { supabase } from "@/lib/supabase";
import { useData } from "@/state/data";

/** The form for adding a species (no id in the address) or editing an existing one. */
export default function SpeciesEdit() {
  const { id } = useParams();
  const lang = useLang();
  const t = useT().admin;
  const navigate = useNavigate();
  const created = (useLocation().state as { created?: boolean } | null)?.created === true;
  const { reload } = useData();
  const listHref = localePath(lang, "/admin/species");

  // undefined while loading, null when there is no such species.
  const [species, setSpecies] = useState<Species | null | undefined>(id ? undefined : null);
  const [deleteFailed, setDeleteFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    supabase
      ?.from("species")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setSpecies(data as Species | null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return (
      <>
        <h1 className="display text-4xl md:text-5xl">{t.newSpecies}</h1>
        <SpeciesForm species={null} listHref={listHref} />
      </>
    );
  }

  if (species === undefined) return <div className="h-40 animate-pulse bg-wall" aria-busy="true" />;
  if (species === null) return <NotFoundContent />;

  async function remove() {
    if (!id || !window.confirm(t.form.deleteConfirm)) return;
    if (await deleteSpecies(id)) {
      await reload();
      navigate(listHref);
    } else {
      setDeleteFailed(true);
    }
  }

  return (
    <>
      {created && (
        <p role="status" className="notice mb-8 max-w-xl">
          {t.qr.created}
        </p>
      )}
      <p className="eyebrow">{t.editSpecies}</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">{speciesName(species, lang)}</h1>
      <QrPanel id={species.id} name={speciesName(species, lang)} published={species.published} />
      <SpeciesForm key={species.id} species={species} listHref={listHref} />
      <div className="mt-16 border-t border-line pt-8">
        <button type="button" className="btn btn-danger" onClick={remove}>
          {t.form.delete}
        </button>
        {deleteFailed && <p className="field-error">{t.errors.unknown}</p>}
      </div>
    </>
  );
}
