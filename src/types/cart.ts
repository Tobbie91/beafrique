export type CartItem = {
    slug: string;           // product id in Firestore
    qty: number;
    size?: string | null;
    color?: string | null;
  
    // snapshot for UI (not trusted for price)
    title?: string;
    image?: string;
    currency?: string;      // e.g. "GBP"
  };