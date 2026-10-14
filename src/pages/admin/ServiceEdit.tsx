import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServiceForm from "@/components/admin/ServiceForm";
import NotFoundContent from "@/components/NotFoundContent";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { deleteService } from "@/lib/admin";
import { serviceName, type FarmService } from "@/lib/services";
import { supabase } from "@/lib/supabase";
import { useData } from "@/state/data";

/** The form for adding an activity or rate (no id in the address) or editing an existing one. */
export default function ServiceEdit() {
  const { id } = useParams();
  const lang = useLang();
  const t = useT().admin;
  const navigate = useNavigate();
  const { reload } = useData();
  const listHref = localePath(lang, "/admin/services");

  // undefined while loading, null when there is no such item.
  const [item, setItem] = useState<FarmService | null | undefined>(id ? undefined : null);
  const [deleteFailed, setDeleteFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    supabase
      ?.from("farm_services")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setItem(data as FarmService | null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return (
      <>
        <h1 className="display text-4xl md:text-5xl">{t.newService}</h1>
        <ServiceForm item={null} listHref={listHref} />
      </>
    );
  }

  if (item === undefined) return <div className="h-40 animate-pulse bg-wall" aria-busy="true" />;
  if (item === null) return <NotFoundContent />;

  async function remove() {
    if (!id || !window.confirm(t.serviceForm.deleteConfirm)) return;
    if (await deleteService(id)) {
      await reload();
      navigate(listHref);
    } else {
      setDeleteFailed(true);
    }
  }

  return (
    <>
      <p className="eyebrow">{t.editService}</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">{serviceName(item, lang)}</h1>
      <ServiceForm key={item.id} item={item} listHref={listHref} />
      <div className="mt-16 border-t border-line pt-8">
        <button type="button" className="btn btn-danger" onClick={remove}>
          {t.serviceForm.delete}
        </button>
        {deleteFailed && <p className="field-error">{t.errors.unknown}</p>}
      </div>
    </>
  );
}
