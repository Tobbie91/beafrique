// /api/contact.js
const { Resend } = require("resend");

// Env: set these in Vercel → Project → Settings → Environment Variables
const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_TO_EMAIL; // client's inbox
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "no-reply@yourdomain.com";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { name = "", email = "", phone = "", message = "" } = req.body || {};
    const clean = (s) => String(s || "").trim();

    const n = clean(name);
    const e = clean(email);
    const p = clean(phone);
    const m = clean(message);

    if (n.length < 2) return res.status(400).json({ error: "Name is required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return res.status(400).json({ error: "Valid email required" });
    if (m.length < 5) return res.status(400).json({ error: "Message too short" });

    if (clean(req.body?.company)) {
      return res.status(200).json({ ok: true });
    }

    const subject = `New Consultation Request from ${n}`;
    const html = `
      <h2>New Consultation Request</h2>
      <p><strong>Name:</strong> ${n}</p>
      <p><strong>Email:</strong> ${e}</p>
      ${p ? `<p><strong>Phone:</strong> ${p}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${m.replace(/\n/g, "<br/>")}</p>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,       
      to: [TO_EMAIL],
      subject,
      html,
      reply_to: e,    
    });

    if (result?.error) throw new Error(result.error?.message || "Failed to send");

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact error:", err);
    res.status(500).json({ error: "Could not send your message. Please try again." });
  }
};
