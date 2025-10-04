export type CartItem = {
  slug: string;            // product id (authoritative key)
  qty: number;
  size?: string | null;
  color?: string | null;

  // Optional UI helpers (non-authoritative, purely for display)
  name?: string;
  title?: string;
  image?: string;
  price?: number;          // display-only; real price comes from server
  id?: string;             // if you used it as a React key anywhere
};
