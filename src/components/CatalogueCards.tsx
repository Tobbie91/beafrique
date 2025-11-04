
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { BRAND } from "../config";
import { MessageCircle } from "lucide-react";

type Props = {
  items: Product[];
  getOutsideLink?: (p: Product) => string | undefined;
};

export default function CatalogueCards({ items, getOutsideLink }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {items.map((p) => {
        const outside = getOutsideLink?.(p);
        const waText = encodeURIComponent(`Hello ${BRAND.name}, I'm interested in ${p.name}.`);

        return (
          <article
            key={p.slug}
            className="rounded-xl overflow-hidden bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md transition"
          >
            {/* Image */}
            <Link to={`/products/${p.slug}`} className="block">
              <img
                src={p.image}
                alt={p.name}
                className="w-full aspect-[3/4] object-cover"
                loading="lazy"
                decoding="async"
              />
            </Link>

            {/* Content — minimal, mostly white */}
            <div className="p-3 md:p-4">
              <h3 className="text-sm md:text-[15px] font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
                {p.name}
              </h3>

              <div className="mt-3 flex items-center gap-2">
                {outside ? (
                  <a
                    href={outside}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                  >
                    View in UK store
                  </a>
                ) : (
                  <Link
                    to={`/products/${p.slug}`}
                    className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold border border-gray-300 text-gray-800 hover:bg-gray-50 text-[8px] md:text-sm lg:text-sm"
                  >
                    View details
                  </Link>
                )}

                {/* Subtle WhatsApp icon-only on mobile; label on md+ */}
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=${waText}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Chat on WhatsApp"
                  className="ml-auto inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800"
                  title="Chat on WhatsApp"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <span className="hidden md:inline text-xs font-medium">Ask</span>
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
