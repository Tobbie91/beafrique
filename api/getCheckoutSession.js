// /api/getCheckoutSession.js  (Vercel function)
const Stripe = require("stripe");

let stripe = null;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || "";
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (!stripe) stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  return stripe;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");
  const sid = req.query.sid;
  if (!sid) return res.status(400).json({ error: "sid required" });

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sid, {
      expand: ["payment_intent.payment_method"],
    });

    const pi = session.payment_intent;
    let method = null;
    let receiptUrl = null;
    if (pi && typeof pi === "object") {
      const pm = pi.payment_method;
      // human-ish label for common types
      if (pm?.card) method = `Card •••• ${pm.card.last4}`;
      else if (pm?.type) method = pm.type;
      receiptUrl = pi.charges?.data?.[0]?.receipt_url || null;
    }

    res.status(200).json({
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      payment_method: method,
      receipt_url: receiptUrl,
    });
  } catch (e) {
    console.error("getCheckoutSession error:", e?.message || e);
    res.status(500).json({ error: e?.message || "Failed to load session" });
  }
};
