import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { db } from "../lib/firebase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: "2024-06-20" });

function cors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { items = [], customer_email } = body;

    // expected: items = [{ slug, qty?, size?, color? }, ...]
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: "No items" });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const it of items) {
      const snap = await db.doc(`products/${it.slug}`).get();
      if (!snap.exists) continue;
      const p = snap.data() as any;

      const unit_amount = Number(p.min_price_cents || 0); // pence (GBP) or minor units
      if (!unit_amount) continue;

      line_items.push({
        quantity: Math.max(1, Number(it.qty || 1)),
        price_data: {
          currency: (p.currency || "GBP").toLowerCase(),
          unit_amount,
          product_data: {
            name: String(p.title || it.slug),
            images: p.primary_image_url ? [String(p.primary_image_url)] : [],
            metadata: {
              slug: String(it.slug),
              ...(it.size ? { size: String(it.size) } : {}),
              ...(it.color ? { color: String(it.color) } : {})
            }
          }
        }
      });
    }

    if (!line_items.length) return res.status(400).json({ error: "No valid line items" });

    const siteUrl = process.env.SITE_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: { allowed_countries: ["GB", "NG", "US", "CA", "IE", "FR", "DE"] },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      customer_email,
      metadata: { source: "beafrique" }
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
}
