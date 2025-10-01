import { useEffect, useMemo, useRef, useState } from "react";
import { db, storage } from "../lib/firebase";
import {
  collection, getDocs, limit, orderBy, query,
  startAfter, where, QueryConstraint, DocumentData, QueryDocumentSnapshot
} from "firebase/firestore";
import { getDownloadURL, ref as storageRef } from "firebase/storage";

export type FashionFilters = {
  q?: string;
  brand?: string | "all";
  gender?: "men" | "women" | "unisex" | "all";
  sizes?: string[];
  colors?: string[];
  priceMin?: number;   // NGN
  priceMax?: number;   // NGN
  sort?: "new" | "price-asc" | "price-desc";
  pageSize?: number;
};

export type CatalogueRow = {
  id: string;
  slug: string;
  title: string;
  brand?: string | null;
  collection?: string | null;
  gender: "men" | "women" | "unisex";
  description?: string | null;
  min_price_cents: number;
  has_sale?: boolean;
  sizes: string[];
  colors: string[];
  primary_image_path?: string | null; // storage path
  is_active: boolean;
  created_at?: any;
  primary_image_url?: string | null;  // resolved URL
};

export function useFashionCatalogueFirebase(f: FashionFilters) {
  const {
    q = "",
    brand = "all",
    gender = "all",
    sizes = [],
    colors = [],
    priceMin,
    priceMax,
    sort = "new",
    pageSize = 12,
  } = f;

  const [items, setItems] = useState<CatalogueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cursor stack to support prev/next
  const [pageIndex, setPageIndex] = useState(0);
  const cursors = useRef<(QueryDocumentSnapshot<DocumentData> | null)[]>([null]); // first page starts at null
  const [canNext, setCanNext] = useState(false);
  const [canPrev, setCanPrev] = useState(false);

  // reset pagination when filters change
  useEffect(() => {
    cursors.current = [null];
    setPageIndex(0);
  }, [q, brand, gender, JSON.stringify(sizes), JSON.stringify(colors), priceMin, priceMax, sort, pageSize]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const constraints: QueryConstraint[] = [ where("is_active", "==", true) ];

        // Simple search: title/brand contains
        if (q.trim()) {
          // Firestore can't OR across fields easily; use one field or denormalize “search_keywords: string[]”
          constraints.push(where("title", ">=", q));
          constraints.push(where("title", "<=", q + "\uf8ff"));
        }

        if (brand !== "all") constraints.push(where("brand", "==", brand));
        if (gender !== "all") constraints.push(where("gender", "==", gender));

        // Array filters (ANY match)
        if (sizes.length)  constraints.push(where("sizes", "array-contains-any", sizes.slice(0, 10)));
        if (colors.length) constraints.push(where("colors", "array-contains-any", colors.slice(0, 10)));

        // Price range: Firestore requires orderBy on same field if using range
        let order: QueryConstraint;
        if (sort === "price-asc")      order = orderBy("min_price_cents", "asc");
        else if (sort === "price-desc") order = orderBy("min_price_cents", "desc");
        else                             order = orderBy("created_at", "desc");

        if (typeof priceMin === "number") constraints.push(where("min_price_cents", ">=", Math.round(priceMin * 100)));
        if (typeof priceMax === "number") constraints.push(where("min_price_cents", "<=", Math.round(priceMax * 100)));

        const col = collection(db, "products");
        const base = query(col, ...constraints, order, limit(pageSize));

        const start = cursors.current[pageIndex];
        const qref = start ? query(base, startAfter(start)) : base;

        const snap = await getDocs(qref);

        // pagination flags
        setCanPrev(pageIndex > 0);
        setCanNext(snap.size === pageSize);

        // Resolve primary image URLs
        const raw = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as CatalogueRow[];
        const withUrls = await Promise.all(
          raw.map(async (p) => {
            if (!p.primary_image_path) return { ...p, primary_image_url: null };
            const url = await getDownloadURL(storageRef(storage, p.primary_image_path)).catch(() => null);
            return { ...p, primary_image_url: url };
          })
        );

        setItems(withUrls);

        // store cursor for *next* page (last doc of this page)
        const last = snap.docs[snap.docs.length - 1] || null;
        if (cursors.current.length === pageIndex + 1) cursors.current.push(last); else cursors.current[pageIndex + 1] = last;

      } catch (e: any) {
        setError(e.message || "Failed to load catalogue");
        setItems([]);
        setCanNext(false);
        setCanPrev(pageIndex > 0);
      } finally {
        setLoading(false);
      }
    })();
  }, [pageIndex, q, brand, gender, JSON.stringify(sizes), JSON.stringify(colors), priceMin, priceMax, sort, pageSize]);

  const next = () => { if (canNext) setPageIndex((i) => i + 1); };
  const prev = () => { if (canPrev) setPageIndex((i) => Math.max(0, i - 1)); };

  return { items, loading, error, next, prev, canNext, canPrev, page: pageIndex + 1 };
}
