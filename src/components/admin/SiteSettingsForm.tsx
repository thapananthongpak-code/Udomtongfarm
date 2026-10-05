import { useState } from "react";
import { useT } from "@/i18n/hooks";
import { saveSiteSettings, type SaveResult } from "@/lib/admin";
import type { SiteSettings } from "@/lib/farm";
import { useData } from "@/state/data";

export default function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const t = useT().admin;
  const labels = t.siteForm;
  const { reload } = useData();
  const [values, setValues] = useState<SiteSettings>(settings);
  const [result, setResult] = useState<SaveResult | null>(null);
  const [saving, setSaving] = useState(false);

  const fields: { name: keyof SiteSettings; label: string; hint?: string; type?: string; lang?: string }[] = [
    { name: "phone", label: labels.phone, hint: labels.phoneHint, type: "tel" },
    { name: "facebook_url", label: labels.facebook, hint: labels.facebookHint, type: "url" },
    { name: "map_url", label: labels.mapUrl, hint: labels.mapUrlHint, type: "url" },
    { name: "address_th", label: labels.addressTh, lang: "th" },
    { name: "address_en", label: labels.addressEn, lang: "en" },
  ];

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const outcome = await saveSiteSettings(values);
    if (outcome.ok) await reload();
    setResult(outcome);
    setSaving(false);
  }

  const problems = result && !result.ok ? result.fields : undefined;

  return (
    <form onSubmit={submit} className="mt-10 max-w-xl space-y-6 border-t border-line pt-10" noValidate>
      {result && !result.ok && (
        <p role="alert" className="notice notice-error">
          {t.errors[result.code]}
        </p>
      )}
      {result?.ok && (
        <p role="status" className="notice">
          {labels.saved}
        </p>
      )}

      {fields.map((field) => {
        const problem = problems?.[field.name];
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="field-label">
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type ?? "text"}
              lang={field.lang}
              value={values[field.name]}
              onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
              aria-invalid={problem ? true : undefined}
              className="input"
            />
            {problem ? <p className="field-error">{t.errors[problem]}</p> : field.hint && <p className="field-hint">{field.hint}</p>}
          </div>
        );
      })}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? labels.saving : labels.save}
      </button>
    </form>
  );
}
