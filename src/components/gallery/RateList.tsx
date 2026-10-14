import { useLang, useT } from "@/i18n/hooks";
import { formatPhone } from "@/lib/farm";
import { formatPrice } from "@/lib/menu";
import { serviceDescription, serviceName, serviceUnit, type FarmService } from "@/lib/services";
import { useData } from "@/state/data";

/** The price list. A line without a price says to ask the farm, rather than leaving a gap. */
export default function RateList({ rates }: { rates: FarmService[] }) {
  const lang = useLang();
  const labels = useT().gallery;
  const { settings } = useData();

  if (rates.length === 0) {
    return <p className="border-t border-line py-16 text-muted">{labels.ratesEmpty}</p>;
  }

  return (
    <div>
      <h2 className="sr-only">{labels.ratesListHeading}</h2>
      <ul className="card divide-y divide-line px-5">
        {rates.map((rate) => {
          const description = serviceDescription(rate, lang);
          const unit = serviceUnit(rate, lang);
          return (
            <li key={rate.id} className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
              <div>
                <h3 className="font-serif text-xl leading-snug">{serviceName(rate, lang)}</h3>
                {description && <p className="mt-1 max-w-xl text-[0.9375rem] text-muted">{description}</p>}
              </div>
              <p className="text-xl font-semibold text-accent sm:text-right">
                {rate.price === null ? (
                  <span className="font-sans text-[0.9375rem] text-muted">{labels.askFarm}</span>
                ) : rate.price === 0 ? (
                  labels.free
                ) : (
                  formatPrice(rate.price)
                )}
                {unit && rate.price !== null && rate.price > 0 && (
                  <span className="ml-2 font-sans text-[0.875rem] text-muted">{unit}</span>
                )}
              </p>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-[0.9375rem]">
        {labels.contactPrompt}{" "}
        <a href={`tel:${settings.phone}`} className="link">
          {formatPhone(settings.phone)}
        </a>
        {settings.facebook_url && (
          <>
            <span className="mx-2 text-faint">·</span>
            <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="link">
              Facebook
            </a>
          </>
        )}
      </p>
    </div>
  );
}
