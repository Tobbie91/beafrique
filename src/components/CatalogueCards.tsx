import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import type { Product } from "../data/products";
import { BRAND } from "../config";

type Props = {
  items: Product[];
  getOutsideLink?: (p: Product) => string | undefined;
};

export default function CatalogueCards({ items, getOutsideLink }: Props) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {items.map((p) => {
        const outside = getOutsideLink?.(p);
        const waText = encodeURIComponent(
          `Hello ${BRAND.name}, I'm interested in ${p.name}.`
        );

        return (
          <article
            key={p.slug}
            className="rounded-2xl overflow-hidden bg-emerald-900 ring-1 ring-emerald-900 shadow-sm flex flex-col"
          >
            {/* Image */}
            <Link to={`/products/${p.slug}`} className="block">
              <img
                src={p.image}
                alt={p.name}
                className="w-full aspect-[4/5] object-cover"
              />
            </Link>

            {/* Title bar (same emerald, yellow accent) */}
         {/* Bottom panel (emerald all through) */}
<div className="p-5 text-emerald-50">
  {/* UK store CTA pill */}
  <a
    href={outside || "#"}
    target={outside ? "_blank" : undefined}
    rel={outside ? "noreferrer" : undefined}
    aria-disabled={!outside}
    className={`block rounded-full px-5 py-3 text-sm font-semibold transition text-emerald-900
      ${outside
        ? "bg-yellow-400 hover:bg-yellow-500"
        : "bg-emerald-800/60 text-emerald-300 cursor-not-allowed pointer-events-none"}
    `}
  >
    Buy from our UK store
  </a>

  {/* Optional tiny note under CTA */}
  <p className="mt-2 text-xs text-emerald-200">
    {/* Ships from Portsmouth, United Kingdom */}
  </p>

  {/* WhatsApp round button */}
  <div className="mt-4 flex justify-center">
    <a
      href={`https://wa.me/${BRAND.whatsapp}?text=${waText}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="h-12 w-12 grid place-items-center rounded-full bg-white text-emerald-900 shadow-sm hover:bg-yellow-400 transition"
    >
      <MessageCircle className="w-5 h-5" />
    </a>
  </div>
</div>

          </article>
        );
      })}
    </div>
  );
}
