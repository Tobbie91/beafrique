// src/lib/checkout.ts
export async function startCheckout(payload: {
  items: { slug: string; qty: number; size?: string; color?: string }[];
  returnUrl?: string;
}) {
  const base = import.meta.env.VITE_API_BASE; // e.g. https://beafrique-server.vercel.app
  const url = `${base}/api/createCheckoutSession`; // ⬅️ add /api here

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Checkout create failed: ${res.status} ${await res.text()}`);
  const { url: checkoutUrl } = await res.json();
  window.location.href = checkoutUrl;
}

  