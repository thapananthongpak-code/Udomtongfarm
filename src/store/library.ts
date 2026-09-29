import { create } from "zustand";
import { readJSON, removeKey, writeJSON } from "../lib/storage";
import { SPECIES_BY_ID } from "../lib/species";

const SAVED_KEY = "uf_saved";
const RECENT_KEY = "uf_recent";
const MAX_RECENT = 12;

const known = (ids: unknown): string[] =>
  Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string" && SPECIES_BY_ID.has(id)) : [];

function initialSaved(): string[] {
  const current = readJSON<string[] | null>(SAVED_KEY, null);
  if (current) return known(current);
  // Carry over favourites from the previous version of the site.
  return known(readJSON<string[]>("uf_favorites", []));
}

function initialRecent(): string[] {
  const current = readJSON<string[] | null>(RECENT_KEY, null);
  if (current) return known(current);
  const legacy = readJSON<{ id: string }[]>("uf_recently_viewed_guest", []);
  return known(Array.isArray(legacy) ? legacy.map((x) => x?.id) : []);
}

type LibraryState = {
  saved: string[];
  recent: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => boolean;
  removeSaved: (id: string) => void;
  clearSaved: () => void;
  recordView: (id: string) => void;
  clearRecent: () => void;
};

export const useLibrary = create<LibraryState>((set, get) => ({
  saved: initialSaved(),
  recent: initialRecent(),
  isSaved: (id) => get().saved.includes(id),
  toggleSaved: (id) => {
    const wasSaved = get().saved.includes(id);
    set({ saved: wasSaved ? get().saved.filter((x) => x !== id) : [id, ...get().saved] });
    return !wasSaved;
  },
  removeSaved: (id) => set({ saved: get().saved.filter((x) => x !== id) }),
  clearSaved: () => set({ saved: [] }),
  recordView: (id) => {
    const recent = [id, ...get().recent.filter((x) => x !== id)].slice(0, MAX_RECENT);
    if (recent.join() !== get().recent.join()) set({ recent });
  },
  clearRecent: () => set({ recent: [] }),
}));

writeJSON(SAVED_KEY, useLibrary.getState().saved);
writeJSON(RECENT_KEY, useLibrary.getState().recent);
removeKey("uf_favorites");

useLibrary.subscribe((state, prev) => {
  if (state.saved !== prev.saved) writeJSON(SAVED_KEY, state.saved);
  if (state.recent !== prev.recent) writeJSON(RECENT_KEY, state.recent);
});

// Stay in sync when the list changes in another tab.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === SAVED_KEY) useLibrary.setState({ saved: known(readJSON(SAVED_KEY, [])) });
    if (event.key === RECENT_KEY) useLibrary.setState({ recent: known(readJSON(RECENT_KEY, [])) });
  });
}
