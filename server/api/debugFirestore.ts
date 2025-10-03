// server/api/debugFirestore.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../lib/firebase";
// import { db } from "../lib/firebase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const doc = await db.doc("products/hanna-jacket").get();
    if (!doc.exists) {
      return res.status(200).json({ ok: false, reason: "doc_missing" });
    }
    const d = doc.data() as any;
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
  } catch (e: any) {
    res.status(200).json({ ok: false, error: e?.message || String(e) });
  }
}
