// src/pages/CheckoutSuccess.tsx
// src/pages/CheckoutSuccess.tsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../store/cart";


type SessionInfo = {
  amount_total: number;
  currency: string;
  payment_status: string;
  payment_method?: string | null;
  receipt_url?: string | null;
};

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sid = params.get("sid");           // Stripe Checkout Session ID
  const oid = params.get("oid") || "";     // our order id
  const { clear } = useCart();
  const [info, setInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // clear cart once on success page
    clear();

    (async () => {
      if (!sid) { setLoading(false); return; }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/getCheckoutSession?sid=${encodeURIComponent(sid)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        setInfo(data as SessionInfo);
      } catch (e: any) {
        setErr(e?.message || "Could not load receipt");
      } finally {
        setLoading(false);
      }
    })();
  }, [sid, clear]);

  return (
    <div className="container py-12">
      <h1 className="text-2xl md:text-3xl font-bold">Payment successful</h1>
      <p className="text-gray-600 mt-1">Thank you! Your order has been received.</p>

      <div className="mt-6 grid gap-4 max-w-xl">
        <div className="rounded-xl border p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order ID</span>
            <span className="font-medium">{oid || "—"}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Stripe session</span>
            <span className="font-mono text-xs">{sid || "—"}</span>
          </div>

          {loading && <p className="mt-3 text-sm">Fetching receipt…</p>}
          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

          {info && (
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">
                  {info.currency?.toUpperCase()} {(info.amount_total / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium capitalize">{info.payment_status}</span>
              </div>
              {info.payment_method && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium">{info.payment_method}</span>
                </div>
              )}
              {info.receipt_url && (
                <div className="pt-2">
                  <a
                    href={info.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 underline"
                  >
                    View Stripe receipt
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link to="/catalogue" className="rounded-lg bg-emerald-600 text-white px-5 py-2 font-semibold">
            Continue shopping
          </Link>
          <Link to="/cart" className="rounded-lg border px-5 py-2 font-semibold text-emerald-900">
            View my orders
          </Link>
        </div>
      </div>
    </div>
  );
}
