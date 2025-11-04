// src/pages/Checkout.tsx
import { useCart } from "../store/cart";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { startCheckout } from "../lib/checkout";

const GBP = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const FREE_THRESHOLD = 100;   // £100
const SHIPPING_FEE = 3.5;     // £3.50

export default function Checkout() {
  const { items, setQty, remove } = useCart();
  const [busy, setBusy] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (i.price || 0) * i.qty, 0),
    [items]
  );

  // Display-only preview (Stripe still calculates the final shipping on Checkout)
  const shipping = subtotal >= FREE_THRESHOLD ? 0 : SHIPPING_FEE;
  const estTotal = subtotal + shipping;

  if (!items.length) {
    return (
      <div className="container py-12">
        <p>Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block px-4 py-2 rounded bg-emerald-600 text-white">
          Shop products
        </Link>
      </div>
    );
  }

  async function pay() {
    setBusy(true);
    await startCheckout({
      items: items.map(i => ({
        slug: i.slug,
        qty: i.qty,
        size: i.size ?? undefined,
        color: i.color ?? undefined,
        amount: Math.round((i.price || 0) * 100),
        currency: "gbp",
      })),
      // (optional) send email if you have it, else Stripe will ask
      // email: userEmail,
    });
  }

  return (
    <div className="container py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>

        <div className="mt-6 space-y-4">
          {items.map((i) => (
            <div
              key={`${i.slug}-${i.size ?? ""}-${i.color ?? ""}`}
              className="p-4 rounded-xl border flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {i.image && (
                  <img
                    src={i.image}
                    alt={i.slug}
                    className="h-16 w-16 rounded object-cover border"
                  />
                )}
                <div>
                  <p className="font-medium">{i.title || i.slug}</p>
                  <p className="text-sm text-gray-600">
                    {i.size ? `UK ${i.size} • ` : ""}
                    {GBP.format(i.price || 0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) =>
                    setQty(
                      i.slug,
                      i.size ?? null,
                      i.color ?? null,
                      Math.max(1, Number(e.target.value || 1))
                    )
                  }
                  className="w-20 border rounded-lg px-3 py-2"
                />
                <button
                  onClick={() => remove(i.slug, i.size ?? null, i.color ?? null)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="h-fit p-6 rounded-xl border bg-white shadow-sm">
        {/* Shipping rule banner */}
        <div className="rounded-lg bg-emerald-50 text-emerald-900 text-sm p-3 mb-4">
          <strong>Delivery:</strong> {`£${SHIPPING_FEE.toFixed(2)} for orders under £${FREE_THRESHOLD}, `}
          <strong>free</strong> when you spend £{FREE_THRESHOLD}+.
        </div>

        <div className="flex justify-between text-sm text-gray-700">
          <span>Subtotal</span>
          <span>{GBP.format(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-700 mt-1">
          <span>Delivery</span>
          <span className={shipping === 0 ? "text-emerald-700 font-medium" : ""}>
            {shipping === 0 ? "Free" : GBP.format(shipping)}
          </span>
        </div>

        <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
          <span>Estimated total</span>
          <span>{GBP.format(estTotal)}</span>
        </div>

        <p className="mt-2 text-[12px] text-gray-500">
          Final delivery cost is applied in Stripe Checkout based on these rules.
        </p>

        <button
          onClick={pay}
          disabled={busy}
          className={`mt-6 w-full rounded-lg px-5 py-3 text-white ${
            busy ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {busy ? "Redirecting…" : "Pay securely"}
        </button>
      </aside>
    </div>
  );
}
