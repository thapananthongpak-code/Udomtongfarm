import SpeciesImage from "@/components/species/SpeciesImage";
import { useLang, useT } from "@/i18n/hooks";
import { serviceDescription, serviceName, type FarmService } from "@/lib/services";

/** The activities, each with its photograph. A frame stands in until a photo is added. */
export default function ActivityGrid({ activities }: { activities: FarmService[] }) {
  const lang = useLang();
  const labels = useT().gallery;

  if (activities.length === 0) {
    return <p className="border-t border-line py-16 text-muted">{labels.activitiesEmpty}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {activities.map((activity) => {
        const description = serviceDescription(activity, lang);
        return (
          <li key={activity.id}>
            <SpeciesImage src={activity.image} alt="" className="aspect-[4/3]" />
            <h3 className="mt-4 font-serif text-xl leading-snug">{serviceName(activity, lang)}</h3>
            {description && <p className="mt-1 text-[0.9375rem] text-muted">{description}</p>}
          </li>
        );
      })}
    </ul>
  );
}
