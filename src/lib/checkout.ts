const base = "https://beafrique-server.vercel.app";

export async function startCheckout(payload: {
  items: { slug: string; qty: number; size?: string; color?: string }[];
  orderId?: string;
  email?: string;
}) {
  const returnUrl = window.location.origin; // ← ensures Stripe returns to your site

  const res = await fetch(`${base}/api/createCheckoutSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, returnUrl }),
  });
  const { url } = await res.json();
  if (!url) throw new Error("No checkout URL");
  window.location.href = url;
}
