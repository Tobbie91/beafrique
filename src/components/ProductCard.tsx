

import type { CatalogueRow } from "../hooks/useFashionCatalogueFirebase";

export default function ProductCard({ p }: { p: CatalogueRow }) {
  const price = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(p.min_price_cents / 100);

  return (
    <article className="group border rounded-2xl overflow-hidden">
      <a href={`/product/${p.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          {p.primary_image_url
            ? <img src={p.primary_image_url} alt={p.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            : <div className="w-full h-full grid place-items-center text-gray-400 text-sm">Image</div>}
          {p.has_sale && (
            <span className="absolute left-3 top-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
              Sale
            </span>
          )}
        </div>
        <div className="p-4">
          {p.brand && <p className="text-xs uppercase tracking-wide text-gray-500">{p.brand}</p>}
          <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1">{p.title}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-emerald-700 font-semibold">{price}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1">
              {p.colors?.slice(0,4).map((c)=>(
                <span key={c} title={c} className="h-4 w-4 rounded-full border" style={{ background: c.toLowerCase() }} />
              ))}
              {p.colors && p.colors.length>4 && <span className="text-xs text-gray-400">+{p.colors.length-4}</span>}
            </div>
            <div className="text-xs text-gray-500">
              {p.sizes?.slice(0,4).join(' • ')}{p.sizes && p.sizes.length>4 ? '…':''}
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}
