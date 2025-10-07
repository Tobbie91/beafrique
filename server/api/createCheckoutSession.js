// /api/createCheckoutSession.js
const Stripe = require("stripe");

let stripe = null;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (!stripe) stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  return stripe;
}

// Optional fallback prices (GBP, in pence)
const PRICE_MAP_GBP = {
  "hanna-jacket": 7900, // £79.00
  // add more slugs here if you want a static fallback
};

function toInt(n) {
  const x = Number(n);
  return Number.isFinite(x) ? Math.round(x) : NaN;
}

function toMinorUnits(major) {
  const x = Number(major);
  return Number.isFinite(x) ? Math.round(x * 100) : NaN;
}

function normaliseCurrency(cur) {
  return String(cur || "gbp").trim().toLowerCase();
}

async function buildLineItem(raw, idx) {
  const slug = String(raw?.slug || "").trim().toLowerCase();
  const qty  = Math.max(1, Number(raw?.qty || 0));
  if (!slug) throw new Error(`Item ${idx + 1} missing slug`);
  if (!qty)  throw new Error(`Item ${idx + 1} invalid qty`);

  // 1) Secure path: Stripe Price ID
  if (raw?.priceId) {
    return {
      quantity: qty,
      price: String(raw.priceId),
    };
  }

  // 2) Explicit client price (use ONLY for testing; clients can be tampered with)
  // Prefer amount (minor units); else price (major units) + currency
  const currency = normaliseCurrency(raw?.currency || "gbp");
  let amountMinor = undefined;

  if (raw?.amount != null) {
    // amount is expected in minor units already (e.g. pence)
    const asInt = toInt(raw.amount);
    if (!Number.isNaN(asInt) && asInt > 0) amountMinor = asInt;
  } else if (raw?.price != null) {
    // price assumed in major units (e.g. pounds)
    const asMinor = toMinorUnits(raw.price);
    if (!Number.isNaN(asMinor) && asMinor > 0) amountMinor = asMinor;
  }

  if (amountMinor) {
    return {
      quantity: qty,
      price_data: {
        currency,
        unit_amount: amountMinor,
        product_data: {
          name: slug.replace(/-/g, " "),
          metadata: {
            slug,
            size: raw?.size ? String(raw.size) : "",
            color: raw?.color ? String(raw.color) : "",
          },
        },
      },
    };
  }

  // 3) Fallback static map (GBP only)
  if (currency === "gbp" && PRICE_MAP_GBP[slug]) {
    return {
      quantity: qty,
      price_data: {
        currency: "gbp",
        unit_amount: PRICE_MAP_GBP[slug],
        product_data: {
          name: slug.replace(/-/g, " "),
          metadata: {
            slug,
            size: raw?.size ? String(raw.size) : "",
            color: raw?.color ? String(raw.color) : "",
          },
        },
      },
    };
  }

  // Nothing resolved
  throw new Error(
    `No price for "${slug}". Pass a Stripe priceId, or amount/price+currency, or add it to PRICE_MAP_GBP.`
  );
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

    // Pick returnUrl: prefer client, else APP_URL, else infer, else fallback
    const hdrProto = req.headers["x-forwarded-proto"];
    const hdrHost  = req.headers["x-forwarded-host"];
    const inferredOrigin = hdrProto && hdrHost ? `${hdrProto}://${hdrHost}` : null;

    const returnUrl =
      (typeof body.returnUrl === "string" && body.returnUrl.startsWith("http"))
        ? body.returnUrl
        : (process.env.APP_URL || inferredOrigin || "https://beafrique.com");

    const line_items = [];
    for (let i = 0; i < body.items.length; i++) {
      line_items.push(await buildLineItem(body.items[i], i));
    }

    const orderId = body.orderId || `ord_${Date.now()}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: body.email || undefined,
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ["GB","NG","US","CA","IE","FR","DE"]
      },
      billing_address_collection: "auto",
      success_url: `${returnUrl}/checkout/success?oid=${encodeURIComponent(orderId)}&sid={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${returnUrl}/checkout/cancel?oid=${encodeURIComponent(orderId)}`,
      metadata: { orderId },
      payment_intent_data: { metadata: { orderId } },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err?.stack || err?.message || err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
};

