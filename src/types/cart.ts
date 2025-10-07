export type CartItem = {
  slug: string;
  qty: number;
  size?: string | null;
  color?: string | null;
  title?: string;
  image?: string;
  name?: string;
  price: number;           // <-- add this (major units, e.g. 79 for £79? No → use 79.00)
  currency?: string;       // <-- optional, e.g. "gbp"
};