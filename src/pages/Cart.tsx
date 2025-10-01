// src/pages/Cart.tsx
import { useCart } from "../store/cart";
import { startCheckout } from "../lib/checkout";

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();

  const hasItems = items.length > 0;
  // Display total from client data just for UX; real price will come from server
  // (Optionally you can fetch product docs here to compute an accurate preview total)

  const checkout = () => {
    if (!hasItems) return;
    startCheckout({
      items: items.map(i => ({
        slug: i.slug,
        qty: i.qty,
        size: i.size ?? undefined,
        color: i.color ?? undefined,
      })),
    });
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your cart</h1>

      {!hasItems && <p>Your cart is empty.</p>}

      {hasItems && (
        <>
          <ul className="divide-y border rounded-2xl bg-white">
            {items.map((i) => (
              <li key={`${i.slug}-${i.size}-${i.color}`} className="p-4 flex gap-4 items-center">
                <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden">
                  {i.image ? <img src={i.image} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{i.title || i.slug}</div>
                  <div className="text-sm text-gray-500">
                    {i.color ? <>Colour: {i.color} · </> : null}
                    {i.size ? <>Size: {i.size}</> : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 border rounded" onClick={() => setQty(i.slug, i.size ?? null, i.color ?? null, Math.max(1, i.qty - 1))}>-</button>
                  <input className="w-12 text-center border rounded py-1"
                         value={i.qty}
                         onChange={e=> setQty(i.slug, i.size ?? null, i.color ?? null, Math.max(1, parseInt(e.target.value||"1",10)))}/>
                  <button className="px-2 py-1 border rounded" onClick={() => setQty(i.slug, i.size ?? null, i.color ?? null, i.qty + 1)}>+</button>
                </div>
                <button className="ml-4 text-red-600 text-sm" onClick={() => remove(i.slug, i.size ?? null, i.color ?? null)}>Remove</button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-3">
            <button onClick={checkout} className="px-5 py-3 rounded bg-emerald-600 text-white">
              Checkout
            </button>
            <button onClick={clear} className="px-5 py-3 rounded border">
              Clear cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
