import { useT } from "@/i18n/hooks";
import { MAX_PER_ITEM } from "@/state/cart";

type Props = { quantity: number; onChange: (quantity: number) => void; name: string; className?: string };

/** A minus, the count and a plus. Going below one removes the item. */
export default function QuantityStepper({ quantity, onChange, name, className = "" }: Props) {
  const t = useT().order;
  const button =
    "grid size-9 place-items-center rounded-full border border-control bg-surface text-lg leading-none transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <button type="button" className={button} aria-label={`${t.decrease}: ${name}`} onClick={() => onChange(quantity - 1)}>
        <span aria-hidden>−</span>
      </button>
      <span aria-live="polite" className="min-w-6 text-center font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        className={button}
        aria-label={`${t.increase}: ${name}`}
        disabled={quantity >= MAX_PER_ITEM}
        onClick={() => onChange(quantity + 1)}
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}
