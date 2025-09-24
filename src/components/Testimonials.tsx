// components/Testimonials.tsx
import { Star, Quote } from "lucide-react";

type Review = { text: string; author: string };

const REVIEWS: Review[] = [
  { text: "I will order for more—let me lose a bit of weight first 😄", author: "Primrose" },
  { text: "My wife loves her outfit! Thanks for selling such good wears.", author: "Tolu" },
  { text: "A midwife loved my outfit today—shared your contact. All your outfits are beautiful.", author: "Tayo" },
  { text: "Beautiful and unique—well done, Be Afrique.", author: "Joshua" },
  { text: "I received my wears—so gorgeous. Even my husband loves it on me. God bless you.", author: "Oyinade" },
  { text: "Lovely designs—thank you!", author: "Yetunde" },
  { text: "I love the outfits; they fit so well.", author: "Blessing" },
  { text: "Someone at my interview took your contact—she loves my dress and wants to buy.", author: "Charity" },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-14 bg-white">
      <div className="container">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-emerald-800 px-3 py-1 text-xs font-semibold ring-1 ring-yellow-200">
            Loved by our customers
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-emerald-900">
            Kind words from the Be Afrique tribe
          </h2>
          <div className="mt-2 h-1 w-16 bg-yellow-400 rounded mx-auto" />
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, idx) => (
            <article
              key={idx}
              className="relative rounded-2xl ring-1 ring-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* Quote badge */}
              <div className="absolute -top-3 -right-3 rounded-full bg-yellow-400 p-2 ring-1 ring-yellow-300 shadow">
                <Quote className="h-4 w-4 text-emerald-900" />
              </div>

              {/* Stars (static 5) */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="sr-only">5 out of 5 stars</span>
              </div>

              {/* Text */}
              <p className="mt-3 text-[15px] leading-relaxed text-gray-700">“{r.text}”</p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-900 text-emerald-50 text-xs font-semibold ring-2 ring-emerald-100">
                  {initials(r.author)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">{r.author}</p>
                  <p className="text-xs text-gray-500">Verified customer</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Subtle CTA */}
        <div className="mt-10 text-center">
          <a
            href="https://wa.me/447733729418?text=Hi%2C%20I%27d%20love%20to%20share%20a%20review%20about%20my%20order."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-emerald-900 hover:bg-yellow-500"
          >
            Share your experience →
          </a>
        </div>
      </div>
    </section>
  );
}
