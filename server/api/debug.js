module.exports = (req, res) => {
  const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
  // Don’t print the key value—just its presence.
  let stripePkg = null;
  try { stripePkg = require("stripe/package.json").version; } catch (e) {}
  res.status(200).json({
    ok: true,
    hasStripeKey,
    stripePkg,              // should show "12.18.0" if dependency installed
    node: process.version,
  });
};
