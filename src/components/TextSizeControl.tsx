import { useState } from "react";
import { useT } from "@/i18n/hooks";
import { applyTextSize, readTextSize, type TextSize } from "@/lib/textSize";

// The letter grows with the choice, so the buttons can be told apart by sight as well as by name.
const OPTIONS: { value: TextSize; letter: string }[] = [
  { value: "md", letter: "text-[0.8125rem]" },
  { value: "lg", letter: "text-base" },
  { value: "xl", letter: "text-xl" },
];

/** Three buttons that make all text on the site larger. The choice is remembered in the browser. */
export default function TextSizeControl() {
  const t = useT().a11y;
  const [size, setSize] = useState<TextSize>(readTextSize);
  const names: Record<TextSize, string> = { md: t.normal, lg: t.large, xl: t.extraLarge };

  function choose(next: TextSize) {
    setSize(next);
    applyTextSize(next);
  }

  return (
    <div role="group" aria-label={t.textSize} className="inline-flex">
      {OPTIONS.map(({ value, letter }) => {
        const active = size === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={`${t.textSize}: ${names[value]}`}
            title={names[value]}
            onClick={() => choose(value)}
            className={`-ml-px grid size-9 place-items-center border transition-colors first:ml-0 ${
              active ? "relative border-ink bg-ink text-paper" : "border-control bg-surface text-ink hover:border-ink hover:bg-wall"
            }`}
          >
            <span aria-hidden className={`${letter} leading-none`}>
              {t.letter}
            </span>
          </button>
        );
      })}
    </div>
  );
}
