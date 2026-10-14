// The customer's chosen colours: the site's green and white, or the contrast mode, black with green.
// The choice swaps the colour tokens in index.css through a data attribute on <html>.
// index.html applies the saved choice before the page is drawn, so there is no flash.

export type Contrast = "normal" | "dark";

const STORAGE_KEY = "contrast";

/** The mode currently applied to the page. */
export function readContrast(): Contrast {
  const applied = document.documentElement.dataset.contrast;
  // An earlier version also had "light"; it now falls back to the normal colours.
  return applied === "dark" ? "dark" : "normal";
}

export function applyContrast(mode: Contrast) {
  if (mode === "normal") delete document.documentElement.dataset.contrast;
  else document.documentElement.dataset.contrast = mode;

  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // The choice still applies until the page is closed.
  }
}
