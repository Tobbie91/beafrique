import { Link } from "react-router-dom";
import { Check, ChevronRight, Star } from "lucide-react";

const BOOK_COVER =
  "https://res.cloudinary.com/dbl85m2kz/image/upload/v1761099321/gzlzsbsstwvfbe0nqydf.jpg";
const BOOK_LINK = "https://buy.stripe.com/fZucN6c1gfbQdxp61r4gg01";
const BOOK_PRICE = "£20";

export default function Book() {
  return (
    <div className="">
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="container py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <p className="text-emerald-700 font-semibold uppercase tracking-wide text-sm">
              E‑book by Bukola Sowale
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
              Make Massive Income Sewing from Home
            </h1>
            <p className="mt-4 text-gray-700 max-w-prose">
              Practical, step‑by‑step guidance to professionalize your sewing
              craft, attract premium clients, and grow a sustainable business
              from home.
            </p>
            <p className="mt-4 text-2xl font-bold text-emerald-700">
              {BOOK_PRICE}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={BOOK_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 text-white px-6 py-3 font-semibold shadow hover:bg-emerald-800 transition"
              >
                Get the Book <ChevronRight className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-semibold text-emerald-800 border-emerald-200 hover:bg-emerald-50"
              >
                Ask a question
              </Link>
            </div>

            <div className="mt-5 flex items-center gap-3 text-sm text-gray-600">
              <div className="flex -space-x-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span>Readers love this practical guide</span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative max-w-md mx-auto">
              <img
                src={BOOK_COVER}
                alt="Make Massive Income Sewing from Home — Book Cover"
                className="w-full rounded-2xl shadow-2xl ring-1 ring-emerald-100"
              />
              <div className="absolute -z-10 inset-0 blur-3xl opacity-30 bg-emerald-300/40 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="container py-12">
        <h2 className="text-xl md:text-2xl font-bold">What you'll learn</h2>
        <ul className="mt-5 grid md:grid-cols-2 gap-3">
          {[
            "Pricing your work with confidence",
            "Simple branding that attracts the right clients",
            "How to package offers and upsell ethically",
            "Client communication scripts that save time",
            "Smart workflow for fittings and delivery",
            "Turning happy clients into repeat business",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-600 mt-0.5" />
              <span className="text-gray-800">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA band */}
      <section className="py-10 bg-emerald-900">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-emerald-100 font-semibold">Start today</p>
            <h3 className="text-white text-2xl font-bold">
              Turn your sewing skills into reliable income
            </h3>
            <p className="text-yellow-300 text-lg font-semibold mt-1">Only {BOOK_PRICE}</p>
          </div>
          <a
            href={BOOK_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-yellow-300 text-emerald-900 px-6 py-3 font-semibold shadow hover:bg-yellow-400 transition whitespace-nowrap"
          >
            Get the Book — {BOOK_PRICE} <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* FAQ placeholder */}
      <section className="container py-12">
        <h2 className="text-xl md:text-2xl font-bold">FAQs</h2>
        <div className="mt-4 grid gap-4">
          <details className="rounded-xl border p-4">
            <summary className="cursor-pointer font-medium">
              Is it a PDF or printed book?
            </summary>
            <p className="mt-2 text-gray-700">
              It's a downloadable PDF you can read on any device. You’ll receive
              the link immediately after purchase.
            </p>
          </details>
          <details className="rounded-xl border p-4">
            <summary className="cursor-pointer font-medium">
              Can beginners benefit?
            </summary>
            <p className="mt-2 text-gray-700">
              Absolutely. The steps are practical for beginners and still
              valuable for experienced tailors who want to earn more.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// src/components/FeaturedBook.tsx
// A compact section for the Home page that links to the full Book page.

export function FeaturedBook() {
  return (
    <section className="py-12 bg-emerald-50/60">
      <div className="container grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-emerald-700 font-semibold uppercase tracking-wide text-xs">
            {" "}
            E‑book
          </p>
          <h3 className="text-2xl font-bold mt-1">
            Make Massive Income Sewing from Home
          </h3>
          <p className="text-gray-700 mt-3">
            Learn proven steps to professionalize your sewing craft and build
            consistent income from home.
          </p>
          <p className="mt-2 text-xl font-bold text-emerald-700">{BOOK_PRICE}</p>
          <div className="mt-5 flex gap-3">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 text-white px-5 py-3 font-semibold hover:bg-emerald-800"
            >
              Read more <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href={BOOK_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 font-semibold text-emerald-900 border-emerald-200 hover:bg-emerald-100"
            >
              Get the Book
            </a>
          </div>
        </div>
        <img
          src={BOOK_COVER}
          alt="Make Massive Income Sewing from Home — Book Cover"
          className="w-full max-w-sm rounded-2xl shadow-xl ring-1 ring-emerald-100 mx-auto"
        />
      </div>
    </section>
  );
}
