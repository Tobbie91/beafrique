import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../data/products'
import { PRODUCTS as STATIC } from '../data/products'

type ProductsState = {
  staticItems: Product[]
  userItems: Product[]
  add: (p: Product) => void
  all: () => Product[]
}

export const useProducts = create<ProductsState>()(
  persist(
    (set, get) => ({
      staticItems: STATIC,
      userItems: [],
      add: (p) => set({ userItems: [p, ...get().userItems] }),
      all: () => [...get().userItems, ...get().staticItems],
    }),
    { name: 'beafrique-products' }
  )
)
