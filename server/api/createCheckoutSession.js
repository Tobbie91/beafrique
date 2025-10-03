const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// TEMP price map so your curl works; replace with your DB lookup
const PRICE_MAP_GBP = {
  "hanna-jacket": 7900, // £79.00 in pence
};

module.exports = async (req, res) => {
  // CORS (keep while testing)
  res.setHeader("Access-Control-Allow-Origin", process.env.APP_URL || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("Missing STRIPE_SECRET_KEY");
      return res.status(500).send("Server not configured");
    }

    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [];
    const orderId = body.orderId || `ord_${Date.now()}`;

    if (!items.length) return res.status(400).json({ error: "items[] required" });

    const line_items = items.map((it) => {
      const unit_amount = PRICE_MAP_GBP[it.slug];
      if (!unit_amount) throw new Error(`Unknown slug: ${it.slug}`);
      const qty = Number(it.qty || 1);
      return {
        quantity: qty,
        price_data: {
          currency: "gbp",
          unit_amount,
          product_data: { name: String(it.slug || "").replace(/-/g, " ") },
        },
      };
    });

    const appUrl = process.env.APP_URL || "https://example.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "gbp",
      line_items,
      success_url: `${appUrl}/checkout/success?oid=${orderId}&sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel?oid=${orderId}`,
      metadata: { orderId },
    });

    console.log("Stripe session created:", session.id);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err && (err.message || err));
    return res.status(500).send(err?.message || "Internal Server Error");
  }
};
