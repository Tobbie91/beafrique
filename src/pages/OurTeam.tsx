import { Linkedin, Instagram, Mail } from "lucide-react";
import bukonlaImg from "../assets/images/6.webp";
import amakaImg   from "../assets/images/pic6.jpeg";
import tariImg    from "../assets/images/pic7.jpeg";
import osho    from "../assets/images/Oshopic.jpeg";
import { Link } from "react-router-dom";

type Member = {
  name: string;
  role: string;
  photo: string; // the imported image resolves to a string URL at build time
  bio?: string;
  socials?: { linkedin?: string; instagram?: string; email?: string };
};

const TEAM: Member[] = [
  {
    name: "Osho Ademola Joel",
    role: "Strategic Advisor & Team Lead",
    photo: osho,
    // bio: "Executive coach and strategic advisor to the brand.",
    // socials: {  email: "oshoademola1@gmail.com" },
  },
  {
    name: "Bukonla Sowale",
    role: "creative director",
    photo: bukonlaImg, // ← local asset
    // bio: "Sustainable design, heritage-led storytelling, women empowerment.",
    // socials: { linkedin: "#", instagram: "#", email: "hello@beafrique.com" },
  },
  {
    name: "Adeola Ayorimde",
    role: "production manager",
    photo: tariImg,
// ← local asset
    // bio: "Pattern cutting, low-waste techniques, quality assurance.",
    // socials: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Amaka Patrick",
    role: "social media manager",
    photo: amakaImg, 

  },
];
export default function OurTeam() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-emerald-900 text-emerald-50">
        <div className="container py-10 md:py-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-yellow-300">
              Our Team
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              People who stitch culture into every seam
            </h1>
            <p className="mt-3 text-sm md:text-base text-emerald-100/90">
              A small, mighty team crafting Purposeful Fashion rooted in African
              heritage and designed for the planet.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-14">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <article
                key={m.name}
                className="group overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={m.photo}
                    alt={`${m.name}, ${m.role}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-emerald-900 shadow">
                    Team
                  </span>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-emerald-900">
                    {m.name}
                  </h3>
                  <p className="text-sm font-medium text-emerald-700">
                    {m.role}
                  </p>
                  {m.bio && (
                    <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
                      {m.bio}
                    </p>
                  )}

                  {/* Socials */}
                  {(m.socials?.linkedin ||
                    m.socials?.instagram ||
                    m.socials?.email) && (
                    <div className="mt-4 flex items-center gap-2">
                      {m.socials.linkedin && (
                        <a
                          href={m.socials.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-gray-200 hover:bg-emerald-50"
                          aria-label={`${m.name} on LinkedIn`}
                        >
                          <Linkedin className="h-4 w-4 text-emerald-900" />
                        </a>
                      )}
                      {m.socials.instagram && (
                        <a
                          href={m.socials.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-gray-200 hover:bg-emerald-50"
                          aria-label={`${m.name} on Instagram`}
                        >
                          <Instagram className="h-4 w-4 text-emerald-900" />
                        </a>
                      )}
                      {m.socials.email && (
                        <a
                          href={`mailto:${m.socials.email}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-gray-200 hover:bg-emerald-50"
                          aria-label={`Email ${m.name}`}
                        >
                          <Mail className="h-4 w-4 text-emerald-900" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* CTA band */}
          <div className="mt-10 grid items-center gap-4 rounded-2xl bg-emerald-900 p-6 text-emerald-50 md:grid-cols-2">
            <div>
              <h4 className="text-lg md:text-xl font-bold">
                Want to collaborate or partner?
              </h4>
              <p className="mt-1 text-sm text-emerald-100/90">
                Press, partnerships, or mentorship, our team would love to hear
                from you.
              </p>
            </div>
            <div className="md:text-right">
  <Link
    to="/contact"
    className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-emerald-900 hover:bg-yellow-500"
    aria-label="Go to contact page"
  >
    Get in touch →
  </Link>
</div>
          </div>
        </div>
      </section>
    </div>
  );
}
