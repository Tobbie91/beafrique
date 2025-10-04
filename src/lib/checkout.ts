// src/lib/checkout.ts

// Your API server (Vercel)
const API_BASE =
  import.meta.env.VITE_API_BASE ?? "https://beafrique-server.vercel.app";

// Figure out where *this* app is running (local vs Netlify)
const APP_ORIGIN =
  typeof window !== "undefined"
    ? (import.meta.env.PROD
        ? "https://beafrique.netlify.app" // ← your Netlify domain
        : window.location.origin)         // dev: http://localhost:5173
    : "https://beafrique.netlify.app";

export async function startCheckout(payload: {
  items: { slug: string; qty: number; size?: string; color?: string }[];
  orderId?: string;
  email?: string;
}) {
  const problems: string[] = [];
  if (!payload.items?.length) problems.push("Cart is empty.");
  payload.items.forEach((it, i) => {
    if (!it.slug) problems.push(`Item ${i + 1} is missing slug.`);
    if (!it.qty || it.qty < 1) problems.push(`Item ${i + 1} has invalid qty.`);
  });
  if (problems.length) throw new Error(problems.join(" "));

  // If your server expects success/cancel, send both:
  const successUrl = `${APP_ORIGIN}/checkout/success`;
  const cancelUrl  = `${APP_ORIGIN}/cart`;

  const body = {
    ...payload,
    ...(payload.email ? { email: String(payload.email).trim() } : {}),
    // if your API expects a single returnUrl instead, keep this:
    returnUrl: APP_ORIGIN,
    // or if it expects success/cancel explicitly, pass these too:
    successUrl,
    cancelUrl,
  };

  const res = await fetch(`${API_BASE}/api/createCheckoutSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    try {
      const j = JSON.parse(text);
      throw new Error(j?.error || text || `HTTP ${res.status}`);
    } catch {
      throw new Error(text || `HTTP ${res.status}`);
    }
  }

  const { url } = JSON.parse(text);
  if (!url) throw new Error("Server did not return a checkout URL");
  window.location.href = url;
}
