// src/pages/RefundPolicy.tsx
import { CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function RefundPolicy() {
  return (
    <section className="relative isolate">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:
        radial-gradient(600px_600px_at_0%_0%,rgba(250,204,21,0.08),transparent_60%),
        radial-gradient(800px_800px_at_100%_100%,rgba(16,185,129,0.08),transparent_60%)]" />

      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-emerald-800 px-3 py-1 text-xs font-semibold ring-1 ring-yellow-200">
            <FileText className="h-3.5 w-3.5" /> Store Policy
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-emerald-900">
            Refund & Returns Policy
          </h1>
          <p className="mt-2 text-sm text-gray-600">Last updated: Jan 2025</p>
        </div>

        {/* Body */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm">
            {/* Returns window */}
            <h2 className="text-lg font-semibold text-emerald-900">What is our returns policy?</h2>
            <p className="mt-2 text-[15px] leading-7 text-gray-700">
              You may return your order within <span className="font-semibold">5 days</span> of receiving it for a refund,
              exchange, or store credit (subject to the conditions below).
            </p>

            {/* Conditions */}
            <h3 className="mt-6 font-semibold text-emerald-900">Conditions for returns</h3>
            <ul className="mt-2 list-disc pl-5 space-y-2 text-[15px] leading-7 text-gray-700">
              <li>Items must be <strong>unused, unworn, unwashed</strong>, and in their original condition.</li>
              <li>All <strong>tags/labels</strong> and the original <strong>packaging</strong> must be included.</li>
              <li>
                Returns with <strong>stains</strong>, <strong>odours</strong> (e.g., perfume, smoke, sweat),
                signs of wear, or missing tags/packaging will not be accepted.
              </li>
            </ul>

            {/* Faulty / not as described */}
            <h3 className="mt-6 font-semibold text-emerald-900">Faulty / “Not as Described” items</h3>
            <p className="mt-2 text-[15px] leading-7 text-gray-700">
              If an item is faulty, damaged, or not as described, you are entitled to a <strong>full refund or replacement</strong>.
              We will cover the return postage for approved claims.
            </p>

            {/* Evidence requirement */}
            <div className="mt-4 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-800 mt-0.5" />
                <div className="text-[15px] leading-7 text-emerald-900/90">
                  <p className="font-semibold">Evidence required</p>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    <li>Clear photographic or video evidence of the fault/damage.</li>
                    <li>A brief description of the issue and when it was noticed.</li>
                  </ul>
                  <p className="mt-2 text-emerald-900/80">
                    If evidence is not provided, we may reject your claim. All returned items are inspected on arrival. If a claim is
                    determined to be false, we reserve the right to refuse a refund and return the item back to you.
                  </p>
                </div>
              </div>
            </div>

            {/* Exchanges */}
            <h3 className="mt-6 font-semibold text-emerald-900">Can I exchange for a different size?</h3>
            <ul className="mt-2 list-disc pl-5 space-y-2 text-[15px] leading-7 text-gray-700">
              <li>Yes—size exchanges are accepted if the item is unworn, unwashed, and in original condition.</li>
              <li>Customer must keep the <strong>proof of postage</strong> and <strong>tracking number</strong>.</li>
              <li>
                If a return goes missing in transit, we can only process a refund/exchange if tracking confirms it was sent.
                If tracking doesn’t show delivery to us, please contact the courier directly to resolve the issue.
              </li>
            </ul>

            {/* Non-returnable */}
            <h3 className="mt-6 font-semibold text-emerald-900">Non-returnable items</h3>
            <p className="mt-2 text-[15px] leading-7 text-gray-700">
              For hygiene and customisation reasons, <strong>made-to-measure</strong> items, <strong>final-sale</strong> items,
              and <strong>intimate apparel</strong> (where applicable) cannot be returned unless faulty.
            </p>

            {/* How to start a return */}
            <h3 className="mt-6 font-semibold text-emerald-900">How to start a return</h3>
            <ol className="mt-2 list-decimal pl-5 space-y-2 text-[15px] leading-7 text-gray-700">
              <li>Contact us within 5 days of delivery (WhatsApp or email) with your order ID and reason.</li>
              <li>Provide photos/video if the item is faulty or not as described.</li>
              <li>We’ll confirm approval and share the return address and instructions.</li>
              <li>Send the item back using a tracked service and keep proof of postage.</li>
            </ol>

            {/* Refund timeline */}
            <h3 className="mt-6 font-semibold text-emerald-900">Refund timeline</h3>
            <p className="mt-2 text-[15px] leading-7 text-gray-700">
              Approved refunds are processed within <strong>3–7 business days</strong> of receiving and inspecting the item,
              back to your original payment method or as store credit (as agreed).
            </p>

            {/* Rights note */}
            <div className="mt-6 rounded-xl bg-white ring-1 ring-gray-200 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-emerald-800 mt-0.5" />
                <p className="text-[15px] leading-7 text-gray-700">
                  This policy does not affect your statutory rights. For assistance, message us on WhatsApp or email our support team.
                </p>
              </div>
            </div>
          </div>

          {/* Contact / Address card */}
          <aside className="h-fit rounded-2xl bg-emerald-900 text-emerald-50 ring-1 ring-emerald-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Need help?</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                WhatsApp:{" "}
                <a href="https://wa.me/447733729418" className="underline hover:no-underline">
                  +44 7733 729 418
                </a>
              </p>
              <p>
                Email:{" "}
                <a href="mailto:Bukonla@beafrique.com" className="underline hover:no-underline">
                Bukonla@beafrique.com
                </a>
              </p>
            </div>

            <div className="mt-5 rounded-xl bg-white/10 ring-1 ring-emerald-800 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-200 font-semibold">
                Return address
              </p>
              <p className="mt-1 text-sm">
                24 Jubilee Road, Southsea<br />
                Portsmouth, PO40JE, United Kingdom
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="https://wa.me/447733729418?text=Hi%20Be%20Afrique%2C%20I%27d%20like%20to%20start%20a%20return.%20My%20order%20ID%20is%20____."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-yellow-500"
              >
                Start a return on WhatsApp →
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-50 hover:bg-emerald-800"
              >
                Contact support
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
