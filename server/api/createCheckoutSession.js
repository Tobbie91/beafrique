const Stripe = require("stripe");

let stripe = null;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (!stripe) stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  return stripe;
}

const ALLOWED_ORIGINS = [
  "https://beafrique.netlify.app",
  "http://localhost:5173",
  // add your custom domain when live:
  // "https://beafrique.co",
];

function pickOrigin(reqBodyReturnUrl, reqHeaders) {
  const candidates = [];

  // 1) explicit from client
  if (reqBodyReturnUrl) candidates.push(reqBodyReturnUrl);

  // 2) request headers (some hosts set these)
  if (reqHeaders?.origin) candidates.push(reqHeaders.origin);
  if (reqHeaders?.referer) {
    try { candidates.push(new URL(reqHeaders.referer).origin); } catch {}
  }

  // 3) env (optional)
  if (process.env.APP_URL) candidates.push(process.env.APP_URL);

  // 4) final fallback: your Netlify site
  candidates.push("https://beafrique.netlify.app");

  for (const c of candidates) {
    try {
      const u = new URL(c);
      const origin = `${u.protocol}//${u.host}`;
      if (ALLOWED_ORIGINS.includes(origin)) return origin;
    } catch {}
  }
  return "https://beafrique.netlify.app";
}

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

    const line_items = body.items.map((raw, i) => {
      const slug = String(raw.slug || "").trim().toLowerCase();
      const qty = Math.max(1, Number(raw.qty || 0));
      if (!slug) throw new Error(`Item ${i + 1} missing slug`);
      if (!qty) throw new Error(`Item ${i + 1} invalid qty`);

      const unit_amount = PRICE_MAP_GBP[slug];
      if (!unit_amount) throw new Error(`Unknown slug "${slug}"`);

      return {
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
      };
    });

    const orderId = body.orderId || `ord_${Date.now()}`;
    const origin = pickOrigin(body.returnUrl, req.headers);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: body.email || undefined,
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ["GB", "NG", "US", "CA", "IE", "FR", "DE"],
      },
      billing_address_collection: "auto",
      success_url: `${origin}/checkout/success?oid=${encodeURIComponent(orderId)}&sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?oid=${encodeURIComponent(orderId)}`,
      metadata: { orderId },
      payment_intent_data: { metadata: { orderId } },
    });

    return res.status(200).json({ url: session.url, origin });
  } catch (err) {
    console.error("createCheckoutSession error:", err?.stack || err?.message || err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
};
