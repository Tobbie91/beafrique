// src/lib/checkout.ts
const base = "https://beafrique-server.vercel.app";

export async function startCheckout(payload: {
  items: { slug: string; qty: number; size?: string; color?: string }[];
  orderId?: string;
  email?: string;
}) {
  const problems: string[] = [];
  if (!payload.items?.length) problems.push("Cart is empty.");
  payload.items.forEach((it, idx) => {
    if (!it.slug) problems.push(`Item ${idx + 1} is missing slug.`);
    if (!it.qty || it.qty < 1) problems.push(`Item ${idx + 1} has invalid qty.`);
  });
  if (problems.length) throw new Error(problems.join(" "));

  // 👇 use your site origin so success/cancel redirect back correctly on Netlify
  const returnUrl =
    typeof window !== "undefined"
      ? window.location.origin // e.g. https://beafrique.netlify.app
      : (import.meta as any).env?.VITE_APP_URL || "https://beafrique.netlify.app";

  const body = {
    ...payload,
    ...(payload.email ? { email: String(payload.email).trim() } : {}),
    returnUrl, // 👈 pass to server
  };

  const res = await fetch(`${base}/api/createCheckoutSession`, {
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
