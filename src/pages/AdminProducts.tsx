import { useEffect, useState, useMemo } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

type Row = {
  slug: string;
  title?: string;
  is_active?: boolean;
  min_price_cents?: number;
  primary_image_url?: string;
  created_at?: any;
};

function gbp(pence = 0) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format((pence || 0) / 100);
}

export default function AdminProducts() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const snap = await getDocs(query(collection(db, "products"), orderBy("created_at", "desc")));
      const list = snap.docs.map(d => ({ slug: d.id, ...(d.data() as any) }));
      setRows(list);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(r =>
      r.slug.toLowerCase().includes(t) ||
      (r.title || "").toLowerCase().includes(t)
    );
  }, [rows, q]);

  async function hardDelete(slug: string) {
    if (!confirm(`Delete "${slug}" permanently? (Cloudinary images stay)`)) return;
    await deleteDoc(doc(db, "products", slug));
    setRows(prev => prev.filter(r => r.slug !== slug));
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">Admin · Products</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700"
        >
          + Create New Product
        </Link>
      </div>

      {/* Search */}
      <div className="mt-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or slug…"
          className="h-11 w-full sm:max-w-md border rounded-lg px-3"
        />
      </div>

      {/* Loading / Empty */}
      {loading && (
        <div className="mt-6 text-sm text-gray-600">Loading…</div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="mt-6 text-sm text-gray-600">No products.</div>
      )}

      {/* Mobile cards */}
      <div className="sm:hidden mt-4 space-y-3">
        {filtered.map((r) => (
          <div key={r.slug} className="rounded-xl border bg-white p-3 shadow-sm">
            <div className="flex gap-3">
              {r.primary_image_url ? (
                <img
                  src={r.primary_image_url}
                  alt=""
                  className="h-16 w-12 object-cover rounded border flex-shrink-0"
                />
              ) : (
                <div className="h-16 w-12 bg-gray-100 rounded border" />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{r.title || r.slug}</div>
                <div className="text-[11px] text-gray-500 truncate">{r.slug}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{gbp(r.min_price_cents)}</span>
                  {r.is_active ? (
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                      Active
                    </span>
                  ) : (
                    <span className="text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[11px]">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[11px] text-gray-500">
                  {r.created_at?.toDate ? r.created_at.toDate().toLocaleDateString() : "—"}
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => nav(`/admin/products/edit/${r.slug}`)}
                className="flex-1 px-3 py-2 rounded border text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => hardDelete(r.slug)}
                className="flex-1 px-3 py-2 rounded border border-red-600 text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block mt-4 rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.slug} className="border-t">
                  <td className="p-3">
                    <div className="flex items-center gap-3 min-w-[220px]">
                      {r.primary_image_url && (
                        <img
                          src={r.primary_image_url}
                          alt=""
                          className="h-12 w-9 object-cover rounded border"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-medium truncate max-w-[260px]">
                          {r.title || r.slug}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate max-w-[260px]">
                          {r.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">{gbp(r.min_price_cents)}</td>
                  <td className="p-3">
                    {r.is_active ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-xs">
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-500 whitespace-nowrap">
                    {r.created_at?.toDate ? r.created_at.toDate().toLocaleDateString() : "—"}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        className="px-3 py-1 rounded border"
                        onClick={() => nav(`/admin/products/edit/${r.slug}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded border border-red-600 text-red-700"
                        onClick={() => hardDelete(r.slug)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td className="p-4" colSpan={5}>No products.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
