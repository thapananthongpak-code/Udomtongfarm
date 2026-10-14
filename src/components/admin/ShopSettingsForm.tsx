import { useState } from "react";
import { useT } from "@/i18n/hooks";
import { saveShopSettings, type SaveResult, type ShopFormValues } from "@/lib/admin";
import type { ShopSettings } from "@/lib/shop";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";
import { useData } from "@/state/data";

const toValues = (shop: ShopSettings): ShopFormValues => ({
  ordering_open: shop.ordering_open,
  promptpay_id: shop.promptpay_id,
  table_count: String(shop.table_count),
});

export default function ShopSettingsForm({ shop }: { shop: ShopSettings }) {
  const t = useT().admin;
  const labels = t.shopForm;
  const { reload } = useData();
  const [values, setValues] = useState<ShopFormValues>(() => toValues(shop));
  const [result, setResult] = useState<SaveResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(() => JSON.stringify(toValues(shop)));
  useUnsavedChanges(JSON.stringify(values) !== saved, t.unsavedConfirm);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const outcome = await saveShopSettings(values);
    if (outcome.ok) {
      await reload();
      setSaved(JSON.stringify(values));
    }
    setResult(outcome);
    setSaving(false);
  }

  const problems = result && !result.ok ? result.fields : undefined;

  return (
    <form onSubmit={submit} className="mt-8 max-w-xl space-y-6" noValidate>
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

      <div>
        <label className="flex items-center gap-3 font-semibold">
          <input
            type="checkbox"
            checked={values.ordering_open}
            onChange={(event) => setValues((current) => ({ ...current, ordering_open: event.target.checked }))}
            className="size-5 accent-(--accent)"
          />
          {labels.open}
        </label>
        <p className="field-hint">{labels.openHint}</p>
      </div>

      <div>
        <label htmlFor="promptpay_id" className="field-label">
          {labels.promptpay}
        </label>
        <input
          id="promptpay_id"
          inputMode="numeric"
          autoComplete="off"
          className="input max-w-sm"
          value={values.promptpay_id}
          onChange={(event) => setValues((current) => ({ ...current, promptpay_id: event.target.value }))}
          aria-invalid={problems?.promptpay_id ? true : undefined}
        />
        {problems?.promptpay_id ? <p className="field-error">{labels.promptpayInvalid}</p> : <p className="field-hint">{labels.promptpayHint}</p>}
        {values.promptpay_id.trim() !== "" && <p className="notice mt-3">{labels.promptpayWarning}</p>}
      </div>

      <div>
        <label htmlFor="table_count" className="field-label">
          {labels.tables}
        </label>
        <input
          id="table_count"
          inputMode="numeric"
          className="input max-w-40"
          value={values.table_count}
          onChange={(event) => setValues((current) => ({ ...current, table_count: event.target.value }))}
          aria-invalid={problems?.table_count ? true : undefined}
        />
        {problems?.table_count ? <p className="field-error">{labels.tablesInvalid}</p> : <p className="field-hint">{labels.tablesHint}</p>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? labels.saving : labels.save}
      </button>
    </form>
  );
}
