import type { Dictionary } from "@/i18n";

/** What a customer finds on the farm: the animals and plants, activities, the homestay and the café. */
export default function FarmOffers({ offers }: { offers: Dictionary["farm"]["offers"] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {offers.map((offer, index) => (
        <li key={offer.title} className="group lift card flex gap-4 p-5 hover:border-accent sm:block sm:p-6">
          <p
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full bg-wall text-[0.875rem] font-semibold text-accent transition-colors group-hover:bg-accent group-hover:text-on-accent"
          >
            {index + 1}
          </p>
          <div>
            <h3 className="text-xl sm:mt-4">{offer.title}</h3>
            <p className="mt-1.5 text-[0.9375rem] text-muted sm:mt-2">{offer.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
