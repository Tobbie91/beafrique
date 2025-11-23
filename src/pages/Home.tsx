import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, Leaf, ShieldCheck, Truck } from "lucide-react";
import FocusCarousel from "../components/FocusCarousel";
import AboutUsImage from "../assets/images/buk4.webp"; 
import slideImage1 from "../assets/images/buk1.webp";
import slideImage2 from "../assets/images/buk2.webp";
import slideImage3 from "../assets/images/buk4.webp";
import Testimonials from "../components/Testimonials";
import HomeCatalogueTeaser from "../components/HomeCatalogueTeaser";
import FeaturedRow from "../components/FeaturedRow";
import MagazineFeature from "../components/MagazineFeature";


export default function Home() {

  type Slide = {
    image: string;
    title: string;
    text: string;
    cta: { label: string; href: string };
  };
  
  const slides: Slide[] = useMemo(
    () => [
      { image: slideImage1, title: "Wear Your Confidence, Crafted by Women.", text: "Embrace the elegance of African-inspired ready to wear fashion...", cta: { label: "Shop New Arrivals", href: "/catalogue" } },
      { image: slideImage2, title: "Elegance in Every Stitch, Sustainability in Every Thread.", text: "Our clothes are not just made, they are created with passion...", cta: { label: "Explore Our Catalogue", href: "/catalogue" } },
      { image: slideImage3, title: "Empowering Women, One Garment at a Time.", text: "Be part of a movement that supports artisans...", cta: { label: "Learn About Us", href: "/about" } },
    ],
    []
  );
  
  const [i, setI] = useState(0);
  
  if (!slides.length) return null;
  
  const safeIdx = ((i % slides.length) + slides.length) % slides.length;
  
  const current = slides[safeIdx] ?? slides[0]!;
  
  const go = (dir: -1 | 1) => setI(n => n + dir);
  
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length]);



  // Reusable tokens
  const container = "container";
  const card = "bg-white rounded-2xl ring-1 ring-gray-200 shadow-sm";
  const kicker = "inline-flex items-center gap-2 rounded-full bg-yellow-100 text-emerald-800 px-3 py-1 text-xs font-semibold ring-1 ring-yellow-200";
  const btnPrimary = "rounded-full bg-emerald-900 hover:bg-emerald-700 text-white px-6 py-3 text-sm font-semibold";
  const btnSecondary = "rounded-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-6 py-3 text-sm font-semibold";

  return (
    <div className="bg-white text-gray-900">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        {/* subtle background accents */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:
          radial-gradient(600px_600px_at_0%_0%,rgba(250,204,21,0.10),transparent_60%),
          radial-gradient(700px_700px_at_100%_100%,rgba(16,185,129,0.10),transparent_60%)]" />

        <div className={`${container} py-10 md:py-14`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:min-h-[58vh]">
            {/* Left */}
            <div>
              <span className={kicker}>
                <Sparkles className="w-3 h-3" /> Be Afrique Limited
              </span>

              <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight tracking-tight text-emerald-900">
                {current.title}
              </h1>

              <p className="mt-4 text-[15px] md:text-base text-gray-600 max-w-xl">
                {current.text}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={current.cta.href} className={btnPrimary}>
                  {current.cta.label}
                </Link>
                <Link to="/catalogue" className={btnSecondary}>
                  Our Catalogue
                </Link>
              </div>

              {/* Dots + Arrows */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setI(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === i ? "w-6 bg-emerald-900" : "w-2 bg-emerald-200"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous slide"
                    className="rounded-full ring-1 ring-gray-200/80 bg-white/70 backdrop-blur px-2 py-2 hover:bg-white"
                  >
                    <ArrowLeft className="w-5 h-5 text-emerald-900" />
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next slide"
                    className="rounded-full ring-1 ring-gray-200/80 bg-white/70 backdrop-blur px-2 py-2 hover:bg-white"
                  >
                    <ArrowRight className="w-5 h-5 text-emerald-900" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right (image) */}
            <div className="relative md:h-[460px]">
              <div className="pointer-events-none absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-yellow-300/30 blur-2xl" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />

              <div className="relative w-full h-full overflow-hidden rounded-3xl ring-1 ring-gray-200 shadow-sm">
                <img src={current.image} alt={current.title} className="h-full w-full object-cover" />

                <div className="hidden md:flex absolute bottom-4 left-4 gap-2">
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous slide"
                    className="rounded-full bg-white/70 backdrop-blur ring-1 ring-white/30 p-2 hover:bg-white"
                  >
                    <ArrowLeft className="w-5 h-5 text-emerald-900" />
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next slide"
                    className="rounded-full bg-white/70 backdrop-blur ring-1 ring-white/30 p-2 hover:bg-white"
                  >
                    <ArrowRight className="w-5 h-5 text-emerald-900" />
                  </button>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 bg-yellow-400 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                New Drop
              </div>
            </div>
          </div>
          <HomeCatalogueTeaser />
          {/* Trust row */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`${card} flex items-center gap-3 p-3`}>
              <Leaf className="h-5 w-5 text-emerald-800" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">Ethical & Sustainable</p>
                <p className="text-xs text-gray-600">Conscious materials & low-waste practices</p>
              </div>
            </div>
            <div className={`${card} flex items-center gap-3 p-3`}>
              <ShieldCheck className="h-5 w-5 text-emerald-800" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">Premium Finishing</p>
                <p className="text-xs text-gray-600">Crafted by expert women artisans</p>
              </div>
            </div>
            <div className={`${card} flex items-center gap-3 p-3`}>
              <Truck className="h-5 w-5 text-emerald-800" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">UK Store & Support</p>
                <p className="text-xs text-gray-600">Ships from Portsmouth, United Kingdom</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus carousel (kept) */}
      <FocusCarousel />

     
      {/* About */}
      <section className="py-14">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold leading-tight mb-4 text-emerald-900">About Be Afrique Limited</h2>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              Be Afrique is a sustainable African fashion brand born from a love of culture and a passion for the planet.
              We create eco-friendly ready-to-wear that celebrates heritage, empowers women, and inspires pride in identity.
            </p>
            <p className="text-base md:text-lg text-gray-600">
            We merge responsible methods with cutting-edge ideas to strengthen sustainability and equip women with skills that open doors to employment.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                // { label: "Years in Business", value: "3" },
                { label: "Reviews", value: "25" },
                { label: "Women Empowered", value: "100" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-800">{s.value}</p>
                  <p className="text-xs font-semibold text-emerald-900/70 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/about"
                className="inline-block rounded-full bg-yellow-400 text-emerald-900 font-semibold hover:bg-yellow-500 px-6 py-3"
              >
                Read More →
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <img
              src={AboutUsImage}
              alt="About Be Afrique"
              className="w-full h-auto object-cover rounded-2xl ring-1 ring-gray-200 shadow-sm"
            />
          </div>
        </div>
      </section>

<FeaturedRow />
<MagazineFeature
        publication="Fashion Beauty"
        dateISO="2025-10"
        title="Be Afrique pieces featured in leading magazine"
        blurb="A beautiful editorial featuring Be Afrique garments, celebrating heritage and contemporary silhouettes."
        articleUrl="https://drive.google.com/uc?export=download&id=1DqPoMywiA6vYf3gaI0qgVxhBGDXYe_WD"
        images={[
          { src: "https://res.cloudinary.com/dbl85m2kz/image/upload/v1761102279/pd1ps4udpl2lneiveifi.png", alt: "Cover" },
          { src: "https://res.cloudinary.com/dbl85m2kz/image/upload/v1761102232/pwtxw5brdovdjpvtkz5i.png" },
          { src: "https://res.cloudinary.com/dbl85m2kz/image/upload/v1761102255/ohzcjsfjvrmfc3dj7qov.png" },
        ]}
      />

<Testimonials />

      {/* Contact / Consult */}
      <section className="py-14 bg-gradient-to-b from-emerald-50/60 to-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form card */}
            <div className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-sm p-6 md:p-8">
              <div className="mb-6">
                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold">
                  Free 30-min call
                </span>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-emerald-900">
                  Schedule Consultation
                </h2>
                <p className="mt-1.5 text-sm text-gray-600">
                  Tell us a bit about your project and preferred time—our team will follow up ASAP.
                </p>
              </div>

              {/* Form (unchanged structure, styled) */}
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input id="fullName" type="text" placeholder="Your full name"
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input id="phone" type="tel" placeholder="e.g. +44 7733 729 418"
                      className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input id="email" type="email" placeholder="you@example.com"
                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" required />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company (Optional)</label>
                  <input id="company" type="text" placeholder="Business name"
                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" rows={4} placeholder="Briefly describe your needs, timeline, and budget band…"
                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200" />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button type="submit"
                    className="inline-flex justify-center items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                    Submit Now
                  </button>
                  <a
                    href="https://wa.me/447733729418?text=Hi%20there%2C%20I%27d%20like%20to%20schedule%20a%20consultation."
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex justify-center items-center gap-2 rounded-full border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    Chat on WhatsApp
                  </a>
                  <div className="flex-1 text-xs text-gray-500 sm:text-right">Average response time &lt; 2 hours</div>
                </div>
              </form>
            </div>

            {/* Info card */}
            <div className="flex flex-col gap-6">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 p-6 text-emerald-50 shadow-sm">
                <div className="absolute inset-0 opacity-20 [background:radial-gradient(120px_120px_at_20%_10%,white_0,transparent_60%),radial-gradient(160px_160px_at_80%_80%,white_0,transparent_60%)]" />
                <div className="relative">
                  <h3 className="text-lg font-semibold">Contact Details</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">📞</span>
                      <div>
                        <div className="font-medium">Phone</div>
                        <a href="tel:+447733729418" className="text-emerald-100 hover:underline">+44 7733 729 418</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">✉️</span>
                      <div>
                        <div className="font-medium">Email</div>
                        <a href="mailto:Bukonla@beafrique.com" className="text-emerald-100 hover:underline">
                        Bukonla@beafrique.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">🕓</span>
                      <div>
                        <div className="font-medium">Opening Hours</div>
                        <div className="text-emerald-100">Mon–Sat (08:00–21:00), Sun Closed</div>
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">📍</span>
                      <div>
                        <div className="font-medium">Address</div>
                        <a
                          href="https://www.google.com/maps?q=24+Jubilee+Road,+Southsea,+Portsmouth,+United+Kingdom+PO40JE"
                          target="_blank" rel="noopener noreferrer"
                          className="text-emerald-100 hover:underline"
                        >
                          24 Jubilee Road, Southsea<br />Portsmouth, United Kingdom PO40JE
                        </a>
                      </div>
                    </div> */}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                      <div className="font-semibold">Coverage</div>
                      <div className="text-emerald-100">UK & Nigeria</div>
                    </div>
                    <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
                      <div className="font-semibold">Support</div>
                      <div className="text-emerald-100">Phone, Email, WhatsApp</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white shadow-sm">
                <div className="aspect-[16/10] bg-[url('https://maps.gstatic.com/tactile/pane/default_geocode-2x.png')] bg-center bg-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Our Service Area</div>
                      <div className="text-xs text-gray-500">Fast response in major cities</div>
                    </div>
                    <a
                      href="https://wa.me/447733729418?text=Hi%2C%20please%20call%20me%20back%20about%20a%20consultation."
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-yellow-500"
                    >
                      Request a callback
                    </a>
                  </div>
                </div>
              </div>
            </div>{/* /info column */}
          </div>
        </div>
      </section>
    </div>
  );
}
