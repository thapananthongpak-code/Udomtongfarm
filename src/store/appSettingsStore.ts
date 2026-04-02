import { create } from "zustand";
import { API_BASE } from "../config/api";

type BannerItem = {
  id: string;
  icon: string;
  titleTh: string;
  titleEn: string;
  descTh: string;
  descEn: string;
};

type AppSettingsState = {
  bannerTitleTh: string;
  bannerTitleEn: string;
  bannerSubtitleTh: string;
  bannerSubtitleEn: string;
  bannerBgImage: string;
  bannerItems: BannerItem[];
  // Payment settings
  promptpayPhone: string;
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  
  loading: boolean;
  error: string | null;
  
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Record<string, unknown>, token: string) => Promise<boolean>;
};

export const useAppSettingsStore = create<AppSettingsState>((set, get) => ({
  bannerTitleTh: "ฟาร์มอุดมทอง",
  bannerTitleEn: "Udomtong Farm",
  bannerSubtitleTh: "แหล่งรวบรวมและอนุรักษ์สัตว์และพืชหายากแห่งจังหวัดนครราชสีมา",
  bannerSubtitleEn: "A dedicated space for collecting and conserving rare animals and plants in Nakhon Ratchasima",
  bannerBgImage: "",
  bannerItems: [],

  promptpayPhone: "",
  bankName: "",
  bankAccountNo: "",
  bankAccountName: "",

  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        set({
          bannerTitleTh: data.bannerTitleTh || get().bannerTitleTh,
          bannerTitleEn: data.bannerTitleEn || get().bannerTitleEn,
          bannerSubtitleTh: data.bannerSubtitleTh || get().bannerSubtitleTh,
          bannerSubtitleEn: data.bannerSubtitleEn || get().bannerSubtitleEn,
          bannerBgImage: data.bannerBgImage || get().bannerBgImage,
          bannerItems: data.bannerItems || [],
          promptpayPhone: data.promptpayPhone || "",
          bankName: data.bankName || "",
          bankAccountNo: data.bankAccountNo || "",
          bankAccountName: data.bankAccountName || "",
          loading: false,
        });
      } else {
        set({ loading: false, error: "Failed to fetch settings" });
      }
    } catch (e: unknown) {
      set({ loading: false, error: e instanceof Error ? e.message : "Network error" });
    }
  },

  updateSettings: async (updates, token) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        // Optimistically update local state
        set((state) => ({ ...state, ...updates, loading: false }));
        return true;
      }
      set({ loading: false, error: "Failed to update settings" });
      return false;
    } catch (e: unknown) {
      set({ loading: false, error: e instanceof Error ? e.message : "Network error" });
      return false;
    }
  }
}));
