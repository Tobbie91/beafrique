import { Link } from "react-router-dom";
import useActiveProducts from "../hooks/useActiveProducts";
import CatalogueCards from "./CatalogueCards";

type CardItem = { slug: string; name: string; image: string };

export default function HomeCatalogueTeaser() {
  const { items, loading, error } = useActiveProducts(6);

  if (loading) return <div className="container py-10">Loading catalogue…</div>;
  if (error) return <div className="container py-10 text-red-600">{error}</div>;
  if (!items.length) return null;

  const cards: CardItem[] = items.map(p => ({
    slug: p.slug,
    name: p.title,
    image: p.primary_image_url || "",
  }));

  const getOutsideLink = (p: CardItem) =>
    items.find(x => x.slug === p.slug)?.uk_url || undefined;

  return (
    <section className="py-14">
      <div className="container">
        <div className="text-center">
          {/* <p className="text-emerald-700 text-sm font-semibold tracking-wide">
            Designed by women for women
          </p> */}
          <h2 className="text-3xl md:text-4xl font-bold mt-1 text-emerald-900">
            New & Popular
          </h2>
          <div className="w-16 h-1 bg-yellow-400 rounded mx-auto mt-3" />
        </div>

        <div className="mt-8">
          {/* @ts-ignore reusing your component shape */}
          <CatalogueCards items={cards} getOutsideLink={getOutsideLink} />
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-emerald-900 px-6 py-3 text-sm font-semibold"
          >
            View all products <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
