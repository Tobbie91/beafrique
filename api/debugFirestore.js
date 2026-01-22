// server/api/debugFirestore.js
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

module.exports = async (req, res) => {
  try {
    const doc = await db.doc("products/hanna-jacket").get();
    if (!doc.exists) {
      return res.status(200).json({ ok: false, reason: "doc_missing" });
    }
    const d = doc.data();
    res.status(200).json({
      ok: true,
      data: {
        min_price_cents: d.min_price_cents,
        currency: d.currency,
        title: d.title,
        primary_image_url: d.primary_image_url,
        is_active: d.is_active,
      },
    });
  } catch (e) {
    res.status(200).json({ ok: false, error: e?.message || String(e) });
  }
};
