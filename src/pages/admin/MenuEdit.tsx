import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuForm from "@/components/admin/MenuForm";
import NotFoundContent from "@/components/NotFoundContent";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { deleteMenuItem } from "@/lib/admin";
import { menuName, type MenuItem } from "@/lib/menu";
import { supabase } from "@/lib/supabase";
import { useData } from "@/state/data";

/** The form for adding a menu item (no id in the address) or editing an existing one. */
export default function MenuEdit() {
  const { id } = useParams();
  const lang = useLang();
  const t = useT().admin;
  const navigate = useNavigate();
  const { reload } = useData();
  const listHref = localePath(lang, "/admin/menu");

  // undefined while loading, null when there is no such item.
  const [item, setItem] = useState<MenuItem | null | undefined>(id ? undefined : null);
  const [deleteFailed, setDeleteFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    supabase
      ?.from("menu_items")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setItem(data as MenuItem | null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return (
      <>
        <h1 className="display text-4xl md:text-5xl">{t.newMenuItem}</h1>
        <MenuForm item={null} listHref={listHref} />
      </>
    );
  }

  if (item === undefined) return <div className="h-40 animate-pulse bg-wall" aria-busy="true" />;
  if (item === null) return <NotFoundContent />;

  async function remove() {
    if (!id || !window.confirm(t.menuForm.deleteConfirm)) return;
    if (await deleteMenuItem(id)) {
      await reload();
      navigate(listHref);
    } else {
      setDeleteFailed(true);
    }
  }

  return (
    <>
      <p className="eyebrow">{t.editMenuItem}</p>
      <h1 className="display mt-3 text-4xl md:text-5xl">{menuName(item, lang)}</h1>
      <MenuForm key={item.id} item={item} listHref={listHref} />
      <div className="mt-16 border-t border-line pt-8">
        <button type="button" className="btn btn-danger" onClick={remove}>
          {t.menuForm.delete}
        </button>
        {deleteFailed && <p className="field-error">{t.errors.unknown}</p>}
      </div>
    </>
  );
}
