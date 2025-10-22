// src/pages/FormerDesigns.tsx
// src/pages/FormerDesigns.tsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

// --- minimal Cloudinary helper for display only (no blur) ---
const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const cl = (
  publicId: string,
  opts?: { w?: number; q?: number | "auto"; ar?: string; crop?: "fill" | "fit" }
) => {
  const parts = [
    "f_auto",
    `q_${opts?.q ?? "auto"}`,
    opts?.w ? `w_${opts.w}` : "",
    opts?.ar ? `ar_${opts.ar}` : "",
    `c_${opts?.crop ?? "fill"}`,
  ]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/dbl85m2kz/image/upload/${parts}/${publicId}.jpg`;
};
// ------------------------------------------------------------

type ArchiveDesign = {
  slug: string;
  title: string;
  public_id: string;
  caption?: string;
  is_published?: boolean;
  created_at?: any;
  tags?: string[];
  position?: number;
};

export default function FormerDesigns() {
  const [items, setItems] = useState<ArchiveDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<ArchiveDesign | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const qref = query(
          collection(db, "archive_designs"),
          where("is_published", "==", true)
        );
        const snap = await getDocs(qref);
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as ArchiveDesign) }));

        // client-side sort: position asc → created_at desc → title asc
        rows.sort((a: any, b: any) => {
          const pa = typeof a.position === "number" ? a.position : Number.POSITIVE_INFINITY;
          const pb = typeof b.position === "number" ? b.position : Number.POSITIVE_INFINITY;
          if (pa !== pb) return pa - pb;
          const ca = a.created_at?.toMillis?.() ?? 0;
          const cb = b.created_at?.toMillis?.() ?? 0;
          if (ca !== cb) return cb - ca;
          return String(a.title ?? "").localeCompare(String(b.title ?? ""));
        });

        setItems(rows as ArchiveDesign[]);
      } catch (err) {
        console.error("[archive] load error:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container py-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] rounded-2xl bg-emerald-100/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return <div className="container py-10">No former designs yet.</div>;
  }

  return (
    <div className="container py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Former Designs</h1>
        <p className="text-sm text-gray-600 mt-1">A curated archive of past looks and collections.</p>
      </header>

      {/* Masonry layout (CSS columns) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
        {items.map((d) => {
          const full = cl(d.public_id, { w: 1600, q: "auto" });
          const mid  = cl(d.public_id, { w: 900,  q: "auto" });
          const low  = cl(d.public_id, { w: 600,  q: "auto" });

          return (
            <figure
              key={d.slug}
              className="mb-5 break-inside-avoid overflow-hidden rounded-2xl ring-1 ring-emerald-100/70 bg-white shadow-sm group"
            >
              <div className="relative">
                {/* single real image (no blur layer) */}
                <img
                  src={mid}
                  srcSet={`${low} 600w, ${mid} 900w, ${full} 1600w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  alt={d.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  style={{ aspectRatio: "4/5" }}
                  onClick={() => setActive(d)}
                />

                {/* gradient + caption on hover (no year chip) */}
                <figcaption
                  className="pointer-events-none absolute inset-0 flex items-end p-4 
                             bg-gradient-to-t from-black/60 via-black/0 to-transparent
                             opacity-0 group-hover:opacity-100 transition"
                >
                  <div className="text-white">
                    <p className="font-semibold leading-tight">{d.title}</p>
                    {d.caption && <p className="text-xs text-white/90 line-clamp-2">{d.caption}</p>}
                  </div>
                </figcaption>
              </div>
            </figure>
          );
        })}
      </div>

      {/* Lightbox (no year text) */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={cl(active.public_id, { w: 1800, q: "auto" })}
              alt={active.title}
              className="w-full rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setActive(null)}
              className="absolute -top-3 -right-3 bg-white text-emerald-900 rounded-full px-3 py-1 text-sm shadow"
            >
              Close
            </button>
            <div className="mt-2 text-white/90">
              <p className="font-semibold">{active.title}</p>
              {active.caption && <div className="text-sm opacity-90">{active.caption}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
