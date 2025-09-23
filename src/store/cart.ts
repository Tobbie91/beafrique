import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;           // unique per variant (e.g. `${slug}-${size}`)
  name: string;
  price: number;
  qty: number;
  size?: string;        // UK size (8/10/12/14/16)
  image?: string;       // ✅ let Checkout show thumbnails
  slug?: string;        // ✅ handy for linking back to PDP
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  updateQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const items = get().items.slice();
        const i = items.findIndex((x) => x.id === item.id);
        if (i >= 0) {
          // @ts-ignore
          items[i] = { ...items[i], qty: items[i].qty + item.qty };
        } else {
          items.push(item);
        }
        set({ items });
      },
      updateQty: (id, qty) =>
        set({ items: get().items.map((x) => (x.id === id ? { ...x, qty } : x)) }),
      remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: "be-afrique-cart" }
  )
);
