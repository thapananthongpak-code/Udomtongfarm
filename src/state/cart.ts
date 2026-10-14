import { createContext, useContext } from "react";
import type { MenuItem } from "@/lib/menu";

export type CartLine = { item: MenuItem; quantity: number; lineTotal: number };

export type CartState = {
  /** What is in the basket now and can still be ordered, in menu order. */
  lines: CartLine[];
  /** Number of items, counting quantities. */
  count: number;
  total: number;
  /** The table scanned from a table's QR code, or null for the counter. */
  table: number | null;
  quantityOf: (id: string) => number;
  setQuantity: (id: string, quantity: number) => void;
  setTable: (table: number | null) => void;
  clear: () => void;
};

export const MAX_PER_ITEM = 20;

export const CartContext = createContext<CartState>({
  lines: [],
  count: 0,
  total: 0,
  table: null,
  quantityOf: () => 0,
  setQuantity: () => {},
  setTable: () => {},
  clear: () => {},
});

export const useCart = () => useContext(CartContext);
