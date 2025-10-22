// src/components/MagazineFeature.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { toDirectImageUrl } from "../lib/imageUrl";


type MagazineImage = { src: string; alt?: string };
type Props = {
  publication: string;            // e.g. "Vanguard Magazine"
  dateISO: string;                // e.g. "2025-08-01"
  title: string;                  // headline to show
  blurb?: string;                 // short description
  articleUrl?: string;            // external link to article/pdf
  images: MagazineImage[];        // array of Drive or Cloudinary URLs
};

export default function MagazineFeature({
  publication,
  dateISO,
  title,
  blurb,
  articleUrl,
  images,
}: Props) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const prettyDate = useMemo(
    () => new Date(dateISO).toLocaleString(undefined, { month: "short", year: "numeric" }),
    [dateISO]
  );

  const normalized = images.map(i => ({ ...i, src: toDirectImageUrl(i.src) }));

  const prev = () => setIdx((i) => (i - 1 + normalized.length) % normalized.length);
  const next = () => setIdx((i) => (i + 1) % normalized.length);

  return (
    <section className="py-14 relative isolate">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:
        radial-gradient(600px_600px_at_0%_0%,rgba(250,204,21,0.08),transparent_60%),
        radial-gradient(800px_800px_at_100%_100%,rgba(16,185,129,0.08),transparent_60%)]" />

      <div className="container">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-emerald-800 px-3 py-1 text-xs font-semibold ring-1 ring-yellow-200">
            Press Feature
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-emerald-900">{title}</h2>
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-emerald-900">{publication}</span>
            <span className="mx-2">•</span>
            <time dateTime={dateISO}>{prettyDate}</time>
          </div>
          {blurb && <p className="mt-3 max-w-2xl mx-auto text-gray-700">{blurb}</p>}
          {articleUrl && (
            <div className="mt-4">
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-emerald-900 hover:bg-yellow-500"
              >
                Read full article <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Grid: always 3 per row on large */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {normalized.map((img, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setOpen(true); }}
              className="group relative overflow-hidden rounded-2xl ring-1 ring-gray-200 bg-white shadow-sm"
            >
              <img
                src={img.src}
                alt={img.alt || title}
                loading="lazy"
                className="w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                style={{ aspectRatio: "4/5" }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
            // @ts-ignore
              src={normalized[idx].src}
                    // @ts-ignore
              alt={normalized[idx].alt || title}
              className="w-full rounded-2xl shadow-2xl"
            />
            {/* Controls */}
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 text-emerald-900 p-2 shadow"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 text-emerald-900 p-2 shadow"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 bg-white text-emerald-900 rounded-full px-3 py-1 text-sm shadow"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
