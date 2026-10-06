type Props = { eyebrow?: string; title: string; children?: React.ReactNode };

export default function SectionHeading({ eyebrow, title, children }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className={`display text-3xl md:text-4xl ${eyebrow ? "mt-3" : ""}`}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
