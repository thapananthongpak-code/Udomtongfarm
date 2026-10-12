// The visitor's chosen text size. It scales the whole site, because every size in the
// stylesheet is in rem and the choice changes the root font size (see index.css).
// index.html applies the saved choice before the page is drawn, so there is no flash.

export type TextSize = "md" | "lg" | "xl";

const STORAGE_KEY = "text-size";

/** The size currently applied to the page. */
export function readTextSize(): TextSize {
  const applied = document.documentElement.dataset.textSize;
  return applied === "lg" || applied === "xl" ? applied : "md";
}

export function applyTextSize(size: TextSize) {
  if (size === "md") delete document.documentElement.dataset.textSize;
  else document.documentElement.dataset.textSize = size;

  try {
    window.localStorage.setItem(STORAGE_KEY, size);
  } catch {
    // The choice still applies until the page is closed.
  }
}
