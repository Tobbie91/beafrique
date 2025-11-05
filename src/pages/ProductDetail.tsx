// pages/ProductDetail.tsx
import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../store/cart";
import { startCheckout } from "../lib/checkout";

type Swatch = { id: string; name: string; hex: string };
type Variant = {
  sku: string;
  color_id: string;
  color_name: string;
  size: string;
  price_cents: number;
  stock: number;
  image_urls?: string[];
};
type Product = {
  slug: string;
  title: string;
  brand?: string;
  description?: string;
  primary_image_url?: string;
  image_urls?: string[];
  swatches?: Swatch[];
  colors?: string[];
  sizes?: string[];
  min_price_cents: number;
  currency?: string;
};

const NAMED_HEX: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  olive: "#556B2F",
  green: "#008000",
  red: "#cc0000",
  blue: "#1e40af",
  navy: "#001f3f",
  brown: "#6b4423",
  beige: "#f5f5dc",
  gold: "#d4af37",
  cream: "#f1eadb",
  purple: "#6b21a8",
};

function toHex(name?: string) {
  if (!name) return "#ddd";
  const key = name.trim().toLowerCase();
  return NAMED_HEX[key] || key;
}

function pickSpecs(desc?: string): string[] {
  if (!desc) return [];
  const parts = desc
    .split(/[•\-\n.;,]/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => s.length >= 3 && s.length <= 40);
  return parts.slice(0, 4);
}

export default function ProductDetail() {
  const [busy, setBusy] = useState(false);
  const { slug = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [hero, setHero] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const add = useCart((s) => s.add);

  const activeVariant = useMemo(
    () =>
      variants.find(
        (v) => (v.color_id ?? "") === (color ?? "") && v.size === size
      ),
    [variants, color, size]
  );

  const unitPrice =
    (activeVariant?.price_cents ?? product?.min_price_cents ?? 0) / 100;

  function handleAddToCart() {
    add({
      slug,
      qty: 1,
      size,
      color,
      title: product?.title,
      image: hero || product?.primary_image_url || product?.image_urls?.[0],
      price: unitPrice, // <-- IMPORTANT
      currency: (product?.currency || "GBP").toLowerCase(),
    });
  }

  function handleBuyNow() {
    // startCheckout({ items: [{ slug, qty: 1, size, color }] });
  }

  // load product + variants
  useEffect(() => {
    (async () => {
      setLoading(true);
      const pref = doc(db, "products", slug);
      const psnap = await getDoc(pref);
      if (!psnap.exists()) {
        setProduct(null);
        setLoading(false);
        return;
      }
      const p = psnap.data() as Product;
      setProduct(p);

      // variants are optional — your catalogue can be simple products
      const vsnap = await getDocs(
        query(
          collection(db, "products", slug, "variants"),
          orderBy("size", "asc")
        )
      );
      const v = vsnap.docs.map((d) => ({
        sku: d.id,
        ...(d.data() as any),
      })) as Variant[];
      setVariants(v);

      // defaults
      const firstColor =
        p.swatches?.[0]?.id || v[0]?.color_id || (p.colors?.[0] ?? null);
      setColor(firstColor);

      const firstSizeFromVariants =
        v.find((x) => (x.color_id ?? "") === firstColor)?.size ||
        v[0]?.size ||
        null;
      const firstSize = firstSizeFromVariants || (p.sizes?.[0] ?? null);
      setSize(firstSize);

      // hero image: prefer variant image → product primary → gallery[0]
      const firstVariantImg = v.find((x) => (x.color_id ?? "") === firstColor)
        ?.image_urls?.[0];
      setHero(
        firstVariantImg ?? p.primary_image_url ?? p.image_urls?.[0] ?? null
      );

      setLoading(false);
    })();
  }, [slug]);

  // available sizes for selected colour
  const sizesForColor = useMemo(() => {
    if (variants.length) {
      return Array.from(
        new Set(
          variants
            .filter((v) => (v.color_id ?? "") === (color ?? ""))
            .map((v) => v.size)
        )
      );
    }
    // no variants: fall back to product-level sizes
    return product?.sizes ?? [];
  }, [variants, color, product?.sizes]);

  // gallery
  const gallery = useMemo(() => {
    const vimgs =
      variants.find(
        (v) => (v.color_id ?? "") === (color ?? "") && v.size === size
      )?.image_urls ?? [];
    const base = product?.image_urls ?? [];
    const all = [
      hero || "",
      ...vimgs.filter((u) => u && u !== hero),
      ...base,
    ].filter(Boolean);
    // de-dupe, keep order
    return Array.from(new Map(all.map((u) => [u, true])).keys());
  }, [variants, color, size, hero, product?.image_urls]);

  // GBP by default
  const price = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: product?.currency || "GBP",
  }).format(
    (activeVariant?.price_cents ?? product?.min_price_cents ?? 0) / 100
  );

  // colour “dots” source = swatches OR fallback to colors[]
  const colorDots: { key: string; title: string; hex: string }[] =
    useMemo(() => {
      if (product?.swatches?.length) {
        return product.swatches.map((s) => ({
          key: s.id,
          title: s.name,
          hex: s.hex,
        }));
      }
      if (product?.colors?.length) {
        return product.colors.map((c) => ({ key: c, title: c, hex: toHex(c) }));
      }
      return [];
    }, [product?.swatches, product?.colors]);

  const specs = useMemo(
    () => pickSpecs(product?.description),
    [product?.description]
  );

  if (loading) return <div className="container py-16">Loading…</div>;
  if (!product) return <div className="container py-16">Not found</div>;

  return (
    <div className="container py-10 grid lg:grid-cols-2 gap-10">
      {/* Gallery */}
      <div>
        <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden">
          {hero ? (
            <img
              src={hero}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-400">
              Image
            </div>
          )}
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {gallery.map((url, i) => (
              <button
                key={i}
                onClick={() => setHero(url)}
                className={`aspect-square rounded overflow-hidden border ${
                  hero === url ? "ring-2 ring-emerald-600" : ""
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {product.brand && (
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {product.brand}
          </p>
        )}
        <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
        <div className="mt-2 text-emerald-700 text-xl font-semibold">
          {price}
        </div>

        {/* Colours */}
        {colorDots.length > 0 && (
          <div className="mt-5">
            <p className="text-sm text-gray-600 mb-2">Colour</p>
            <div className="flex gap-2">
              {colorDots.map((sw) => (
                <button
                  key={sw.key}
                  title={sw.title}
                  onClick={() => {
                    setColor(sw.key);
                    const firstSize =
                      variants.find((v) => (v.color_id ?? "") === sw.key)
                        ?.size ||
                      product?.sizes?.[0] ||
                      null;
                    setSize(firstSize);
                    const firstImg = variants.find(
                      (v) => (v.color_id ?? "") === sw.key
                    )?.image_urls?.[0];
                    setHero(firstImg || product?.primary_image_url || null);
                  }}
                  className={`h-8 w-8 rounded-full border ring-2 ${
                    color === sw.key ? "ring-emerald-600" : "ring-transparent"
                  }`}
                  style={{ background: sw.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizesForColor.length > 0 && (
          <div className="mt-5">
            <p className="text-sm text-gray-600 mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizesForColor.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    size === s
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Full description */}
        {product.description && (
          <div className="mt-6 prose prose-sm max-w-none">
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await startCheckout({
                  items: [
                    {
                      slug,
                      qty: 1,
                      // size,
                      // color,
                      amount: Math.round(unitPrice * 100),
                      currency: (product?.currency || "GBP").toLowerCase(),
                    },
                  ],
                });
              } finally {
                setBusy(false);
              }
            }}
            className={`px-4 py-2 rounded text-white ${
              busy
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {busy ? "Redirecting…" : "Buy now"}
          </button>
          <Link
            to="/cart"
            onClick={handleAddToCart}
            className="px-4 py-2 rounded border"
          >
            Add to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
