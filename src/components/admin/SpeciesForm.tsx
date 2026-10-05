"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { SpeciesFormState } from "@/app/[lang]/admin/actions";
import SpeciesImage from "@/components/species/SpeciesImage";
import type { Dictionary } from "@/i18n";
import { STATUS_CODES, type Source, type Species } from "@/lib/species/types";
import { getBrowserClient } from "@/lib/supabase/browser";
import { SPECIES_BUCKET } from "@/lib/supabase/env";

const IDLE: SpeciesFormState = { status: "idle" };

type Props = {
  action: (state: SpeciesFormState, formData: FormData) => Promise<SpeciesFormState>;
  /** The species being edited, or null when adding a new one. */
  species: Species | null;
  cancelHref: string;
  labels: Dictionary["admin"]["form"];
  errors: Dictionary["admin"]["errors"];
  statusLabels: Dictionary["status"];
  typeLabels: { animal: string; plant: string };
};

type Values = {
  id: string;
  type: Species["type"];
  name_th: string;
  name_en: string;
  scientific_name: string;
  status: string;
  summary_th: string;
  summary_en: string;
  body_th: string;
  body_en: string;
  image: string;
  tags: string;
  featured: boolean;
  published: boolean;
};

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const initialValues = (sp: Species | null): Values => ({
  id: sp?.id ?? "",
  type: sp?.type ?? "animal",
  name_th: sp?.name_th ?? "",
  name_en: sp?.name_en ?? "",
  scientific_name: sp?.scientific_name ?? "",
  status: sp?.status ?? "",
  summary_th: sp?.summary_th ?? "",
  summary_en: sp?.summary_en ?? "",
  body_th: sp?.body_th ?? "",
  body_en: sp?.body_en ?? "",
  image: sp?.image ?? "",
  tags: sp?.tags.join(", ") ?? "",
  featured: sp?.featured ?? false,
  published: sp?.published ?? true,
});

// Fields are controlled so that nothing typed is lost when the server reports a problem.
export default function SpeciesForm({ action, species, cancelHref, labels, errors, statusLabels, typeLabels }: Props) {
  const [state, formAction, pending] = useActionState(action, IDLE);
  const [values, setValues] = useState<Values>(() => initialValues(species));
  const [sources, setSources] = useState<Source[]>(species?.sources ?? []);
  const [upload, setUpload] = useState<"idle" | "busy" | "failed">("idle");

  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((current) => ({ ...current, [key]: value }));
  const errorFor = (name: string) => (state.fields?.[name] ? errors[state.fields[name]] : null);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const supabase = getBrowserClient();
    if (!supabase || file.size > MAX_UPLOAD_BYTES) {
      setUpload("failed");
      return;
    }

    setUpload("busy");
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${values.id || "species"}-${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from(SPECIES_BUCKET).upload(path, file, { cacheControl: "31536000" });
    if (error) {
      setUpload("failed");
      return;
    }
    set("image", supabase.storage.from(SPECIES_BUCKET).getPublicUrl(path).data.publicUrl);
    setUpload("idle");
  }

  const textField = (name: keyof Values & string, label: string, options: { hint?: string; lang?: string; required?: boolean } = {}) => {
    const error = errorFor(name);
    return (
      <div>
        <label htmlFor={name} className="field-label">
          {label}
        </label>
        <input
          id={name}
          name={name}
          lang={options.lang}
          value={values[name] as string}
          onChange={(event) => set(name, event.target.value as never)}
          aria-invalid={error ? true : undefined}
          required={options.required}
          className="input"
        />
        {error ? <p className="field-error">{error}</p> : options.hint && <p className="field-hint">{options.hint}</p>}
      </div>
    );
  };

  const textArea = (name: "summary_th" | "summary_en" | "body_th" | "body_en", label: string, rows: number, hint?: string) => (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        lang={name.endsWith("_th") ? "th" : "en"}
        value={values[name]}
        onChange={(event) => set(name, event.target.value)}
        className="input"
      />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );

  const section = "grid gap-6 border-t border-line py-10 lg:grid-cols-[14rem_1fr] lg:gap-12";

  return (
    <form action={formAction} className="mt-10" noValidate>
      {state.status === "error" && state.code && (
        <p role="alert" className="notice notice-error mb-8 max-w-xl">
          {errors[state.code]}
        </p>
      )}

      <fieldset className={section}>
        <legend className="sr-only">{labels.identity}</legend>
        <h2 aria-hidden className="font-serif text-2xl">
          {labels.identity}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="id" className="field-label">
              {labels.id}
            </label>
            <input
              id="id"
              name="id"
              value={values.id}
              onChange={(event) => set("id", event.target.value.toLowerCase())}
              readOnly={species !== null}
              aria-invalid={errorFor("id") ? true : undefined}
              spellCheck={false}
              autoCapitalize="none"
              required
              className={`input max-w-sm font-mono text-[0.9375rem] ${species ? "text-muted" : ""}`}
            />
            {errorFor("id") ? <p className="field-error">{errorFor("id")}</p> : <p className="field-hint">{labels.idHint}</p>}
          </div>

          {textField("name_th", labels.nameTh, { lang: "th", required: true })}
          {textField("name_en", labels.nameEn, { lang: "en", required: true })}
          {textField("scientific_name", labels.scientific, { lang: "la" })}

          <div>
            <label htmlFor="status" className="field-label">
              {labels.status}
            </label>
            <select id="status" name="status" value={values.status} onChange={(event) => set("status", event.target.value)} className="input">
              <option value="">{labels.statusNone}</option>
              {STATUS_CODES.map((code) => (
                <option key={code} value={code}>
                  {code} · {statusLabels[code]}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <span className="field-label" id="type-label">
              {labels.type}
            </span>
            <div role="radiogroup" aria-labelledby="type-label" className="flex gap-6">
              {(["animal", "plant"] as const).map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={values.type === type}
                    onChange={() => set("type", type)}
                    className="size-4 accent-(--accent)"
                  />
                  {typeLabels[type]}
                </label>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="sr-only">{labels.photo}</legend>
        <h2 aria-hidden className="font-serif text-2xl">
          {labels.photo}
        </h2>
        <div className="grid gap-6 sm:grid-cols-[10rem_1fr]">
          <SpeciesImage src={values.image} alt="" sizes="10rem" fit="contain" className="aspect-square w-40" />
          <div className="space-y-4">
            <div>
              <label className={`btn ${upload === "busy" ? "pointer-events-none opacity-50" : ""}`}>
                {upload === "busy" ? labels.uploading : labels.upload}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className="sr-only" />
              </label>
              <p aria-live="polite" className={upload === "failed" ? "field-error" : "field-hint"}>
                {upload === "failed" ? labels.uploadFailed : labels.photoHint}
              </p>
            </div>
            {textField("image", labels.imagePath)}
          </div>
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="sr-only">{labels.thai}</legend>
        <h2 aria-hidden className="font-serif text-2xl">
          {labels.thai}
        </h2>
        <div className="space-y-5">
          {textArea("summary_th", labels.summary, 2, labels.summaryHint)}
          {textArea("body_th", labels.body, 10)}
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="sr-only">{labels.english}</legend>
        <h2 aria-hidden className="font-serif text-2xl">
          {labels.english}
        </h2>
        <div className="space-y-5">
          {textArea("summary_en", labels.summary, 2, labels.summaryHint)}
          {textArea("body_en", labels.body, 10)}
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="sr-only">{labels.classification}</legend>
        <h2 aria-hidden className="font-serif text-2xl">
          {labels.classification}
        </h2>
        <div className="space-y-6">
          {textField("tags", labels.tags, { hint: labels.tagsHint, lang: "en" })}

          <div>
            <p className="field-label">{labels.sources}</p>
            <input type="hidden" name="sources" value={JSON.stringify(sources)} />
            <ul className="space-y-3">
              {sources.map((source, index) => {
                const update = (patch: Partial<Source>) =>
                  setSources((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
                return (
                  <li key={index} className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
                    <input
                      aria-label={`${labels.sourceTitle} ${index + 1}`}
                      placeholder={labels.sourceTitle}
                      value={source.title}
                      onChange={(event) => update({ title: event.target.value })}
                      className="input"
                    />
                    <input
                      aria-label={`${labels.sourceUrl} ${index + 1}`}
                      placeholder="https://"
                      type="url"
                      inputMode="url"
                      value={source.url}
                      onChange={(event) => update({ url: event.target.value })}
                      className="input"
                    />
                    <button
                      type="button"
                      className="btn btn-quiet"
                      onClick={() => setSources((current) => current.filter((_, i) => i !== index))}
                    >
                      {labels.removeSource}
                    </button>
                  </li>
                );
              })}
            </ul>
            {errorFor("sources") && <p className="field-error">{errorFor("sources")}</p>}
            <button
              type="button"
              className="btn btn-quiet btn-sm mt-3"
              onClick={() => setSources((current) => [...current, { title: "", url: "" }])}
            >
              {labels.addSource}
            </button>
          </div>
        </div>
      </fieldset>

      <fieldset className={section}>
        <legend className="sr-only">{labels.visibility}</legend>
        <h2 aria-hidden className="font-serif text-2xl">
          {labels.visibility}
        </h2>
        <div className="space-y-3">
          {(["published", "featured"] as const).map((name) => (
            <label key={name} className="flex items-center gap-3">
              <input
                type="checkbox"
                name={name}
                checked={values[name]}
                onChange={(event) => set(name, event.target.checked)}
                className="size-4 accent-(--accent)"
              />
              {labels[name]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3 border-t border-ink pt-8">
        <button type="submit" className="btn btn-primary" disabled={pending || upload === "busy"}>
          {pending ? labels.saving : labels.save}
        </button>
        <Link href={cancelHref} className="btn btn-quiet">
          {labels.cancel}
        </Link>
      </div>
    </form>
  );
}
