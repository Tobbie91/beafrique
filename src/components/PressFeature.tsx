// src/components/PressFeature.tsx
import { Link } from "react-router-dom";

type Props = {
  image: string;
  source: string;      // e.g., "Vanguard"
  dateISO: string;     // e.g., "2025-08-01"
  readTime?: string;   // e.g., "2 min read"
  title: string;
  excerpt: string;
  articleUrl: string;
  secondaryHref?: string;
  secondaryText?: string;
};

export default function PressFeature({
  image,
  source,
  dateISO,
  readTime = "2 min read",
  title,
  excerpt,
  articleUrl,
  secondaryHref = "/about#mission-vision",
  secondaryText = "Our mission & vision",
}: Props) {
  return (
    <section className="py-14 relative isolate">
      {/* subtle background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:
        radial-gradient(600px_600px_at_0%_0%,rgba(250,204,21,0.08),transparent_60%),
        radial-gradient(800px_800px_at_100%_100%,rgba(16,185,129,0.08),transparent_60%)]" />

      <div className="container">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-emerald-800 px-3 py-1 text-xs font-semibold ring-1 ring-yellow-200">
            From the press
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-emerald-900">
            Featured News & Insights
          </h2>
          <div className="mt-2 h-1 w-16 bg-yellow-400 rounded mx-auto" />
        </div>

        {/* Feature card */}
        <article className="grid grid-cols-1 md:grid-cols-[minmax(260px,38%)_1fr] gap-5 items-stretch">
          {/* Image side */}
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-gray-200 shadow-sm">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
            {/* badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="rounded-full bg-yellow-400 text-emerald-900 text-xs font-bold px-3 py-1 ring-1 ring-yellow-300 shadow">
                Press
              </span>
              <span className="hidden sm:inline rounded-full bg-white/85 backdrop-blur px-3 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-white/60">
                {source}
              </span>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>

          {/* Content side */}
          <div className="rounded-3xl ring-1 ring-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="font-semibold text-emerald-900">{source}</span>
              <span aria-hidden>•</span>
              <time dateTime={dateISO}>
                {new Date(dateISO).toLocaleString(undefined, { month: "short", year: "numeric" })}
              </time>
              <span aria-hidden>•</span>
              <span>{readTime}</span>
            </div>

            <h3 className="mt-3 text-xl md:text-2xl font-semibold leading-snug text-emerald-900">
              {title}
            </h3>

            <p className="mt-3 text-[15px] md:text-base leading-relaxed text-gray-700">
              {excerpt}
            </p>

            <div className="mt-5 flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-3 text-center md:text-left">
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-emerald-900 hover:bg-yellow-500"
              >
                Read full article →
              </a>
              <Link
                to={secondaryHref}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-full border border-emerald-600 px-5 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                {secondaryText}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
