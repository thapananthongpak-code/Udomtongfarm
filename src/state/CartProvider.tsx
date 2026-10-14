import { useCallback, useEffect, useMemo, useState } from "react";
import { isOrderable, sortMenu } from "@/lib/menu";
import { useData } from "./data";
import { CartContext, MAX_PER_ITEM, type CartLine } from "./cart";

const STORAGE_KEY = "cart";

type Saved = { quantities: Record<string, number>; table: number | null };

function read(): Saved {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Saved> | null;
    const quantities: Record<string, number> = {};
    for (const [id, quantity] of Object.entries(saved?.quantities ?? {})) {
      if (Number.isInteger(quantity) && quantity > 0) quantities[id] = Math.min(quantity, MAX_PER_ITEM);
    }
    return { quantities, table: Number.isInteger(saved?.table) ? (saved!.table as number) : null };
  } catch {
    return { quantities: {}, table: null };
  }
}

/** The customer's basket. It is kept in the browser, and only ever holds menu item ids and counts. */
export default function CartProvider({ children }: { children: React.ReactNode }) {
  const { menu } = useData();
  const [saved, setSaved] = useState<Saved>(read);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // The basket still works until the page is closed.
    }
  }, [saved]);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setSaved((current) => {
      const quantities = { ...current.quantities };
      if (quantity <= 0) delete quantities[id];
      else quantities[id] = Math.min(Math.floor(quantity), MAX_PER_ITEM);
      return { ...current, quantities };
    });
  }, []);

  const setTable = useCallback((table: number | null) => setSaved((current) => ({ ...current, table })), []);
  const clear = useCallback(() => setSaved((current) => ({ ...current, quantities: {} })), []);

  const value = useMemo(() => {
    // Lines whose item has since been removed or sold out are left out, so the total is always what can be ordered.
    const lines: CartLine[] = sortMenu(menu)
      .filter((item) => isOrderable(item) && saved.quantities[item.id])
      .map((item) => {
        const quantity = saved.quantities[item.id];
        return { item, quantity, lineTotal: (item.price ?? 0) * quantity };
      });

    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      table: saved.table,
      quantityOf: (id: string) => saved.quantities[id] ?? 0,
      setQuantity,
      setTable,
      clear,
    };
  }, [menu, saved, setQuantity, setTable, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
