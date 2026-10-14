import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SpeciesImage from "@/components/species/SpeciesImage";
import { useT } from "@/i18n/hooks";
import { saveMenuItem, uploadPhoto, type MenuFormValues as Values, type SaveResult } from "@/lib/admin";
import { MENU_CATEGORIES, type MenuCategory, type MenuItem } from "@/lib/menu";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";
import { useData } from "@/state/data";

type Props = {
  /** The item being edited, or null when adding a new one. */
  item: MenuItem | null;
  /** Where to go after saving or cancelling. */
  listHref: string;
};

const initialValues = (item: MenuItem | null): Values => ({
  category: item?.category ?? "coffee",
  name_th: item?.name_th ?? "",
  name_en: item?.name_en ?? "",
  description_th: item?.description_th ?? "",
  description_en: item?.description_en ?? "",
  price: item?.price?.toString() ?? "",
  image: item?.image ?? "",
  sort_order: item?.sort_order.toString() ?? "",
  published: item?.published ?? true,
  available: item?.available ?? true,
});

export default function MenuForm({ item, listHref }: Props) {
  const t = useT();
  const labels = t.admin.menuForm;
  const shared = t.admin.form;
  const errors = t.admin.errors;
  const navigate = useNavigate();
  const { reload } = useData();
  const [values, setValues] = useState<Values>(() => initialValues(item));
  const [upload, setUpload] = useState<"idle" | "busy" | "failed">("idle");
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, setPending] = useState(false);
  const [opened] = useState(() => JSON.stringify(initialValues(item)));
  const { allowLeave } = useUnsavedChanges(JSON.stringify(values) !== opened, t.admin.unsavedConfirm);

  const problems = result && !result.ok ? result.fields : undefined;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const outcome = await saveMenuItem(values, item?.id ?? null);
    if (outcome.ok) {
      await reload();
      allowLeave();
      navigate(listHref);
      return;
    }
    setResult(outcome);
    setPending(false);
    window.scrollTo({ top: 0 });
  }

  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((current) => ({ ...current, [key]: value }));

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUpload("busy");
    const url = await uploadPhoto(file, "menu/item");
    if (url) set("image", url);
    setUpload(url ? "idle" : "failed");
  }

  type TextName = Exclude<keyof Values, "category" | "published" | "available">;
  const textField = (
    name: TextName,
    label: string,
    options: { hint?: string; lang?: string; required?: boolean; numeric?: boolean } = {},
  ) => {
    const error = problems?.[name] ? errors[problems[name]] : null;
    return (
      <div>
        <label htmlFor={name} className="field-label">
          {label}
        </label>
        <input
          id={name}
          name={name}
          lang={options.lang}
          inputMode={options.numeric ? "numeric" : undefined}
          value={values[name]}
          onChange={(event) => set(name, event.target.value)}
          aria-invalid={error ? true : undefined}
          required={options.required}
          className={`input ${options.numeric ? "max-w-40" : ""}`}
        />
        {error ? <p className="field-error">{error}</p> : options.hint && <p className="field-hint">{options.hint}</p>}
      </div>
    );
  };

  const section = "grid gap-6 border-t border-line py-10 lg:grid-cols-[14rem_1fr] lg:gap-12";

  return (
    <form onSubmit={submit} className="mt-10" noValidate>
      {result && !result.ok && (
        <p role="alert" className="notice notice-error mb-8 max-w-xl">
          {errors[result.code]}
        </p>
      )}

      <fieldset className={section}>
        <legend className="sr-only">{labels.details}</legend>
        <h2 aria-hidden className="font-serif text-2xl">
          {labels.details}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="category" className="field-label">
              {labels.category}
            </label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={(event) => set("category", event.target.value as MenuCategory)}
              className="input max-w-sm"
            >
              {MENU_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {t.cafe.categories[category]}
                </option>
              ))}
            </select>
          </div>

          {textField("name_th", shared.nameTh, { lang: "th", required: true })}
          {textField("name_en", shared.nameEn, { lang: "en", hint: labels.nameEnHint })}
          {textField("description_th", labels.descriptionTh, { lang: "th", hint: labels.descriptionHint })}
          {textField("description_en", labels.descriptionEn, { lang: "en", hint: labels.descriptionHint })}
          {textField("price", labels.price, { hint: labels.priceHint, numeric: true })}
          {textField("sort_order", labels.sortOrder, { hint: labels.sortOrderHint, numeric: true })}
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="sr-only">{shared.photo}</legend>
        <h2 aria-hidden className="font-serif text-2xl">
          {shared.photo}
        </h2>
        <div className="grid gap-6 sm:grid-cols-[10rem_1fr]">
          <SpeciesImage src={values.image} alt="" className="aspect-square w-40" />
          <div className="space-y-4">
            <div>
              <label className={`btn ${upload === "busy" ? "pointer-events-none opacity-50" : ""}`}>
                {upload === "busy" ? shared.uploading : shared.upload}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="sr-only" />
              </label>
              <p aria-live="polite" className={upload === "failed" ? "field-error" : "field-hint"}>
                {upload === "failed" ? shared.uploadFailed : shared.photoHint}
              </p>
            </div>
            {textField("image", shared.imagePath)}
          </div>
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="sr-only">{shared.visibility}</legend>
        <h2 aria-hidden className="font-serif text-2xl">
          {shared.visibility}
        </h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            checked={values.published}
            onChange={(event) => set("published", event.target.checked)}
            className="size-4 accent-(--accent)"
          />
          {labels.published}
        </label>
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="available"
              checked={values.available}
              onChange={(event) => set("available", event.target.checked)}
              className="size-4 accent-(--accent)"
            />
            {labels.available}
          </label>
          <p className="field-hint">{labels.availableHint}</p>
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3 border-t border-ink pt-8">
        <button type="submit" className="btn btn-primary" disabled={pending || upload === "busy"}>
          {pending ? shared.saving : shared.save}
        </button>
        <Link to={listHref} className="btn btn-quiet">
          {shared.cancel}
        </Link>
      </div>
    </form>
  );
}
