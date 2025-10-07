// src/lib/checkout.ts
// const base = import.meta.env.VITE_API_BASE;
// const returnUrl = import.meta.env.VITE_SITE_URL; // <- single source of truth
const base = import.meta.env.VITE_API_BASE;  // <- Netlify var
const returnUrl = window.location.origin;  
export async function startCheckout(payload: {
  items: { slug: string; qty: number; size?: string; color?: string }[];
  orderId?: string;
  email?: string;
}) {
  if (!payload.items?.length) throw new Error("Cart is empty.");

  const res = await fetch(`${base}/api/createCheckoutSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, returnUrl }),
  });

  const { url } = await res.json();
  if (!url) throw new Error("No checkout URL returned");
  window.location.href = url;
}
