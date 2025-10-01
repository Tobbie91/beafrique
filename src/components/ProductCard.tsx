// import { Link } from 'react-router-dom'
// import type { Product } from '../data/products'

// /** Add Cloudinary transformations if the URL is a Cloudinary URL */
// function cld(url: string, tx = 'f_auto,q_auto,c_fill,w_800,h_1000') {
//   if (!url) return url
//   const i = url.indexOf('/upload/')
//   return i > -1 ? url.slice(0, i + 8) + tx + '/' + url.slice(i + 8) : url
// }

// export default function ProductCard({ p }: { p: Product }) {
//   const img = cld(p.image)
//   const price = new Intl.NumberFormat('en-NG', {
//     style: 'currency',
//     currency: 'NGN',
//     maximumFractionDigits: 0,
//   }).format(p.price)

//   return (
//     <article className="group rounded-2xl overflow-hidden border bg-white shadow-soft">
//       <Link to={`/products/${p.slug}`} className="block relative">
//         {/* Reserve space to prevent layout shift */}
//         <div className="aspect-[4/5] bg-gray-100">
//           <img
//             src={img}
//             alt={p.name}
//             loading="lazy"
//             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
//           />
//         </div>

//         {/* Optional pill (remove if not needed) */}
//         <span className="absolute left-3 top-3 rounded-full bg-yellow-400/90 text-gray-900 text-xs font-semibold px-2.5 py-1">
//           New
//         </span>
//       </Link>

//       <div className="p-4">
//         <h3 className="font-medium">{p.name}</h3>
//         <p className="mt-1 text-green-700 font-semibold">{price}</p>

//         <div className="mt-4 flex gap-2">
//           <Link
//             to={`/products/${p.slug}`}
//             className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
//           >
//             View
//           </Link>
//           <Link
//             to="/checkout"
//             className="flex-1 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700"
//           >
//             Buy
//           </Link>
//         </div>
//       </div>
//     </article>
//   )
// }

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
