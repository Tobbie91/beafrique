export async function startCheckout(payload: {
    items: { slug: string; qty?: number; size?: string | null; color?: string | null }[];
    customer_email?: string;
  }) {
    const base = import.meta.env.VITE_API_BASE || "/api";
    const resp = await fetch(`${base}/createCheckoutSession`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.error || "Checkout failed");
    if (data?.url) {
      window.location.href = data.url;  // redirect to Stripe Checkout
    } else {
      throw new Error("No URL returned by server");
    }
  }
  