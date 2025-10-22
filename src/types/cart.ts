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

export type ArchiveDesign = {
  slug: string;
  title: string;
  public_id: string;   // cloudinary public id like "beafrique/archive/look-07_abcd123"
  year?: number;
  tags?: string[];
  caption?: string;
  is_published?: boolean;
  created_at?: any;
};