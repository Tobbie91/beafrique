// src/store/cart.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "../types/cart";

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (slug: string, size?: string | null, color?: string | null) => void;
  setQty: (slug: string, size: string | null | undefined, color: string | null | undefined, qty: number) => void;
  clear: () => void;
  count: () => number;
};

// Ensure slug is always a string at the type level here
function keyOf(x: { slug: string; size?: string | null; color?: string | null }) {
  return `${x.slug}__${x.size ?? ""}__${x.color ?? ""}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) => {
          const k = keyOf(item); // item.slug must be string (per CartItem)
          const idx = state.items.findIndex((i) => keyOf(i) === k);

          if (idx >= 0) {
            const next = [...state.items];
            const existing = next[idx] as CartItem | undefined;

            // Runtime safety for TypeScript: guarantee existing is defined
            if (!existing) return { items: state.items };

            // Merge while preserving required fields from existing (e.g., slug)
            const merged: CartItem = {
              ...existing,
              qty: (existing.qty ?? 0) + (item.qty ?? 1),
              price: item.price ?? existing.price,
              currency: item.currency ?? existing.currency,
              title: item.title ?? existing.title,
              image: item.image ?? existing.image,
              // keep existing.slug/size/color intact, no change needed
            };

            next[idx] = merged;
            return { items: next };
          }

          // New line item — ensure qty defaults to 1
          const newItem: CartItem = { ...item, qty: item.qty ?? 1 };
          return { items: [...state.items, newItem] };
        }),

      remove: (slug, size, color) =>
        set((state) => ({
          items: state.items.filter((i) => keyOf(i) !== keyOf({ slug, size, color })),
        })),

      setQty: (slug, size, color, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            keyOf(i) === keyOf({ slug, size, color }) ? { ...i, qty } : i
          ),
        })),

      clear: () => set({ items: [] }),

      count: () => get().items.reduce((n, i) => n + i.qty, 0),
    }),
    { name: "beafrique-cart" }
  )
);
