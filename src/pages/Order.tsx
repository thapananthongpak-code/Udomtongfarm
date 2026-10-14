import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import QuantityStepper from "@/components/order/QuantityStepper";
import PageIntro from "@/components/PageIntro";
import PageLoading from "@/components/PageLoading";
import { format, localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { formatPrice, menuName } from "@/lib/menu";
import { placeOrder, rememberOrder, type OrderErrorCode, type PaymentMethod } from "@/lib/orders";
import { usePageMeta } from "@/lib/usePageMeta";
import { useCart } from "@/state/cart";
import { useData } from "@/state/data";

const NAME_KEY = "order-name";

/** The basket: what is in it, who it is for, where to collect it and how to pay. */
export default function Order() {
  const lang = useLang();
  const t = useT();
  const labels = t.order;
  const navigate = useNavigate();
  const { status, shop, reload } = useData();
  const { lines, total, table, setQuantity, setTable, clear } = useCart();
  usePageMeta(labels.title);

  const [name, setName] = useState(() => {
    try {
      return window.localStorage.getItem(NAME_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [note, setNote] = useState("");
  const promptpayReady = shop.promptpay_id !== "";
  // PromptPay is the default as soon as it is available; the customer's own choice wins.
  const [chosen, setChosen] = useState<PaymentMethod | null>(null);
  const method: PaymentMethod = chosen === "cash" || !promptpayReady ? "cash" : "promptpay";
  const [error, setError] = useState<OrderErrorCode | null>(null);
  const [sending, setSending] = useState(false);

  if (status === "loading") return <PageLoading />;

  // A table number that no longer exists (the number of tables was lowered) is treated as the counter.
  const validTable = table !== null && table >= 1 && table <= shop.table_count ? table : null;
  const tables = Array.from({ length: shop.table_count }, (_, i) => i + 1);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending || lines.length === 0) return;
    setSending(true);
    setError(null);

    const result = await placeOrder({
      name,
      table: validTable,
      note,
      method,
      items: lines.map((line) => ({ id: line.item.id, quantity: line.quantity })),
    });
    setSending(false);

    if (!result.ok) {
      setError(result.code);
      // Something may have sold out since the menu was loaded.
      if (result.code === "item_unavailable") void reload();
      return;
    }
    try {
      window.localStorage.setItem(NAME_KEY, name.trim());
    } catch {
      // Not remembering the name only means typing it again.
    }
    rememberOrder(result.id);
    clear();
    navigate(localePath(lang, `/order/${result.id}`), { replace: true });
  }

  if (lines.length === 0) {
    return (
      <>
        <PageIntro eyebrow={t.cafe.eyebrow} title={labels.title} />
        <section className="shell pb-8">
          <p className="text-muted">{labels.empty}</p>
          <Link to={localePath(lang, "/cafe")} className="btn btn-primary mt-6">
            {labels.backToMenu}
          </Link>
        </section>
      </>
    );
  }

  const closed = !shop.ordering_open;

  return (
    <>
      <PageIntro eyebrow={t.cafe.eyebrow} title={labels.title} />
      <form onSubmit={submit} className="shell grid gap-10 pb-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14" noValidate>
        <div>
          <ul className="card divide-y divide-line px-5">
            {lines.map((line) => (
              <li key={line.item.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
                <div className="min-w-0">
                  <p className="font-semibold">{menuName(line.item, lang)}</p>
                  <p className="text-[0.875rem] text-muted">{formatPrice(line.item.price ?? 0)}</p>
                </div>
                <div className="flex items-center gap-5">
                  <QuantityStepper
                    quantity={line.quantity}
                    name={menuName(line.item, lang)}
                    onChange={(next) => setQuantity(line.item.id, next)}
                  />
                  <p className="w-20 text-right font-semibold tabular-nums">{formatPrice(line.lineTotal)}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-baseline justify-between gap-4 px-1 text-lg">
            <span>{labels.total}</span>
            <span className="text-3xl font-semibold text-accent">{formatPrice(total)}</span>
          </p>
          <Link to={localePath(lang, "/cafe")} className="link mt-4 inline-block text-[0.9375rem]">
            {labels.backToMenu}
          </Link>
        </div>

        <div className="space-y-7">
          {(closed || error) && (
            <p role="alert" className="notice notice-error">
              {closed ? labels.errors.ordering_closed : labels.errors[error!]}
            </p>
          )}

          <div>
            <label htmlFor="order-name" className="field-label">
              {labels.yourName}
            </label>
            <input
              id="order-name"
              className="input"
              value={name}
              maxLength={60}
              autoComplete="given-name"
              onChange={(event) => setName(event.target.value)}
              aria-invalid={error === "invalid_name" ? true : undefined}
              required
            />
            <p className="field-hint">{labels.yourNameHint}</p>
          </div>

          <div>
            <label htmlFor="order-note" className="field-label">
              {labels.note}
            </label>
            <input id="order-note" className="input" value={note} maxLength={200} onChange={(event) => setNote(event.target.value)} />
            <p className="field-hint">{labels.noteHint}</p>
          </div>

          <div>
            <label htmlFor="order-where" className="field-label">
              {labels.where}
            </label>
            <select
              id="order-where"
              className="input"
              value={validTable ?? ""}
              onChange={(event) => setTable(event.target.value === "" ? null : Number(event.target.value))}
            >
              <option value="">{labels.counter}</option>
              {tables.map((n) => (
                <option key={n} value={n}>
                  {format(labels.tableN, { n })}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="field-label">{labels.pay}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  { value: "promptpay", title: labels.payPromptpay, hint: labels.payPromptpayHint, disabled: !promptpayReady },
                  { value: "cash", title: labels.payCash, hint: labels.payCashHint, disabled: false },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`card block cursor-pointer p-4 transition-colors has-[:checked]:border-accent has-[:checked]:bg-wall ${
                    option.disabled ? "cursor-not-allowed opacity-50" : "hover:border-accent"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    value={option.value}
                    checked={method === option.value}
                    disabled={option.disabled}
                    onChange={() => setChosen(option.value)}
                  />
                  <span className="block font-semibold">{option.title}</span>
                  <span className="mt-1 block text-[0.875rem] text-muted">{option.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="btn btn-primary w-full py-3 text-base" disabled={sending || closed || !name.trim()}>
            {sending ? labels.placing : `${labels.place} · ${formatPrice(total)}`}
          </button>
        </div>
      </form>
    </>
  );
}
