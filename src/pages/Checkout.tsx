import { useCart } from "../store/cart";
import { BRAND, BANK } from "../config";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { startCheckout } from "../lib/checkout";

export default function Checkout() {
  const { items, updateQty, remove, clear } = useCart();
  const CURRENCY = BRAND?.currencySymbol ?? "₦";
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const orderId = useMemo(() => {
    const t = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `BA-${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}-${pad(
      t.getHours()
    )}${pad(t.getMinutes())}`;
  }, []);

  const [ship, setShip] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });
  const [agree, setAgree] = useState(false);

  if (!items.length) {
    return (
      <div className="container py-12">
        <p>Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block px-4 py-2 rounded bg-brand text-white">
          Shop products
        </Link>
      </div>
    );
  }

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      alert(text);
    }
  };

  // WhatsApp message (unchanged)
  const waText = `Hello ${BRAND.name},
Order ID: ${orderId}

Items:
${items
  .map(
    (i) =>
      `• ${i.name}${i.size ? ` (UK ${i.size})` : ""} ×${i.qty} = ${CURRENCY}${(
        i.price * i.qty
      ).toLocaleString()}`
  )
  .join("\n")}

Total: ${CURRENCY}${total.toLocaleString()}

Shipping details:
Name: ${ship.name || "-"}
Phone: ${ship.phone || "-"}
Email: ${ship.email || "-"}
Address: ${ship.address || "-"}, ${ship.city || "-"}, ${ship.state || "-"}

Payment method: Bank Transfer
I'll send proof shortly.`;

  // Simple validation before Stripe
  const validForPayment =
    ship.name.trim() &&
    ship.email.trim() &&
    agree &&
    items.every((i) => !!i.slug && i.qty > 0);

  const payWithCard = async () => {
    setErr(null);
    if (!validForPayment) {
      setErr("Please fill name & email and accept the terms.");
      return;
    }
    try {
      setBusy(true);
      await startCheckout({
        items: items.map((i) => ({
          slug: i.slug, // IMPORTANT: must match server price map/DB
          qty: i.qty,
          size: i.size ?? undefined,
          color: i.color ?? undefined,
        })),
        orderId,
      });
    } catch (e: any) {
      setErr(e?.message || "Could not start checkout");
      setBusy(false);
    }
  };

  return (
    <div className="container py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>

        {/* Items */}
        <div className="mt-6 space-y-4">
          {items.map((i) => (
            <div key={i.id} className="p-4 rounded-xl border flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {i.image && <img src={i.image} alt={i.name} className="h-16 w-16 rounded-lg object-cover border" />}
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-gray-600">
                    {i.size ? `UK ${i.size} • ` : ""}
                    {CURRENCY}
                    {i.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) => updateQty(i.id, Math.max(1, Number(e.target.value)))}
                  className="w-20 border rounded-lg px-3 py-2"
                />
                <button onClick={() => remove(i.id)} className="text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Info */}
        <div className="mt-8 p-6 rounded-xl border">
          <p className="font-semibold">Shipping information</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            <input
              placeholder="Full name *"
              value={ship.name}
              onChange={(e) => setShip({ ...ship, name: e.target.value })}
              className="border rounded-lg px-3 h-11"
            />
            <input
              placeholder="Phone"
              value={ship.phone}
              onChange={(e) => setShip({ ...ship, phone: e.target.value })}
              className="border rounded-lg px-3 h-11"
            />
            <input
              placeholder="Email *"
              value={ship.email}
              onChange={(e) => setShip({ ...ship, email: e.target.value })}
              className="border rounded-lg px-3 h-11 sm:col-span-2"
            />
            <input
              placeholder="Address line"
              value={ship.address}
              onChange={(e) => setShip({ ...ship, address: e.target.value })}
              className="border rounded-lg px-3 h-11 sm:col-span-2"
            />
            <input
              placeholder="City"
              value={ship.city}
              onChange={(e) => setShip({ ...ship, city: e.target.value })}
              className="border rounded-lg px-3 h-11"
            />
            <input
              placeholder="State / County"
              value={ship.state}
              onChange={(e) => setShip({ ...ship, state: e.target.value })}
              className="border rounded-lg px-3 h-11"
            />
          </div>

          <label className="flex items-start gap-2 mt-3 text-sm">
            <input type="checkbox" checked={!!agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>
              I agree to the <Link to="/terms" className="underline">Terms</Link> &{" "}
              <Link to="/returns" className="underline">Returns Policy</Link>.
            </span>
          </label>

          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        </div>
      </div>

      {/* Payment */}
      <aside className="h-fit p-6 rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Order summary</p>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{orderId}</span>
        </div>

        <div className="flex justify-between mt-2 text-sm text-gray-700">
          <span>Subtotal</span>
          <span>{CURRENCY}{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700 mt-1">
          <span>Shipping</span>
          <span>Calculated at fulfillment</span>
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>{CURRENCY}{total.toLocaleString()}</span>
        </div>

        {/* Stripe */}
        <button
          onClick={payWithCard}
          disabled={busy}
          className={`mt-6 w-full rounded-lg px-5 py-3 text-white ${busy ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
        >
          {busy ? "Redirecting…" : "Pay with Card (Secure)"}
        </button>

        {/* Bank Transfer (keep as alt) */}
        <div className="mt-6">
          <p className="font-semibold">Or pay by Bank Transfer</p>
          <div className="mt-2 p-4 rounded-lg bg-gray-50 border text-sm space-y-1">
            <p><strong>Bank:</strong> {BANK.bankName}</p>
            <p><strong>Account Name:</strong> {BANK.accountName}</p>
            <p className="flex items-center justify-between">
              <span>
                <strong>Account No:</strong> {BANK.accountNumber}
                {BANK.sortCode ? ` • Sort code: ${BANK.sortCode}` : ""}
              </span>
              <button onClick={() => copy(BANK.accountNumber)} className="ml-3 text-emerald-700 hover:underline">
                Copy
              </button>
            </p>
            {BANK.iban && (
              <p className="flex items-center justify-between">
                <span><strong>IBAN:</strong> {BANK.iban}</span>
                <button onClick={() => copy(BANK.iban!)} className="ml-3 text-emerald-700 hover:underline">
                  Copy
                </button>
              </p>
            )}
            <p className="mt-2 text-gray-600">
              {BANK.note || "Use your Order ID as payment reference."}
            </p>
          </div>

          <a
            href={`https://wa.me/${BRAND.whatsapp}?text=` + encodeURIComponent(waText)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center w-full rounded-lg bg-brand text-white px-5 py-3 hover:bg-brand-dark"
          >
            Send Proof on WhatsApp
          </a>

          <button onClick={clear} className="mt-3 w-full rounded-lg border px-5 py-3 hover:bg-gray-50">
            Clear Cart
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Card payments are processed securely by Stripe. Your items are reserved for 24h for bank transfers.
        </p>
      </aside>
    </div>
  );
}
