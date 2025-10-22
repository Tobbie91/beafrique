import { BRAND } from "../config";
import brandOwnerImage2 from "../assets/images/6.webp";
import brandOwnerImage from "../assets/images/6.webp";

export default function BrandOwnerPage() {
  const brandName = BRAND?.name || "Be Afrique";
  const whatsapp = BRAND?.whatsapp || "447733729418";

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-emerald-900 text-emerald-50">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 items-center ">
            <div className="lg:mt-[-5em] mt-[2em]">
              <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-yellow-300">
                Founder Story
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                From grassroots tailoring to a global movement
              </h1>
              <p className="mt-3 text-sm md:text-base text-emerald-100/90 max-w-xl">
                Bukonla’s journey from Unilorin to the UK, shapes {brandName}: a sustainable fashion
                house celebrating African identity, empowering women, and designing for the planet.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${whatsapp}?text=Hello%20${encodeURIComponent(
                    brandName
                  )}%2C%20I%27d%20love%20to%20learn%20more%20about%20your%20story.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-emerald-900 hover:bg-yellow-500"
                >
                  Chat on WhatsApp
                </a>
                <a
                  href="/catalogue"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200/40 px-6 py-3 text-sm font-semibold text-emerald-50 hover:bg-emerald-800"
                >
                  Explore the collection
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl ring-1 ring-emerald-800 shadow-sm">
                <img
                  src={brandOwnerImage}
                  alt="Bukonla, founder of Be Afrique"
                  className=" w-full object-cover"
                />
              </div>
              <div className="absolute -top-3 -right-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-emerald-900 shadow">
                Based in the UK
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-14">
        <div className="container">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "🪡",
                title: "Craft & Heritage",
                text:
                  "Rooted in African identity and artisanal traditions pieces that carry stories of home and pride.",
              },
              {
                icon: "♻️",
                title: "Sustainability",
                text:
                  "Eco friendly materials, mindful production, and circular ideas style that cares for people and planet.",
              },
              {
                icon: "🤝",
                title: "Empowerment",
                text:
                  "A movement for women and communities skills, dignity, and opportunity stitched into every seam.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="rounded-2xl ring-1 ring-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-emerald-900 font-bold">
                  {v.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-emerald-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-14 bg-emerald-50">
        <div className="container">
          <div className="text-center">
            <p className="text-emerald-700 text-sm font-semibold">Milestones</p>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">
              The Journey
            </h2>
            <div className="mt-2 h-1 w-16 bg-yellow-400 rounded mx-auto" />
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <ol className="relative border-l border-emerald-200 pl-6 space-y-8">
              <li>
                <div className="absolute -left-2 top-1 h-4 w-4 rounded-full bg-yellow-400 ring-2 ring-white" />
                <h3 className="text-emerald-900 font-semibold">2013 — Unilorin</h3>
                <p className="mt-1 text-[15px] text-gray-700">
                  Early roots in tailoring; the spark for fashion as identity and purpose.
                </p>
              </li>
              <li>
                <div className="absolute -left-2 top-[92px] h-4 w-4 rounded-full bg-yellow-400 ring-2 ring-white" />
                <h3 className="text-emerald-900 font-semibold">
                  Training — Silk & Purple, Datina Designs
                </h3>
                <p className="mt-1 text-[15px] text-gray-700">
                  Refined craft at two of Nigeria’s respected fashion houses.
                </p>
              </li>
              <li>
                <div className="absolute -left-2 top-[184px] h-4 w-4 rounded-full bg-yellow-400 ring-2 ring-white" />
                <h3 className="text-emerald-900 font-semibold">2019 — Le Soughtout</h3>
                <p className="mt-1 text-[15px] text-gray-700">
                  First registered business; “Mummy & Daughter” line celebrates bonds and sustainability.
                </p>
              </li>
            </ol>

            <ol className="relative border-l border-emerald-200 pl-6 space-y-8">
              <li>
                <div className="absolute -left-2 top-1 h-4 w-4 rounded-full bg-yellow-400 ring-2 ring-white" />
                <h3 className="text-emerald-900 font-semibold">2020 — Author</h3>
                <p className="mt-1 text-[15px] text-gray-700">
                  <em>Make Massive Income Sewing from Home</em>: empowering creative entrepreneurship.
                </p>
              </li>
              <li>
                <div className="absolute -left-2 top-[92px] h-4 w-4 rounded-full bg-yellow-400 ring-2 ring-white" />
                <h3 className="text-emerald-900 font-semibold">2021 — Recognition</h3>
                <p className="mt-1 text-[15px] text-gray-700">
                  Brand Award: Most Promising SME of the Year.
                </p>
              </li>
              <li>
                <div className="absolute -left-2 top-[184px] h-4 w-4 rounded-full bg-yellow-400 ring-2 ring-white" />
                <h3 className="text-emerald-900 font-semibold">2022–2025 — UK</h3>
                <p className="mt-1 text-[15px] text-gray-700">
                  University of Portsmouth (MSc); thesis on tech & sustainability. 2025: {brandName} launches in the UK.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* STORY + IMAGE */}
      <section className="py-14">
        <div className="container grid gap-10 md:grid-cols-2 items-start">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">
              The Vision Behind the Label
            </h2>
            <div className="mt-2 h-1 w-16 bg-yellow-400 rounded" />
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
              <p>
                {brandName} creates sustainable ready-to-wear that celebrates African heritage and identity.
                We invite the world to wear culture with pride, while respecting the earth we share.
              </p>
              <p>
                Clothing is more than fabric; it’s memory, meaning, and belonging. Our designs
                reflect stories of tradition and community, made with eco friendly materials and mindful production.
              </p>
              <p>
                Innovation meets culture in unexpected ways like upcycling <strong>snail shells</strong> into
                textural details, turning waste into beauty and narrative.
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 shadow-sm">
                <img
                  src={brandOwnerImage2}
                  alt="Founder portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-10">
        <div className="container">
          <blockquote className="relative overflow-hidden rounded-2xl bg-emerald-900 p-8 text-emerald-50 ring-1 ring-emerald-800">
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-yellow-400/20 blur-2xl" />
            <p className="text-lg md:text-xl leading-relaxed">
              “Fashion can be beautiful and responsible. Our work bridges continents—honoring African
              heritage while designing a more sustainable future.”
            </p>
            <footer className="mt-4 text-sm text-emerald-100/80">— Bukonla, Founder</footer>
          </blockquote>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="py-10 bg-emerald-50">
        <div className="container">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Years in Craft", value: "10+" },
              { label: "Women Empowered", value: "2,000+" },
              { label: "Collections & Reviews", value: "65+" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white ring-1 ring-gray-200 p-5 text-center"
              >
                <p className="text-3xl font-bold text-emerald-900">{s.value}</p>
                <p className="text-xs font-semibold text-emerald-900/70 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-14 bg-emerald-900 text-emerald-50">
        <div className="container grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Join the movement, wear culture with pride.</h3>
            <p className="mt-2 text-sm md:text-base text-emerald-100/90">
              Explore new drops, read our values, or partner with us on sustainable initiatives.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-emerald-900 hover:bg-yellow-500"
            >
              Shop Catalogue
            </a>
            <a
              href="/about#mission-vision"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200/40 px-6 py-3 text-sm font-semibold text-emerald-50 hover:bg-emerald-800"
            >
              Mission & Vision
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
