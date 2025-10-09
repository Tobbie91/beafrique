import Image from "../assets/images/buk12d.jpeg";

export default function About() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-emerald-900 text-emerald-50">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-yellow-300">
                About Be Afrique
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                Conscious fashion, rooted in heritage.
              </h1>
              <p className="mt-3 text-sm md:text-base text-emerald-100/90 max-w-xl">
                We create sustainable ready-to-wear that celebrates African identity, empowers women,
                and protects the planet, crafted in the spirit of culture and community.
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl ring-1 ring-emerald-800 shadow-sm">
                <img src={Image} alt="Be Afrique" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -top-3 -right-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-emerald-900 shadow">
                Since 2022
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section id="values" className="py-14">
        <div className="container">
          <div className="text-center">
            <p className="text-emerald-700 text-sm font-semibold">Our Core</p>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Values</h2>
            <div className="mt-2 h-1 w-16 bg-yellow-400 rounded mx-auto" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl ring-1 ring-gray-200 bg-white p-6 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-emerald-900 font-bold">♻️</div>
              <h3 className="mt-4 text-lg font-semibold text-emerald-900">Sustainability</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
                Ethical, eco-friendly practices at the core, so fashion feels good on you and the planet.
              </p>
            </div>

            <div className="rounded-2xl ring-1 ring-gray-200 bg-white p-6 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-emerald-900 font-bold">🪡</div>
              <h3 className="mt-4 text-lg font-semibold text-emerald-900">Craft & Heritage</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
                Designs that celebrate African identity, artistry, and stories stitched with intention.
              </p>
            </div>

            <div className="rounded-2xl ring-1 ring-gray-200 bg-white p-6 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-emerald-900 font-bold">🤝</div>
              <h3 className="mt-4 text-lg font-semibold text-emerald-900">Women Empowerment</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
                We support artisans, build communities, and foster economic independence for women.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION (NEW) */}
      <section id="mission-vision" className="py-14 bg-emerald-50">
        <div className="container">
          <div className="text-center">
            <p className="text-emerald-700 text-sm font-semibold">Why we exist</p>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Mission & Vision</h2>
            <div className="mt-2 h-1 w-16 bg-yellow-400 rounded mx-auto" />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Mission */}
            <article className="rounded-2xl ring-1 ring-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-yellow-300">
                🎯 Mission
              </div>
              <h3 className="mt-4 text-2xl font-bold text-emerald-900">Sustainable style, African pride.</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-yellow-100 text-emerald-900 px-3 py-1 text-[11px] font-semibold ring-1 ring-yellow-200">
                  “Sustainable style, African pride.”
                </span>
                <span className="inline-flex rounded-full bg-yellow-100 text-emerald-900 px-3 py-1 text-[11px] font-semibold ring-1 ring-yellow-200">
                  “Eco-friendly fashion, rooted in culture.”
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
                At BeAfrique, our mission is to craft eco-friendly and sustainable ready-to-wear designs that celebrate African
                heritage and identity. We promote cultural awareness with timeless pieces that inspire Africans in the diaspora
                to embrace their roots, while welcoming everyone who appreciates the beauty and artistry of African fashion.
                Our commitment is to people and the planet, ensuring every design uplifts culture, fosters pride, and supports
                a more sustainable future.
              </p>
            </article>

            {/* Vision */}
            <article className="rounded-2xl ring-1 ring-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-yellow-300">
                🌍 Vision
              </div>
              <h3 className="mt-4 text-2xl font-bold text-emerald-900">Bridging cultures through conscious fashion.</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-yellow-100 text-emerald-900 px-3 py-1 text-[11px] font-semibold ring-1 ring-yellow-200">
                  “Bridging cultures through conscious fashion.”
                </span>
                <span className="inline-flex rounded-full bg-yellow-100 text-emerald-900 px-3 py-1 text-[11px] font-semibold ring-1 ring-yellow-200">
                  “Where African heritage meets sustainable living.”
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
                Our vision is to become a leading global brand in sustainable African fashion bridging cultures, empowering
                communities, and setting new standards for ethical style. We aspire to a world where African inspired fashion is
                embraced universally not only as a statement of identity but as a movement toward conscious, responsible living.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-14">
        <div className="container grid gap-10 md:grid-cols-2 items-start">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Our Story</h2>
            <div className="mt-2 h-1 w-16 bg-yellow-400 rounded" />
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
              <p>
                Be Afrique was born from a love of African fashion and a passion for sustainability. We create eco-friendly,
                sustainable ready-to-wear designs that celebrate African heritage and identity, inviting the world to wear culture
                with pride while caring for the planet.
              </p>
              <p>
                Clothing is more than fabric; it’s a reflection of identity, culture, and values. Our journey began with a vision:
                to keep the diaspora connected to home while welcoming everyone to celebrate the artistry of African design. Every
                piece carries a story of tradition, pride, and belonging.
              </p>
              <p>
                Our mission goes beyond style. We protect people and planet by crafting with responsible materials and mindful
                production. Be Afrique is a movement to embrace identity, champion sustainability, and celebrate African culture
                everywhere.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/values"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-emerald-900 hover:bg-yellow-500"
              >
                Learn more about our values <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 shadow-sm">
                <img src={Image} alt="Our Values" className="w-full h-full object-cover" />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="py-10 bg-emerald-50">
        <div className="container">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Years in Business", value: "3+" },
              { label: "Women Empowered", value: "2,000+" },
              { label: "Reviews", value: "65+" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white ring-1 ring-gray-200 p-5 text-center">
                <p className="text-3xl font-bold text-emerald-900">{s.value}</p>
                <p className="text-xs font-semibold text-emerald-900/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-14 bg-emerald-900 text-emerald-50">
        <div className="container grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Join the movement—wear culture with pride.</h3>
            <p className="mt-2 text-sm md:text-base text-emerald-100/90">
              Explore our latest drops or learn how we’re empowering women and communities.
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
              href="/what-we-do#women"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200/40 px-6 py-3 text-sm font-semibold text-emerald-50 hover:bg-emerald-800"
            >
              Our Impact
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
