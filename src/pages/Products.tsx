
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where /*, orderBy*/ } from "firebase/firestore";
import CatalogueCards from "../components/CatalogueCards";

type HomeCardProduct = {
  slug: string;
  name: string;
  image: string;
  // you can add more optional fields if your CatalogueCards ever needs them
};

type FirestoreProduct = {
  slug: string;
  title: string;
  primary_image_url?: string;
  is_active?: boolean;
  uk_url?: string;       
  [k: string]: any;
};

export default function Products() {
  const [items, setItems] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const qref = query(collection(db, "products"), where("is_active", "==", true));
        const snap = await getDocs(qref);
        const data = snap.docs.map(d => d.data() as FirestoreProduct);
        setItems(data);
      } catch (e:any) {
        setError(e.message || "Failed to load catalogue");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container py-10">Loading…</div>;
  if (error)   return <div className="container py-10 text-red-600">Error: {error}</div>;
  if (!items.length) return <div className="container py-10">No products yet.</div>;


  const cards: HomeCardProduct[] = items.map(p => ({
    slug: p.slug,
    name: p.title,
    image: p.primary_image_url || "",  
  }));

  const getOutsideLink = (p: HomeCardProduct) => {
    const src = items.find(x => x.slug === p.slug);
    return src?.uk_url || undefined; 
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Catalogue</h1>
      {/* @ts-ignore */}
      <CatalogueCards items={cards} getOutsideLink={getOutsideLink} />
    </div>
  );
}
