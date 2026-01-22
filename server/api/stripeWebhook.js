// server/api/stripeWebhook.js
const Stripe = require("stripe");
const admin = require("firebase-admin");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  });
}

const db = admin.firestore();

let stripe = null;
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (!stripe) stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  return stripe;
}

// Reduce stock after successful payment
async function reduceStock(lineItems) {
  if (!lineItems || lineItems.length === 0) {
    console.log("⚠️ No line items to process for stock reduction");
    return;
  }

  try {
    const batch = db.batch();

    for (const item of lineItems) {
      // Extract product info from metadata
      const metadata = item.price?.metadata || {};
      const productSlug = metadata.productSlug;
      const size = metadata.size;
      const color = metadata.color;
      const quantity = item.quantity || 1;

      if (!productSlug || !size || !color) {
        console.log(`⚠️ Missing metadata for item: ${item.description}`);
        continue;
      }

      // Get product from Firestore
      const productRef = db.collection('products').doc(productSlug);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        console.log(`⚠️ Product not found: ${productSlug}`);
        continue;
      }

      const productData = productDoc.data();
      const variants = productData.variants || [];

      // Find matching variant
      const variantIndex = variants.findIndex(v =>
        v.size === size && v.color === color
      );

      if (variantIndex === -1) {
        console.log(`⚠️ Variant not found: ${productSlug} - ${size} - ${color}`);
        continue;
      }

      // Reduce stock
      const currentStock = variants[variantIndex].stock || 0;
      const newStock = Math.max(0, currentStock - quantity);

      variants[variantIndex].stock = newStock;

      // Update product with new stock
      batch.update(productRef, { variants });

      console.log(`✅ Stock reduced: ${productSlug} (${size}, ${color}) - ${currentStock} → ${newStock}`);
    }

    // Commit all updates
    await batch.commit();
    console.log("✅ All stock updates completed");

  } catch (error) {
    console.error("❌ Stock reduction failed:", error.message);
  }
}

// WhatsApp notification via Twilio (optional - requires TWILIO credentials)
async function sendWhatsAppNotification(orderData) {
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g., "whatsapp:+14155238886"
  const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP; // e.g., "whatsapp:+447733729418"

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !ADMIN_WHATSAPP) {
    console.log("⚠️ WhatsApp notification skipped - Twilio credentials not configured");
    return;
  }

  try {
    const twilio = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const message = `🎉 NEW ORDER RECEIVED!

Order ID: ${orderData.orderId}
Amount: ${orderData.currency.toUpperCase()} ${(orderData.amount / 100).toFixed(2)}
Customer: ${orderData.customerEmail || "N/A"}
Phone: ${orderData.customerPhone || "N/A"}

Items:
${orderData.items.map(item => `- ${item.description} (x${item.qty})`).join('\n')}

Shipping: ${orderData.shippingName || "N/A"}
${orderData.shippingAddress || "N/A"}

View full details in your Stripe dashboard.`;

    await twilio.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to: ADMIN_WHATSAPP,
      body: message
    });

    console.log("✅ WhatsApp notification sent successfully");
  } catch (error) {
    console.error("❌ WhatsApp notification failed:", error.message);
  }
}

// Email notification via SendGrid (optional - requires SENDGRID_API_KEY)
async function sendEmailNotification(orderData) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "Bukonla@beafrique.com";
  const FROM_EMAIL = process.env.FROM_EMAIL || "orders@beafrique.com";

  if (!SENDGRID_API_KEY) {
    console.log("⚠️ Email notification skipped - SendGrid API key not configured");
    return;
  }

  try {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(SENDGRID_API_KEY);

    const itemsList = orderData.items
      .map(item => `<tr><td>${item.description}</td><td>${item.qty}</td><td>${orderData.currency.toUpperCase()} ${(item.amount / 100).toFixed(2)}</td></tr>`)
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">🎉 New Order Received!</h2>

        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Total Amount:</strong> ${orderData.currency.toUpperCase()} ${(orderData.amount / 100).toFixed(2)}</p>
          <p><strong>Payment Status:</strong> ${orderData.paymentStatus}</p>
        </div>

        <h3>Customer Details</h3>
        <p><strong>Email:</strong> ${orderData.customerEmail || "N/A"}</p>
        <p><strong>Phone:</strong> ${orderData.customerPhone || "N/A"}</p>

        <h3>Shipping Address</h3>
        <p><strong>Name:</strong> ${orderData.shippingName || "N/A"}</p>
        <p>${orderData.shippingAddress || "N/A"}</p>

        <h3>Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: left;">Qty</th>
              <th style="padding: 10px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="https://dashboard.stripe.com/test/payments/${orderData.sessionId}" style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Stripe Dashboard</a>
        </p>
      </div>
    `;

    await sgMail.send({
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `🛍️ New Order: ${orderData.orderId}`,
      html: htmlContent,
    });

    console.log("✅ Email notification sent successfully");
  } catch (error) {
    console.error("❌ Email notification failed:", error.message);
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("⚠️ STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  let event;

  try {
    const stripe = getStripe();

    // Vercel provides rawBody automatically
    const rawBody = req.body;
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Retrieve full session details with line items
      const stripe = getStripe();
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "customer", "shipping_cost"]
      });

      // Prepare order data for notifications
      const orderData = {
        orderId: fullSession.metadata?.orderId || fullSession.id,
        sessionId: fullSession.id,
        amount: fullSession.amount_total,
        currency: fullSession.currency,
        paymentStatus: fullSession.payment_status,
        customerEmail: fullSession.customer_details?.email,
        customerPhone: fullSession.customer_details?.phone,
        shippingName: fullSession.shipping_details?.name,
        shippingAddress: fullSession.shipping_details?.address
          ? `${fullSession.shipping_details.address.line1 || ""}\n${fullSession.shipping_details.address.line2 || ""}\n${fullSession.shipping_details.address.city || ""}, ${fullSession.shipping_details.address.state || ""} ${fullSession.shipping_details.address.postal_code || ""}\n${fullSession.shipping_details.address.country || ""}`.trim()
          : null,
        items: (fullSession.line_items?.data || []).map(item => ({
          description: item.description,
          qty: item.quantity,
          amount: item.amount_total,
        })),
      };

      console.log("📦 Order completed:", orderData.orderId);

      // Reduce stock for purchased items
      await reduceStock(fullSession.line_items?.data || []);

      // Send notifications (runs in parallel)
      await Promise.allSettled([
        sendWhatsAppNotification(orderData),
        sendEmailNotification(orderData)
      ]);

      // You can also save to Firebase here if needed
      // await saveOrderToFirestore(orderData);

    } catch (error) {
      console.error("❌ Error processing order:", error.message);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};
