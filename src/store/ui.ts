import { create } from "zustand";

type Toast = { id: number; message: string };

type UIState = {
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  toasts: Toast[];
  showToast: (message: string) => void;
  dismissToast: (id: number) => void;
};

let nextToastId = 1;

export const useUI = create<UIState>((set, get) => ({
  searchOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  toggleSearch: () => set({ searchOpen: !get().searchOpen }),

  toasts: [],
  showToast: (message) => {
    const id = nextToastId++;
    // Only the latest three stay on screen.
    set({ toasts: [...get().toasts.slice(-2), { id, message }] });
    window.setTimeout(() => get().dismissToast(id), 2800);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
