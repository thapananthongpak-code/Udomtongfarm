import type { Dictionary } from "@/i18n";

/** What a visitor finds on the farm: the collection, activities, the homestay and the café. */
export default function FarmOffers({ offers }: { offers: Dictionary["farm"]["offers"] }) {
  return (
    <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
      {offers.map((offer, index) => (
        <li key={offer.title} className="border-t border-ink pt-5">
          <p className="font-serif text-[0.9375rem] text-faint">{String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-2 font-serif text-2xl">{offer.title}</h3>
          <p className="mt-3 text-[0.9375rem] text-muted">{offer.body}</p>
        </li>
      ))}
    </ol>
  );
}
