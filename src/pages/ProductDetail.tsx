import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import { useCart } from "../store/cart";
import { useState } from "react";
import { BRAND } from "../config";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  const add = useCart((s) => s.add);

  const CURRENCY = BRAND?.currencySymbol ?? "₦";
  const SIZES = ["8", "10", "12", "14", "16"] as const;
  const [size, setSize] = useState<string>(SIZES[0]);
  const [qty, setQty] = useState(1);

  if (!product) return <div className="container py-10">Product not found</div>;

  const id = `${product.slug}-${size}`;

  return (
    <div className="container grid lg:grid-cols-2 gap-8 py-10">
      <img
        src={product.image}
        alt={product.name}
        className="rounded-2xl w-full h-[520px] object-cover border"
      />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
        <p className="mt-1 text-brand text-xl font-semibold">
          {CURRENCY}
          {product.price.toLocaleString()}
        </p>

        <p className="mt-4 text-gray-700">{product.description}</p>

        {/* Size */}
        <div className="mt-6 flex items-center gap-3">
          <label className="text-sm text-gray-600">Size (UK)</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Qty */}
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm text-gray-600">Qty</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="w-20 border rounded-lg px-3 py-2"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() =>
              add({
                id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                qty,
                size,
                image: product.image,
              })
            }
            className="rounded-lg bg-brand text-white px-5 py-3 hover:bg-brand-dark"
          >
            Add to Cart
          </button>
          <Link
            to="/checkout"
            className="rounded-lg border px-5 py-3 hover:bg-gray-50"
          >
            Go to Checkout
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          <p>• UK dispatch: 2–5 business days. International: 7–10 business days.</p>
          <p>• Care: Dry clean recommended / gentle hand wash.</p>
          <p>• Returns: 7-day returns on unused items.</p>
        </div>
      </div>
    </div>
  );
}
