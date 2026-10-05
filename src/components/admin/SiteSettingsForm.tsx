"use client";

import { useActionState, useState } from "react";
import type { SiteFormState } from "@/app/[lang]/admin/actions";
import type { Dictionary } from "@/i18n";
import type { SiteSettings } from "@/lib/settings";

const IDLE: SiteFormState = { status: "idle" };

type Props = {
  action: (state: SiteFormState, formData: FormData) => Promise<SiteFormState>;
  settings: SiteSettings;
  labels: Dictionary["admin"]["siteForm"];
  errors: Dictionary["admin"]["errors"];
};

// Fields are controlled so that nothing typed is lost when the server reports a problem.
export default function SiteSettingsForm({ action, settings, labels, errors }: Props) {
  const [state, formAction, pending] = useActionState(action, IDLE);
  const [values, setValues] = useState<SiteSettings>(settings);

  const fields: { name: keyof SiteSettings; label: string; hint?: string; type?: string; lang?: string }[] = [
    { name: "phone", label: labels.phone, hint: labels.phoneHint, type: "tel" },
    { name: "facebook_url", label: labels.facebook, hint: labels.facebookHint, type: "url" },
    { name: "map_url", label: labels.mapUrl, hint: labels.mapUrlHint, type: "url" },
    { name: "address_th", label: labels.addressTh, lang: "th" },
    { name: "address_en", label: labels.addressEn, lang: "en" },
  ];

  return (
    <form action={formAction} className="mt-10 max-w-xl space-y-6 border-t border-line pt-10" noValidate>
      {state.status === "error" && state.code && (
        <p role="alert" className="notice notice-error">
          {errors[state.code]}
        </p>
      )}
      {state.status === "saved" && (
        <p role="status" className="notice">
          {labels.saved}
        </p>
      )}

      {fields.map((field) => {
        const problem = state.fields?.[field.name];
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="field-label">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              lang={field.lang}
              value={values[field.name]}
              onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
              aria-invalid={problem ? true : undefined}
              className="input"
            />
            {problem ? <p className="field-error">{errors[problem]}</p> : field.hint && <p className="field-hint">{field.hint}</p>}
          </div>
        );
      })}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? labels.saving : labels.save}
      </button>
    </form>
  );
}
