import { create } from "zustand";
import type { Order, Address, PaymentMethod, ShippingCompany } from "../types/shop";
import { API_BASE } from "../config/api";
import { authFetch } from "../utils/authFetch";

const ORDERS_URL  = `${API_BASE}/api/orders`;
const ADDRESS_URL = `${API_BASE}/api/addresses`;
const ADMIN_ORDERS_URL = `${API_BASE}/api/admin/orders`;

type OrderState = {
  orders: Order[];
  addresses: Address[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;

  // User actions
  fetchMyOrders: (email: string) => Promise<void>;
  pollOrders: (email: string) => Promise<void>;
  createOrder: (payload: {
    user_email: string;
    items: Array<{
      species_id: string;
      species_name: string;
      species_name_en?: string;
      species_image: string;
      species_type: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
    }>;
    total_amount: number;
    payment_method: PaymentMethod;
    shipping_address: Partial<Address>;
    shipping_company?: ShippingCompany;
    note?: string;
  }) => Promise<{ ok: boolean; orderId?: string; error?: string }>;

  // Addresses
  fetchAddresses: (email: string) => Promise<void>;
  addAddress: (addr: Omit<Address, "id" | "is_default"> & { is_default?: number }) => Promise<boolean>;
  updateAddress: (id: number, addr: Address) => Promise<boolean>;
  deleteAddress: (id: number, user_email: string) => Promise<boolean>;

  // Admin
  adminOrders: Order[];
  fetchAdminOrders: (status?: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, shippingInfo?: {
    shipping_company?: ShippingCompany;
    tracking_number?: string;
    estimated_delivery?: string;
  }) => Promise<boolean>;
  updateShippingInfo: (orderId: string, info: {
    shipping_company?: ShippingCompany;
    tracking_number?: string;
    estimated_delivery?: string;
  }) => Promise<boolean>;
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  addresses: [],
  loading: false,
  error: null,
  adminOrders: [],
  lastUpdated: null,

  fetchMyOrders: async (email) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${ORDERS_URL}/my?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      const orders = Array.isArray(data) ? data : [];
      set({ orders, loading: false, lastUpdated: new Date().toISOString() });
    } catch {
      set({ loading: false, error: "โหลดคำสั่งซื้อล้มเหลว" });
    }
  },

  pollOrders: async (email) => {
    try {
      const since = get().lastUpdated;
      const url = since
        ? `${API_BASE}/api/orders/poll?email=${encodeURIComponent(email)}&since=${encodeURIComponent(since)}`
        : `${API_BASE}/api/orders/poll?email=${encodeURIComponent(email)}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const updated: Order[] = await res.json();
      if (!Array.isArray(updated) || updated.length === 0) return;
      // Merge updated orders into existing list
      set(state => {
        const map = new Map(state.orders.map(o => [o.id, o]));
        for (const o of updated) map.set(o.id, o);
        return { orders: Array.from(map.values()).sort((a, b) => b.created_at.localeCompare(a.created_at)), lastUpdated: new Date().toISOString() };
      });
    } catch {}
  },

  createOrder: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(ORDERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        set({ loading: false, error: data.error || "เกิดข้อผิดพลาด" });
        return { ok: false, error: data.error };
      }
      set({ loading: false });
      return { ok: true, orderId: data.orderId };
    } catch (e: any) {
      set({ loading: false, error: e.message });
      return { ok: false, error: e.message };
    }
  },

  fetchAddresses: async (email) => {
    try {
      const res = await fetch(`${ADDRESS_URL}?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      set({ addresses: Array.isArray(data) ? data : [] });
    } catch {}
  },

  addAddress: async (addr) => {
    try {
      const res = await fetch(ADDRESS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addr, is_default: addr.is_default ?? 0 }),
      });
      if (!res.ok) return false;
      await get().fetchAddresses(addr.user_email);
      return true;
    } catch { return false; }
  },

  updateAddress: async (id, addr) => {
    try {
      const res = await fetch(`${ADDRESS_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addr),
      });
      if (!res.ok) return false;
      await get().fetchAddresses(addr.user_email);
      return true;
    } catch { return false; }
  },

  deleteAddress: async (id, user_email) => {
    try {
      const res = await fetch(`${ADDRESS_URL}/${id}?email=${encodeURIComponent(user_email)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email }),
      });
      if (!res.ok) return false;
      await get().fetchAddresses(user_email);
      return true;
    } catch { return false; }
  },

  fetchAdminOrders: async (status) => {
    set({ loading: true });
    try {
      const url = status ? `${ADMIN_ORDERS_URL}?status=${status}` : ADMIN_ORDERS_URL;
      const res = await authFetch(url);
      const data = await res.json();
      set({ adminOrders: Array.isArray(data) ? data : [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId, status, shippingInfo) => {
    try {
      const res = await authFetch(`${ADMIN_ORDERS_URL}/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status, ...shippingInfo }),
      });
      if (!res.ok) return false;
      await get().fetchAdminOrders();
      return true;
    } catch { return false; }
  },

  updateShippingInfo: async (orderId, info) => {
    try {
      const res = await authFetch(`${ADMIN_ORDERS_URL}/${orderId}/shipping`, {
        method: "PUT",
        body: JSON.stringify(info),
      });
      if (!res.ok) return false;
      await get().fetchAdminOrders();
      return true;
    } catch { return false; }
  },
}));
