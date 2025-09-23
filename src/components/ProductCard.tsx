import { Link } from 'react-router-dom'
import type { Product } from '../data/products'

/** Add Cloudinary transformations if the URL is a Cloudinary URL */
function cld(url: string, tx = 'f_auto,q_auto,c_fill,w_800,h_1000') {
  if (!url) return url
  const i = url.indexOf('/upload/')
  return i > -1 ? url.slice(0, i + 8) + tx + '/' + url.slice(i + 8) : url
}

export default function ProductCard({ p }: { p: Product }) {
  const img = cld(p.image)
  const price = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(p.price)

  return (
    <article className="group rounded-2xl overflow-hidden border bg-white shadow-soft">
      <Link to={`/products/${p.slug}`} className="block relative">
        {/* Reserve space to prevent layout shift */}
        <div className="aspect-[4/5] bg-gray-100">
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        {/* Optional pill (remove if not needed) */}
        <span className="absolute left-3 top-3 rounded-full bg-yellow-400/90 text-gray-900 text-xs font-semibold px-2.5 py-1">
          New
        </span>
      </Link>

      <div className="p-4">
        <h3 className="font-medium">{p.name}</h3>
        <p className="mt-1 text-green-700 font-semibold">{price}</p>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/products/${p.slug}`}
            className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            View
          </Link>
          <Link
            to="/checkout"
            className="flex-1 rounded-lg bg-green-600 text-white px-4 py-2 hover:bg-green-700"
          >
            Buy
          </Link>
        </div>
      </div>
    </article>
  )
}

