import { create } from "zustand";

export interface GalleryItem {
  id: string;
  image: string;         // URL or base64 data:
  titleTh: string;
  titleEn: string;
  category: "animal" | "plant" | "other";
  addedAt: string;       // ISO string
}

const STORAGE_KEY = "uf_gallery_items";

function load(): GalleryItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function persist(items: GalleryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

interface GalleryStore {
  items: GalleryItem[];
  addItem: (item: Omit<GalleryItem, "id" | "addedAt">) => void;
  removeItem: (id: string) => void;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  items: load(),
  addItem(item) {
    const next: GalleryItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    };
    const items = [next, ...get().items];
    persist(items);
    set({ items });
  },
  removeItem(id) {
    const items = get().items.filter(i => i.id !== id);
    persist(items);
    set({ items });
  },
}));
