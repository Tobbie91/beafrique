export type Product = {
  slug: string
  name: string
  price: number
  image: string
  category: 'long-dresses' | 'two-piece' | 'tops' | 'accessories'
  description: string
  sizes: string[]
}

export const PRODUCTS: Product[] = [
  {
    slug: 'afara-maxi-dress',
    name: 'Afara Maxi Dress',
    price: 48000,
    image: new URL("../assests/images/buk1.webp", import.meta.url).href, // Vite imports for local files
    category: 'long-dresses',
    sizes: ['S','M','L','XL'],
    description: 'Timeless silhouette in premium fabric with elegant flow and structured fit.'
  },
  {
    slug: 'orente-two-piece',
    name: 'Orente Two‑Piece',
    price: 42000,
    image: new URL("../assests/images/buk2.webp", import.meta.url).href,
    category: 'two-piece',
    sizes: ['S','M','L'],
    description: 'Versatile set with tailored lines and day‑to‑night elegance.'
  },
  {
    slug: 'adire-wrap-top',
    name: 'Adire Wrap Top',
    price: 28000,
    image: new URL("../assests/images/buk3.webp", import.meta.url).href,
    category: 'tops',
    sizes: ['S','M','L','XL'],
    description: 'Statement wrap top with heritage pattern and modern silhouette.'
  },
]


export const CATEGORIES = [
  { id: 'long-dresses', name: 'Long Dresses' },
  { id: 'two-piece', name: 'Two‑Piece Sets' },
  { id: 'tops', name: 'Tops' },
  { id: 'accessories', name: 'Accessories' }
] as const
