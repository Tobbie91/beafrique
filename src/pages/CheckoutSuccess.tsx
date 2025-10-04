// src/pages/CheckoutSuccess.tsx
import { useLocation } from "react-router-dom";

export default function CheckoutSuccess() {
  const q = new URLSearchParams(useLocation().search);
  const oid = q.get("oid");
  const sid = q.get("sid"); // Stripe session id
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-emerald-900">Payment successful 🎉</h1>
      <p className="mt-2 text-gray-700">Order: {oid}</p>
      <p className="text-gray-700">Session: {sid}</p>
      <p className="mt-4 text-sm text-gray-500">We’ll email your receipt shortly.</p>
    </div>
  );
}

