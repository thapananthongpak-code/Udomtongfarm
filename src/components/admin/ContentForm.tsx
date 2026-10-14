import { useState } from "react";
import { getDictionary, locales, type Locale } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { saveContent, type SaveResult } from "@/lib/admin";
import { CONTENT_GROUPS, CONTENT_KEYS, CONTENT_MAX_LENGTH, textAt } from "@/lib/content";
import { useData } from "@/state/data";

type Values = Record<string, Record<Locale, string>>;

/** Every editable text of the site, in both languages, grouped by where it appears. */
export default function ContentForm() {
  const lang = useLang();
  const t = useT().admin;
  const labels = t.contentForm;
  const { content, dictionaries, reload } = useData();
  // Labels come from the built-in texts, so they stay the same while the texts beside them change.
  const builtIn = getDictionary(lang);
  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(
      CONTENT_KEYS.map((key) => [key, { th: textAt(dictionaries.th, key), en: textAt(dictionaries.en, key) }]),
    ),
  );
  const [result, setResult] = useState<SaveResult | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    // A text that matches the built-in one is stored as empty, so it keeps following the site's own wording.
    const edited = (key: string, language: Locale) => {
      const value = values[key][language].trim();
      return value === textAt(getDictionary(language), key) ? "" : value;
    };
    const stored = new Set(content.map((row) => row.key));
    const rows = CONTENT_KEYS.map((key) => ({ key, th: edited(key, "th"), en: edited(key, "en") })).filter(
      (row) => row.th || row.en || stored.has(row.key),
    );

    const outcome = await saveContent(rows);
    if (outcome.ok) {
      await reload();
      // An emptied box shows the built-in text again, which is what the site now uses.
      setValues((current) =>
        Object.fromEntries(
          CONTENT_KEYS.map((key) => [
            key,
            {
              th: current[key].th.trim() || textAt(getDictionary("th"), key),
              en: current[key].en.trim() || textAt(getDictionary("en"), key),
            },
          ]),
        ),
      );
    }
    setResult(outcome);
    setSaving(false);
  }

  const languageLabels: Record<Locale, string> = { th: labels.thai, en: labels.english };

  return (
    <form onSubmit={submit} className="mt-10" noValidate>
      {CONTENT_GROUPS.map((group) => (
        <fieldset key={group.id} className="grid gap-6 border-t border-line py-10 lg:grid-cols-[14rem_1fr] lg:gap-12">
          <legend className="sr-only">{labels.groups[group.id]}</legend>
          <h2 aria-hidden className="font-serif text-2xl">
            {labels.groups[group.id]}
          </h2>
          <div className="space-y-6">
            {group.fields.map((field) => (
              <div key={field.key} role="group" aria-labelledby={`${field.key}-label`}>
                <p id={`${field.key}-label`} className="field-label">
                  {field.label(builtIn)}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {locales.map((language) => {
                    const control = {
                      "aria-label": `${field.label(builtIn)} (${languageLabels[language]})`,
                      lang: language,
                      maxLength: CONTENT_MAX_LENGTH,
                      placeholder: textAt(getDictionary(language), field.key),
                      value: values[field.key][language],
                      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                        setValues((current) => ({
                          ...current,
                          [field.key]: { ...current[field.key], [language]: event.target.value },
                        })),
                      className: "input",
                    };
                    return field.long ? <textarea key={language} rows={4} {...control} /> : <input key={language} {...control} />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-0 flex flex-wrap items-center gap-4 border-t border-ink bg-paper py-4">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? labels.saving : labels.save}
        </button>
        {result && !result.ok && (
          <p role="alert" className="text-[0.9375rem] text-danger">
            {t.errors[result.code]}
          </p>
        )}
        {result?.ok && (
          <p role="status" className="text-[0.9375rem]">
            {labels.saved}
          </p>
        )}
      </div>
    </form>
  );
}
