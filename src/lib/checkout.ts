// src/lib/checkout.ts
// const base = import.meta.env.VITE_API_BASE;  
// const returnUrl = window.location.origin;  
// export async function startCheckout(payload: {
//   items: {
//     slug: string;
//     qty: number;
//     size?: string;
//     color?: string;
//     amount?: number;
//     currency?: string;
//     priceId?: string;
//   }[];
//   orderId?: string;
//   email?: string;
// }) {
//   const problems: string[] = [];
//   if (!payload.items?.length) problems.push("Cart is empty.");
//   payload.items.forEach((it, idx) => {
//     if (!it.slug) problems.push(`Item ${idx + 1} is missing slug.`);
//     if (!it.qty || it.qty < 1) problems.push(`Item ${idx + 1} has invalid qty.`);
//   });
//   if (problems.length) throw new Error(problems.join(" "));

//   const returnUrl = window.location.origin; 

//   const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/createCheckoutSession`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ ...payload, returnUrl }),
//   });

//   const text = await res.text();
//   if (!res.ok) throw new Error((() => { try { return JSON.parse(text)?.error } catch { return text } })() || `HTTP ${res.status}`);
//   const { url } = JSON.parse(text);
//   if (!url) throw new Error("Server did not return a checkout URL");
//   window.location.href = url;
// }

// src/lib/checkout.ts
const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || ""; // empty = same-origin

export async function startCheckout(payload: {
  items: Array<{
    slug: string; qty: number; size?: string; color?: string;
    amount?: number; currency?: string; priceId?: string;
  }>;
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

  const returnUrl = window.location.origin;

  const res = await fetch(`${API_BASE}/api/createCheckoutSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, returnUrl }),
  });

  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text)?.error || msg; } catch {}
    throw new Error(msg || `HTTP ${res.status}`);
  }

  const { url } = JSON.parse(text);
  if (!url) throw new Error("Server did not return a checkout URL");
  window.location.href = url;
}
