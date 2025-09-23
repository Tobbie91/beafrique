import { Link } from "react-router-dom";
import {
  Shirt,
  Ruler,
  Users,
  Scissors,
  Gem,
  GraduationCap,
  Leaf,
  Recycle,
  Sparkles,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { FaWhatsapp as FaWhatsappRaw } from "react-icons/fa";
import { BRAND } from "../config";

export default function WhatWeDo() {
  const FaWhatsapp = FaWhatsappRaw as unknown as React.FC<{ className?: string; size?: number }>;
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-emerald-900 text-emerald-50">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:
          radial-gradient(700px_700px_at_0%_0%,rgba(250,204,21,0.12),transparent_60%),
          radial-gradient(700px_700px_at_100%_100%,rgba(255,255,255,0.08),transparent_60%)]"
        />
        <div className="container py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-yellow-300">
              What we do
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              Conscious fashion services,crafted with care
            </h1>
            <p className="mt-3 text-sm md:text-base text-emerald-100/90">
              From ready-to-wear and bespoke fittings to corporate styling and education, we design
              beautiful pieces rooted in African heritage responsibly made for people and planet.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-emerald-900 hover:bg-yellow-500"
              >
                Shop catalogue
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200/40 px-6 py-3 text-sm font-semibold text-emerald-50 hover:bg-emerald-800"
              >
                Book a consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-14">
        <div className="container">
          <div className="text-center">
            <p className="text-emerald-700 text-sm font-semibold">What we offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Our Services</h2>
            <div className="mt-2 h-1 w-16 bg-yellow-400 rounded mx-auto" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Shirt className="w-5 h-5" />,
                title: "Ready-to-Wear",
                text: "Seasonal drops with timeless silhouettes, premium finishing, and versatile styling.",
                link: "/catalogue",
                cta: "View collection",
              },
              {
                icon: <Ruler className="w-5 h-5" />,
                title: "Bespoke & Fittings",
                text: "Made-to-measure pieces, studio fittings, and personalized adjustments for perfect fit.",
                link: "/contact",
                cta: "Start your fitting",
              },
              {
                icon: <Users className="w-5 h-5" />,
                title: "Corporate / Styling",
                text: "Capsule uniforms, shoots, and event styling for teams, productions, and campaigns.",
                link: "/contact",
                cta: "Enquire",
              },
              {
                icon: <Scissors className="w-5 h-5" />,
                title: "Alterations & Repairs",
                text: "Fine alterations, mends, and refreshes to extend the life of the garments you love.",
                link: "/contact",
                cta: "Request a repair",
              },
              {
                icon: <Gem className="w-5 h-5" />,
                title: "Bridal & Occasion",
                text: "Custom bridal and special-occasion looks that honor culture and elevate your moment.",
                link: "/contact",
                cta: "Design my look",
              },
              {
                icon: <GraduationCap className="w-5 h-5" />,
                title: "Workshops & Mentorship",
                text: "Hands-on learning for aspiring designers—skills, sustainability, and business basics.",
                link: "/about#mission-vision",
                cta: "Learn more",
              },
            ].map((s) => (
              <article
                key={s.title}
                className="rounded-2xl ring-1 ring-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-emerald-900 ring-1 ring-yellow-300">
                  {s.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-emerald-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-700">{s.text}</p>
                <div className="mt-4">
                  <Link
                    to={s.link}
                    className="inline-flex items-center gap-2 text-emerald-900 hover:underline text-sm font-semibold"
                  >
                    {s.cta} <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 bg-emerald-50">
        <div className="container">
          <div className="text-center">
            <p className="text-emerald-700 text-sm font-semibold">Simple & transparent</p>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">How it works</h2>
            <div className="mt-2 h-1 w-16 bg-yellow-400 rounded mx-auto" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-5">
            {[
              { icon: <Sparkles className="w-5 h-5" />, title: "Consult", text: "Share your vision, timeline, and budget." },
              { icon: <Ruler className="w-5 h-5" />, title: "Design", text: "We sketch, source, and confirm details." },
              { icon: <ShieldCheck className="w-5 h-5" />, title: "Fitting", text: "Measurements and try-ons for precision." },
              { icon: <Leaf className="w-5 h-5" />, title: "Make", text: "Mindful production with quality control." },
              { icon: <Truck className="w-5 h-5" />, title: "Deliver", text: "Pickup or shipping—track & enjoy." },
            ].map((step, i) => (
              <div key={step.title} className="rounded-2xl bg-white ring-1 ring-gray-200 p-5 text-center shadow-sm">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-emerald-900 ring-1 ring-yellow-300">
                  {step.icon}
                </div>
                <div className="mt-3 text-xs font-semibold text-emerald-700">Step {i + 1}</div>
                <h3 className="mt-1 text-emerald-900 font-semibold">{step.title}</h3>
                <p className="mt-1 text-xs text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUSTAINABILITY BAND */}
      <section className="py-12 bg-emerald-900 text-emerald-50">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Leaf className="w-5 h-5" />,
                title: "Ethical materials",
                text: "Responsible sourcing and skin-friendly fabrics.",
              },
              {
                icon: <Recycle className="w-5 h-5" />,
                title: "Low-waste patterns",
                text: "Smart cutting, repairs, and circular ideas.",
              },
              {
                icon: <ShieldCheck className="w-5 h-5" />,
                title: "Fair work",
                text: "Respect, training, and uplift for artisans.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl bg-white/5 ring-1 ring-emerald-800 p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-emerald-900 ring-1 ring-yellow-300">
                  {v.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-emerald-100/90">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-14 bg-white">
  <div className="container">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 text-center">FAQs</h2>
      <div className="mt-8 divide-y divide-emerald-100">
        {/* 1 */}
        <div className="py-6">
          <p className="font-semibold text-emerald-900">
            <span className="mr-2 select-none">–</span>
            Do we have a pick-up location?
          </p>
          <p className="mt-2 text-[15px] leading-7 text-gray-700">
            Yes. You can walk in to pick up your order and make payment at our UK studio:
            <br />
            <span className="font-medium text-emerald-900">
              24 Jubilee Road, Southsea, Portsmouth, PO40JE, United Kingdom
            </span>
            .
          </p>
        </div>

        {/* 2 */}
        <div className="py-6">
          <p className="font-semibold text-emerald-900">
            <span className="mr-2 select-none">–</span>
            How long does delivery take?
          </p>
          <p className="mt-2 text-[15px] leading-7 text-gray-700">
            UK orders typically arrive within <span className="font-medium">2–5 business days</span>.
            International delivery takes <span className="font-medium">7–10 business days</span>.
            You’ll receive tracking details once your order ships.
          </p>
        </div>

        {/* 3 */}
        <div className="py-6">
          <p className="font-semibold text-emerald-900">
            <span className="mr-2 select-none">–</span>
            What sizes do you offer?
          </p>
          <p className="mt-2 text-[15px] leading-7 text-gray-700">
            We offer sizes from <span className="font-medium">Small to 3XL</span>. Each product page includes
            a size guide to help you find your perfect fit.
          </p>
        </div>

        {/* 4 */}
        <div className="py-6">
          <p className="font-semibold text-emerald-900">
            <span className="mr-2 select-none">–</span>
            Are your outfits ready-made or custom?
          </p>
          <p className="mt-2 text-[15px] leading-7 text-gray-700">
            Most designs are <span className="font-medium">ready-to-wear</span>, but we also offer
            custom sizing for select pieces. If you’d like a custom fit, please contact us before placing an order.
          </p>
        </div>

        {/* 5 */}
        <div className="py-6">
          <p className="font-semibold text-emerald-900">
            <span className="mr-2 select-none">–</span>
            How do I care for my outfit?
          </p>
          <p className="mt-2 text-[15px] leading-7 text-gray-700">
            To maintain quality, we recommend <span className="font-medium">dry cleaning</span> or
            gentle hand washing with mild detergent. Always follow the care label on your garment.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Optional floating WhatsApp bubble (like the screenshot) */}
  {BRAND?.whatsapp && (
    <a
      href={`https://wa.me/${BRAND.whatsapp}?text=Hi%20there%2C%20I%20have%20a%20question%20about%20your%20products.`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg ring-1 ring-black/5"
    >
      <FaWhatsapp className="h-6 w-6 text-white" />
    </a>
  )}
</section>


      {/* CTA */}
      <section className="py-14 bg-gradient-to-b from-emerald-50/60 to-white">
        <div className="container grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-900">
              Ready to create something special?
            </h3>
            <p className="mt-2 text-sm md:text-base text-gray-700">
              Share your ideas and timeline—let’s design a piece that fits your story and your life.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-emerald-900 hover:bg-yellow-500"
            >
              Book a consultation
            </Link>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
            >
              Browse catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
