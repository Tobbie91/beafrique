
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "../types/cart";


type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (slug: string, size?: string|null, color?: string|null) => void;
  setQty: (slug: string, size: string|null|undefined, color: string|null|undefined, qty: number) => void;
  clear: () => void;
  count: () => number;
};

function keyOf(x: Pick<CartItem, "slug"|"size"|"color">) {
  return `${x.slug}__${x.size ?? ""}__${x.color ?? ""}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => set(state => {
        // merge by (slug,size,color)
        const k = keyOf(item);
        const idx = state.items.findIndex(i => keyOf(i) === k);
        if (idx >= 0) {
          const next = [...state.items];
          // @ts-ignore
          next[idx] = { ...next[idx], qty: next[idx].qty + (item.qty || 1) };
          return { items: next };
        }
        return { items: [...state.items, { ...item, qty: item.qty || 1 }] };
      }),
      remove: (slug, size, color) =>
        set(state => ({ items: state.items.filter(i => keyOf(i) !== keyOf({ slug, size, color })) })),
      setQty: (slug, size, color, qty) =>
        set(state => ({
          items: state.items.map(i => keyOf(i) === keyOf({ slug, size, color }) ? { ...i, qty } : i)
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
    }),
    { name: "beafrique-cart" }
  )
);
