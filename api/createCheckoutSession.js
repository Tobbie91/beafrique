
const Stripe = require("stripe");

let stripe = null;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (!stripe) stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  return stripe;
}

const PRICE_MAP_GBP = { "hanna-jacket": 7900 };

function toInt(n) { const x = Number(n); return Number.isFinite(x) ? Math.round(x) : NaN; }
function toMinorUnits(major) { const x = Number(major); return Number.isFinite(x) ? Math.round(x * 100) : NaN; }
function normaliseCurrency(cur) { return String(cur || "gbp").trim().toLowerCase(); }

async function buildLineItem(raw, idx) {
  const slug = String(raw?.slug || "").trim().toLowerCase();
  const qty  = Math.max(1, Number(raw?.qty || 0));
  if (!slug) throw new Error(`Item ${idx + 1} missing slug`);
  if (!qty)  throw new Error(`Item ${idx + 1} invalid qty`);

  if (raw?.priceId) return { quantity: qty, price: String(raw.priceId) };

  const currency = normaliseCurrency(raw?.currency || "gbp");
  let amountMinor;

  if (raw?.amount != null) {
    const asInt = toInt(raw.amount);
    if (!Number.isNaN(asInt) && asInt > 0) amountMinor = asInt;
  } else if (raw?.price != null) {
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
            productSlug: slug,
            size: raw?.size ? String(raw.size) : "",
            color: raw?.color ? String(raw.color) : "",
          },
        },
      },
    };
  }

  if (currency === "gbp" && PRICE_MAP_GBP[slug]) {
    return {
      quantity: qty,
      price_data: {
        currency: "gbp",
        unit_amount: PRICE_MAP_GBP[slug],
        product_data: {
          name: slug.replace(/-/g, " "),
          metadata: {
            productSlug: slug,
            size: raw?.size ? String(raw.size) : "",
            color: raw?.color ? String(raw.color) : "",
          },
        },
      },
    };
  }

  throw new Error(`No price for "${slug}". Provide priceId or amount/price+currency, or add to PRICE_MAP_GBP.`);
}

module.exports = async (req, res) => {
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

    // Build line items + subtotal (minor units)
    const line_items = [];
    let currency = "gbp";
    let subtotalMinor = 0;
    for (let i = 0; i < body.items.length; i++) {
      const li = await buildLineItem(body.items[i], i);
      line_items.push(li);
      const liCur = li.price?.currency || li.price_data?.currency || "gbp";
      if (i === 0) currency = liCur;
      if (liCur !== currency) throw new Error("All line_items must use the same currency.");

      const unit = li.price_data?.unit_amount ?? null;
      const qty  = li.quantity ?? 1;
      if (typeof unit === "number") subtotalMinor += unit * qty;
    }

    // Shipping options (Pickup + Delivery with £0 >= £100 else £3.50)
    const FREE_THRESHOLD = 10000; // £100
    const shipping_options = [
      {
        shipping_rate_data: {
          display_name: "Store pickup (Portsmouth)",
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency },
          delivery_estimate: { minimum: { unit: "business_day", value: 0 }, maximum: { unit: "business_day", value: 1 } }
        }
      },
      {
        shipping_rate_data: {
          display_name: "Standard delivery",
          type: "fixed_amount",
          fixed_amount: { amount: subtotalMinor >= FREE_THRESHOLD ? 0 : 350, currency },
          delivery_estimate: { minimum: { unit: "business_day", value: 2 }, maximum: { unit: "business_day", value: 5 } }
        }
      }
    ];

    const hdrProto = req.headers["x-forwarded-proto"];
    const hdrHost  = req.headers["x-forwarded-host"];
    const inferredOrigin = hdrProto && hdrHost ? `${hdrProto}://${hdrHost}` : null;
    const returnUrl =
      (typeof body.returnUrl === "string" && body.returnUrl.startsWith("http"))
        ? body.returnUrl
        : (process.env.APP_URL || inferredOrigin || "https://beafrique.com");

    const orderId = body.orderId || `ord_${Date.now()}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      payment_method_types: ["card", "klarna", "revolut_pay", "link", "paypal"],
      customer_email: body.email || undefined,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ["GB","IE","FR","DE","US","CA","NG"] },
      shipping_options, // <-- IMPORTANT: now passed in
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
