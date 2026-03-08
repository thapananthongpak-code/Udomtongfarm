import { create } from "zustand";
import type { Species, SpeciesType } from "../types/species";
import { animals } from "../data/animals";
import { plants } from "../data/plants";
import { API_BASE } from "../config/api";
import { authFetch } from "../utils/authFetch";

const API_URL = `${API_BASE}/api/species`;
const SEED_ITEMS: Species[] = [...animals, ...plants];

type SpeciesState = {
  items: Species[];
  updatedAt: number;
  loading: boolean;
  fetchAll: () => Promise<void>;
  setItems: (items: Species[]) => void;
  add: (item: Species) => Promise<void>;
  update: (type: SpeciesType, id: string, next: Species) => Promise<void>;
  upsert: (item: Species) => Promise<void>;
  remove: (type: SpeciesType, id: string) => Promise<void>;
  resetToSeed: () => Promise<void>;
  exportJSON: () => string;
  importJSON: (jsonText: string) => Promise<{ ok: boolean; error?: string; count?: number }>;
  mergeImportJSON: (jsonText: string) => Promise<any>;
};

export const useSpeciesStore = create<SpeciesState>((set, get) => ({
  items: [],
  updatedAt: Date.now(),
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("API Offline");
      const data = await response.json();
      set({ items: data, updatedAt: Date.now(), loading: false });
    } catch (err) {
      console.warn("API Offline — using seed data fallback");
      // fallback to seed data only when store is empty
      if (get().items.length === 0) {
        set({ items: SEED_ITEMS, updatedAt: Date.now(), loading: false });
      } else {
        set({ loading: false });
      }
    }
  },

  setItems: (items) => set({ items, updatedAt: Date.now() }),

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

  remove: async (type, id) => {
    try {
      await authFetch(`${API_URL}/${id}`, { method: "DELETE" });
    } finally {
      await get().fetchAll();
    }
  },

  // 🚀 ยิงข้อมูลเข้า Database Turso จริงๆ
  resetToSeed: async () => {
    if (!confirm("ต้องการกู้คืนข้อมูลตั้งต้นและอัปเดตรูปภาพเข้า Database Turso ใช่ไหม?")) return;
    set({ loading: true });
    try {
      for (const item of SEED_ITEMS) {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }
      await get().fetchAll(); // โหลดข้อมูลใหม่หลังจากบันทึกเสร็จ
      alert("กู้คืนข้อมูลและอัปเดต Path รูปภาพลง Database สำเร็จแล้ว! ✨"); // 🟢 ปรับข้อความให้ชัดเจน
    } catch (e) {
      alert("เกิดข้อผิดพลาดในการกู้คืน");
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
    } catch (e: any) {
      set({ loading: false });
      return { ok: false, error: e.message };
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
    } catch (e: any) {
      set({ loading: false });
      return { ok: false, error: e.message };
    }
  },
}));