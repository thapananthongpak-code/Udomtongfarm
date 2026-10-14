import { useState } from "react";
import { useT } from "@/i18n/hooks";
import { applyContrast, readContrast, type Contrast } from "@/lib/contrast";

// Each button is drawn in the colours it switches to, so it looks the same whatever mode is on.
const OPTIONS: { value: Contrast; swatch: string }[] = [
  { value: "normal", swatch: "bg-white text-[#1f7a43] border-[#6f8a74]" },
  { value: "dark", swatch: "bg-black text-[#4ade80] border-[#4ade80]" },
];

/** Two buttons for the site's colours: green and white, or the contrast mode, black with green. Remembered in the browser. */
export default function ContrastControl() {
  const t = useT().a11y;
  const [mode, setMode] = useState<Contrast>(readContrast);
  const names: Record<Contrast, string> = { normal: t.contrastNormal, dark: t.contrastDark };

  function choose(next: Contrast) {
    setMode(next);
    applyContrast(next);
  }

  return (
    <div role="group" aria-label={t.contrast} className="inline-flex gap-1.5">
      {OPTIONS.map(({ value, swatch }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={`${t.contrast}: ${names[value]}`}
            title={names[value]}
            onClick={() => choose(value)}
            className={`contrast-swatch grid size-9 place-items-center rounded-full border text-[0.875rem] font-semibold leading-none ${swatch} ${
              active ? "outline-2 outline-offset-2 outline-accent" : ""
            }`}
          >
            <span aria-hidden>{t.letter}</span>
          </button>
        );
      })}
    </div>
  );
}
