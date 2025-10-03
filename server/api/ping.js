module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({ ok: true, ts: Date.now(), env: !!process.env.STRIPE_SECRET_KEY });
};
