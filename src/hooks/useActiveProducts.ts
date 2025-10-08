import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

export type FirestoreProduct = {
  slug: string;
  title: string;
  primary_image_url?: string;
  uk_url?: string;
  is_active?: boolean;
  [k: string]: any;
};

export default function useActiveProducts(max = 6) {
  const [items, setItems] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const qref = query(
          collection(db, "products"),
          where("is_active", "==", true),
          limit(max)
        );
        const snap = await getDocs(qref);
        const data = snap.docs.map(d => d.data() as FirestoreProduct);
        setItems(data);
      } catch (e:any) {
        setError(e.message || "Failed to load catalogue");
      } finally {
        setLoading(false);
      }
    })();
  }, [max]);

  return { items, loading, error };
}
