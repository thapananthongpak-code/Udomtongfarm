import { useState } from "react";
import { useT } from "@/i18n/hooks";
import { applyContrast, readContrast, type Contrast } from "@/lib/contrast";

// Each button is drawn in the colours it switches to, so it looks the same whatever mode is on.
const OPTIONS: { value: Contrast; swatch: string }[] = [
  { value: "normal", swatch: "bg-[#f8f7f3] text-[#171716] border-[#85837a]" },
  { value: "light", swatch: "bg-white text-black border-black" },
  { value: "dark", swatch: "bg-black text-white border-white" },
];

/** Three buttons for the site's colours: normal, black on white, and white on black. Remembered in the browser. */
export default function ContrastControl() {
  const t = useT().a11y;
  const [mode, setMode] = useState<Contrast>(readContrast);
  const names: Record<Contrast, string> = { normal: t.contrastNormal, light: t.contrastLight, dark: t.contrastDark };

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
            className={`contrast-swatch grid size-9 place-items-center rounded-full border text-[0.875rem] font-medium leading-none ${swatch} ${
              active ? "outline-2 outline-offset-2 outline-ink" : ""
            }`}
          >
            <span aria-hidden>{t.letter}</span>
          </button>
        );
      })}
    </div>
  );
}
