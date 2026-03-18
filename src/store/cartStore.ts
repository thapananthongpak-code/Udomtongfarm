import { create } from "zustand";
import type { CartItem } from "../types/shop";

const CART_KEY = "uf_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;

  addItem: (item: CartItem) => void;
  removeItem: (cart_key: string) => void;
  updateQty: (cart_key: string, qty: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),
  drawerOpen: false,

  addItem: (incoming) => {
    const items = get().items;
    const idx = items.findIndex((i) => i.cart_key === incoming.cart_key);
    let updated: CartItem[];
    if (idx >= 0) {
      updated = items.map((i, n) =>
        n === idx ? { ...i, quantity: i.quantity + incoming.quantity } : i
      );
    } else {
      updated = [...items, incoming];
    }
    saveCart(updated);
    set({ items: updated, drawerOpen: true });
  },

  removeItem: (cart_key) => {
    const updated = get().items.filter((i) => i.cart_key !== cart_key);
    saveCart(updated);
    set({ items: updated });
  },

  updateQty: (cart_key, qty) => {
    if (qty <= 0) {
      get().removeItem(cart_key);
      return;
    }
    const updated = get().items.map((i) =>
      i.cart_key === cart_key ? { ...i, quantity: qty } : i
    );
    saveCart(updated);
    set({ items: updated });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  openDrawer:  () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),

  totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
  totalPrice: () => get().items.reduce((s, i) => s + i.unit_price * i.quantity, 0),
}));
