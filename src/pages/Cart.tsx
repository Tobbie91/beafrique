// src/pages/Cart.tsx
import { useCart } from "../store/cart";
import { startCheckout } from "../lib/checkout";
import { useState } from "react";

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasItems = items.length > 0;

  const checkout = async () => {
    if (!hasItems) return;

    // Validate all items have valid prices
    const invalidItems = items.filter(i => !i.price || i.price <= 0);
    if (invalidItems.length > 0) {
      setError('Some items in your cart have invalid prices. Please remove them and try again.');
      return;
    }

    setError(null); // Clear previous errors
    setBusy(true);
    try {
      await startCheckout({
        items: items.map((i) => ({
          slug: i.slug,
          qty: i.qty,
          size: i.size ?? undefined,
          color: i.color ?? undefined,
          amount: Math.round((i.price || 0) * 100), // use price in minor units
          currency: (i.currency || "gbp").toLowerCase(),
        })),
      });
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err?.message || 'Failed to start checkout. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your cart</h1>

      {!hasItems && <p>Your cart is empty.</p>}

      {hasItems && (
        <>
          <ul className="divide-y border rounded-2xl bg-white">
            {items.map((i) => (
              <li
                key={`${i.slug}-${i.size}-${i.color}`}
                className="p-4 flex gap-4 items-center"
              >
                <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden">
                  {i.image ? (
                    <img
                      src={i.image}
                      className="w-full h-full object-cover"
                      alt={i.title || i.slug}
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{i.title || i.slug}</div>
                  <div className="text-sm text-gray-500">
                    {i.color ? <>Colour: {i.color} · </> : null}
                    {i.size ? <>Size: {i.size}</> : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() =>
                      setQty(
                        i.slug,
                        i.size ?? null,
                        i.color ?? null,
                        Math.max(1, i.qty - 1)
                      )
                    }
                  >
                    -
                  </button>
                  <input
                    className="w-12 text-center border rounded py-1"
                    value={i.qty}
                    onChange={(e) =>
                      setQty(
                        i.slug,
                        i.size ?? null,
                        i.color ?? null,
                        Math.max(
                          1,
                          parseInt(e.target.value || "1", 10)
                        )
                      )
                    }
                  />
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() =>
                      setQty(
                        i.slug,
                        i.size ?? null,
                        i.color ?? null,
                        i.qty + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="ml-4 text-red-600 text-sm"
                  onClick={() =>
                    remove(i.slug, i.size ?? null, i.color ?? null)
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
              <p className="font-semibold">Checkout Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={checkout}
              disabled={busy}
              className={`px-5 py-3 rounded text-white ${
                busy
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {busy ? "Redirecting…" : "Checkout"}
            </button>
            <button
              onClick={clear}
              className="px-5 py-3 rounded border hover:bg-gray-50"
            >
              Clear cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
