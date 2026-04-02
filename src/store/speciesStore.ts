import { create } from "zustand";
import type { Species, SpeciesType } from "../types/species";
import { animals } from "../data/animals";
import { plants } from "../data/plants";
import { API_BASE } from "../config/api";
import { authFetch } from "../utils/authFetch";

const API_URL = `${API_BASE}/api/species`;
const SEED_ITEMS: Species[] = [...animals, ...plants];
const SOLD_KEY = "uf_sold_ids";

function loadSoldIds(): string[] {
  try { return JSON.parse(localStorage.getItem(SOLD_KEY) || "[]"); } catch { return []; }
}
function saveSoldIds(ids: string[]) {
  localStorage.setItem(SOLD_KEY, JSON.stringify(ids));
}
function applySold(items: Species[], soldIds: string[]): Species[] {
  if (soldIds.length === 0) return items;
  const soldSet = new Set(soldIds);
  return items.map(s => soldSet.has(s.id) ? { ...s, available: false, stock: 0 } : s);
}

type SpeciesState = {
  items: Species[];
  soldIds: string[];
  updatedAt: number;
  loading: boolean;
  fetchAll: () => Promise<void>;
  setItems: (items: Species[]) => void;
  markAsSold: (ids: string[]) => void;
  add: (item: Species) => Promise<void>;
  update: (type: SpeciesType, id: string, next: Species) => Promise<void>;
  upsert: (item: Species) => Promise<void>;
  remove: (type: SpeciesType, id: string) => Promise<void>;
  resetToSeed: () => Promise<void>;
  exportJSON: () => string;
  importJSON: (jsonText: string) => Promise<{ ok: boolean; error?: string; count?: number }>;
  mergeImportJSON: (jsonText: string) => Promise<{ok: boolean, count?: number, error?: string}>;
};

export const useSpeciesStore = create<SpeciesState>((set, get) => ({
  items: [],
  soldIds: loadSoldIds(),
  updatedAt: Date.now(),
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("API Offline");
      const data: Species[] = await response.json();
      // API is the source of truth — trust it completely, clear all soldIds
      saveSoldIds([]);
      set({ items: data, soldIds: [], updatedAt: Date.now(), loading: false });
    } catch {
      // API offline — using seed data fallback
      if (get().items.length === 0) {
        const sold = get().soldIds;
        set({ items: applySold(SEED_ITEMS, sold), updatedAt: Date.now(), loading: false });
      } else {
        set({ loading: false });
      }
    }
  },

  setItems: (items) => set({ items, updatedAt: Date.now() }),

  markAsSold: (ids) => {
    const prev = get().soldIds;
    const next = Array.from(new Set([...prev, ...ids]));
    saveSoldIds(next);
    set(state => ({
      soldIds: next,
      items: applySold(state.items, next),
    }));
  },

  upsert: async (item) => {
    try {
      await authFetch(API_URL, {
        method: "POST",
        body: JSON.stringify(item),
      });
    } finally {
      await get().fetchAll();
    }
  },

  add: async (item) => await get().upsert(item),

  update: async (_type, id, next) => {
    try {
      await authFetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(next),
      });
    } finally {
      await get().fetchAll();
    }
  },

  remove: async (_type, id) => {
    try {
      await authFetch(`${API_URL}/${id}`, { method: "DELETE" });
    } finally {
      await get().fetchAll();
    }
  },

  // 🚀 ยิงข้อมูลเข้า Database Turso จริงๆ
  resetToSeed: async () => {
    if (!confirm("Reset all data to defaults and re-seed the database?")) return;
    set({ loading: true });
    try {
      for (const item of SEED_ITEMS) {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }
      await get().fetchAll();
      alert("Data restored successfully!");
    } catch {
      alert("Failed to restore data");
    } finally {
      set({ loading: false });
    }
  },

  exportJSON: () => JSON.stringify({ items: get().items }, null, 2),

  // 🚀 ยิงข้อมูล Import เข้า Database จริงๆ
  importJSON: async (jsonText: string) => {
    set({ loading: true });
    try {
      const parsed = JSON.parse(jsonText);
      const incoming = Array.isArray(parsed) ? parsed : (parsed.items || []);
      
      for (const it of incoming) {
        await authFetch(API_URL, {
          method: "POST",
          body: JSON.stringify(it),
        });
      }
      await get().fetchAll();
      set({ loading: false });
      return { ok: true, count: incoming.length };
    } catch (e: unknown) {
      set({ loading: false });
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  },

  // เพิ่มเฉพาะรายการที่ยังไม่มีใน DB (ตรวจจาก id) ไม่ทับข้อมูลเดิม
  mergeImportJSON: async (jsonText: string) => {
    set({ loading: true });
    try {
      const parsed = JSON.parse(jsonText);
      const incoming: Species[] = Array.isArray(parsed) ? parsed : (parsed.items || []);
      const existingIds = new Set(get().items.map((x) => x.id));
      const newOnly = incoming.filter((x) => !existingIds.has(x.id));

      for (const it of newOnly) {
        await authFetch(API_URL, {
          method: "POST",
          body: JSON.stringify(it),
        });
      }
      await get().fetchAll();
      set({ loading: false });
      return { ok: true, count: newOnly.length };
    } catch (e: unknown) {
      set({ loading: false });
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  },
}));