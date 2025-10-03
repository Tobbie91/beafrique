// src/lib/checkout.ts
export async function startCheckout(payload: {
  items: { slug: string; qty: number; size?: string; color?: string }[];
  orderId?: string;
}) {
  const base = import.meta.env.VITE_API_BASE;
  if (!base) throw new Error("VITE_API_BASE is not set");

  // Only include returnUrl during local dev so success redirects to your app.
  const maybeReturnUrl =
    import.meta.env.DEV
      ? (import.meta.env.VITE_SITE_URL as string) || "http://localhost:5173"
      : undefined;

  const res = await fetch(`${base}/api/createCheckoutSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, ...(maybeReturnUrl ? { returnUrl: maybeReturnUrl } : {}) }),
  });

  if (!res.ok) {
    let msg = await res.text().catch(() => "");
    if (!msg) msg = `Status ${res.status}`;
    throw new Error(`Could not start checkout. ${msg}`);
  }

  const data = await res.json();
  if (!data?.url) throw new Error("Server did not return a checkout URL");
  window.location.href = data.url;
}


  