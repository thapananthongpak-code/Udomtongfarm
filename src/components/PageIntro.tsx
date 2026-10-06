type Props = { eyebrow: string; title: string; lede?: string; children?: React.ReactNode };

/** The opening block of an inner page: a small label, the page title and an optional introduction. */
export default function PageIntro({ eyebrow, title, lede, children }: Props) {
  return (
    <header className="shell pb-12 pt-14 md:pb-16 md:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-4 max-w-4xl text-4xl md:text-6xl">{title}</h1>
      {lede && <p className="lede mt-6 max-w-2xl">{lede}</p>}
      {children}
    </header>
  );
}
