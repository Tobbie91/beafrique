// /api/createCheckoutSession.js
const Stripe = require("stripe");

let stripe = null;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (!stripe) stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  return stripe;
}

const PRICE_MAP_GBP = {
  "hanna-jacket": 7900,
};

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const stripe = getStripe();
    const body = req.body || {};
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ error: "items[] required" });
    }

    // 🔽🔽🔽 INSERT SNIPPET HERE
    const hdrProto = req.headers["x-forwarded-proto"];
    const hdrHost  = req.headers["x-forwarded-host"];
    const inferredOrigin = hdrProto && hdrHost ? `${hdrProto}://${hdrHost}` : null;

    const returnUrl =
      (typeof body.returnUrl === "string" && body.returnUrl.startsWith("http"))
        ? body.returnUrl
        : (process.env.APP_URL || inferredOrigin || "https://beafrique.netlify.app");

    // TEMP debug (remove after verifying)
    console.log("[checkout] returnUrl used:", returnUrl, {
      bodyReturnUrl: body.returnUrl,
      appUrl: process.env.APP_URL,
      inferredOrigin,
    });
    // 🔼🔼🔼 END INSERT

    // Validate & build line items
    const line_items = [];
    for (let i = 0; i < body.items.length; i++) {
      const raw = body.items[i] || {};
      const slug = String(raw.slug || "").trim().toLowerCase();
      const qty = Math.max(1, Number(raw.qty || 0));
      if (!slug) return res.status(400).json({ error: `Item ${i + 1} missing slug` });
      if (!qty)  return res.status(400).json({ error: `Item ${i + 1} invalid qty` });

      const unit_amount = PRICE_MAP_GBP[slug];
      if (!unit_amount) {
        return res.status(400).json({ error: `Unknown slug "${slug}". Add it to PRICE_MAP_GBP or do a DB lookup.` });
      }

      line_items.push({
        quantity: qty,
        price_data: {
          currency: "gbp",
          unit_amount,
          product_data: {
            name: slug.replace(/-/g, " "),
            metadata: {
              slug,
              size: raw.size ? String(raw.size) : "",
              color: raw.color ? String(raw.color) : "",
            },
          },
        },
      });
    }

    const orderId = body.orderId || `ord_${Date.now()}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: body.email || undefined,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ["GB","NG","US","CA","IE","FR","DE"] },
      billing_address_collection: "auto",
      success_url: `${returnUrl}/checkout/success?oid=${encodeURIComponent(orderId)}&sid={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${returnUrl}/checkout/cancel?oid=${encodeURIComponent(orderId)}`,
      metadata: { orderId },
      payment_intent_data: { metadata: { orderId } },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err && (err.stack || err.message || err));
    return res.status(500).json({ error: String(err && (err.message || err)) });
  }
};
