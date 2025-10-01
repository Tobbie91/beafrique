import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

admin.initializeApp();
const db = admin.firestore();

const stripe = new Stripe(
  (functions.config().stripe && functions.config().stripe.secret) ||
    process.env.STRIPE_SECRET ||
    "",
  { apiVersion: "2024-06-20" } // <- match your installed Stripe types
);

function cors(res: any) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Stripe-Signature");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
}

// Create Checkout Session (Gen-1)
export const createCheckoutSession = functions.https.onRequest(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") { res.status(204).send(""); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { items = [], customer_email } = body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "No items" }); return;
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const it of items) {
      const snap = await db.doc(`products/${it.slug}`).get();
      if (!snap.exists) continue;
      const p = snap.data() as any;
      const unit_amount = Number(p.min_price_cents || 0); // pence
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
              ...(it.color ? { color: String(it.color) } : {}),
            },
          },
        },
      });
    }

    if (!line_items.length) { res.status(400).json({ error: "No valid line items" }); return; }

    const siteUrl =
      (functions.config().site && functions.config().site.url) ||
      process.env.SITE_URL ||
      "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: { allowed_countries: ["GB", "NG", "US", "CA", "IE", "FR", "DE"] },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      customer_email,
      metadata: { source: "beafrique" },
    });

    res.json({ id: session.id, url: session.url }); return;
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" }); return;
  }
});

// Webhook (Gen-1)
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") { res.status(405).send("Method not allowed"); return; }

  try {
    const sig = req.headers["stripe-signature"] as string;
    const whsec =
      (functions.config().stripe && functions.config().stripe.webhook) ||
      process.env.STRIPE_WEBHOOK ||
      "";

    const event = stripe.webhooks.constructEvent(req.rawBody, sig, whsec);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items.data.price.product"],
      });

      await db.collection("orders").doc(session.id).set({
        stripe_session_id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email || null,
        created_at: new Date(),
        line_items: (full.line_items?.data || []).map((li) => ({
          description: li.description,
          qty: li.quantity,
          amount_total: li.amount_total,
          metadata: (li.price?.product as any)?.metadata || {},
        })),
      });
    }

    res.json({ received: true }); return;
  } catch (err: any) {
    console.error("Webhook signature error:", err?.message);
    res.status(400).send(`Webhook Error: ${err?.message}`); return;
  }
});
