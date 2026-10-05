import type { Dictionary } from "@/i18n";
import { STATUS_CODES, type Status } from "@/lib/species/types";

const COLOR: Record<Status, string> = {
  LC: "var(--status-lc)",
  NT: "var(--status-nt)",
  VU: "var(--status-vu)",
  EN: "var(--status-en)",
  CR: "var(--status-cr)",
};

type Labels = Dictionary["status"];

/** A coloured dot with the IUCN code, and optionally its full name. */
export function StatusBadge({ status, labels, full = false }: { status: Status; labels: Labels; full?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[0.8125rem]" title={labels[status]}>
      <span aria-hidden className="size-2 rounded-full" style={{ background: COLOR[status] }} />
      <span className="font-medium tracking-wide">{status}</span>
      {full ? <span className="text-muted">{labels[status]}</span> : <span className="sr-only">{labels[status]}</span>}
    </span>
  );
}

/** The five IUCN categories in order, with the current one marked. */
export function StatusScale({ status, labels }: { status: Status; labels: Labels }) {
  return (
    <div>
      <p className="flex items-center gap-2.5">
        <span aria-hidden className="size-2.5 rounded-full" style={{ background: COLOR[status] }} />
        <span>
          {labels[status]} <span className="text-muted">({status})</span>
        </span>
      </p>
      <ol aria-label={labels.scale} className="mt-3 grid max-w-xs grid-cols-5 gap-1">
        {STATUS_CODES.map((code) => {
          const current = code === status;
          return (
            <li key={code} aria-current={current ? "true" : undefined} title={labels[code]}>
              <span
                className="block h-1"
                style={{ background: current ? COLOR[code] : "var(--line-strong)" }}
              />
              <span className={`mt-1.5 block text-center text-[0.6875rem] tracking-wide ${current ? "font-semibold" : "text-faint"}`}>
                {code}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
