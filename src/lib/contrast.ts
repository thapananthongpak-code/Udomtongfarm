// The customer's chosen colour contrast: the site's own colours, black text on white, or white text on black.
// The choice swaps the colour tokens in index.css through a data attribute on <html>.
// index.html applies the saved choice before the page is drawn, so there is no flash.

export type Contrast = "normal" | "light" | "dark";

const STORAGE_KEY = "contrast";

/** The mode currently applied to the page. */
export function readContrast(): Contrast {
  const applied = document.documentElement.dataset.contrast;
  return applied === "light" || applied === "dark" ? applied : "normal";
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
