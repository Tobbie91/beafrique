
// components/AdminAddProduct.tsx
import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import {
  doc, getDoc, setDoc, serverTimestamp,
  updateDoc, deleteDoc
} from "firebase/firestore";
import { uploadToCloudinary, type CloudUpload } from "../lib/cloud";

type Gender = "women" | "men" | "unisex";

function toSlug(s: string) {
  return s.toLowerCase().trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
function parseList(input: string): string[] {
  return input.split(/[,|\n]+/g).map(s => s.trim()).filter(Boolean);
}
function makeUkSizeRange(start = 8, end = 20, step = 2): string[] {
  const out: string[] = [];
  for (let n = start; n <= end; n += step) out.push(String(n));
  return out;
}

export default function AdminAddProduct() {
  // core
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("Be-Afrique");
  const [collection, setCollection] = useState("Be-Afrique");
  const [gender, setGender] = useState<Gender>("unisex");
  const [description, setDescription] = useState("");

  // pricing (GBP)
  const [price, setPrice] = useState<number>(180); // £
  const [hasSale, setHasSale] = useState(false);
  const [compareAt, setCompareAt] = useState<number | "">("");

  // variants meta (UK sizes)
  const [sizesText, setSizesText] = useState(makeUkSizeRange(8, 20).join(", "));
  const [colorsText, setColorsText] = useState("Olive");

  // images
  const [main, setMain] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]); // ← array we can edit/remove

  // ux
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] = useState<null | { id: string }>(null);

  // previews
  const mainPreview = useMemo(() => (main ? URL.createObjectURL(main) : ""), [main]);
  const galleryPreviews = useMemo(() => gallery.map(f => URL.createObjectURL(f)), [gallery]);
  useEffect(() => {
    return () => {
      if (mainPreview) URL.revokeObjectURL(mainPreview);
      galleryPreviews.forEach(u => URL.revokeObjectURL(u));
    };
  }, [mainPreview, galleryPreviews]);

  // auto-slug
  useEffect(() => {
    if (!title) return;
    const auto = toSlug(title);
    if (!slug || slug === toSlug(slug)) setSlug(auto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // fetch existing (to toggle Update/Editing state)
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const ref = doc(db, "products", slug);
      const snap = await getDoc(ref);
      if (!cancelled) setExisting(snap.exists() ? { id: snap.id } : null);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const onPickGallery = (files: FileList | null) => {
    if (!files?.length) return;
    setGallery(prev => [...prev, ...Array.from(files)]);
  };
  const removeGalleryIndex = (idx: number) => {
    setGallery(prev => prev.filter((_, i) => i !== idx));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setMsg(null);

    if (!slug) return setError("Please provide a slug (e.g. linen-shirt-olive).");
    if (!title) return setError("Please provide a product title.");
    if (!main)  return setError("Please choose a main image.");
    if (hasSale && compareAt !== "" && Number(compareAt) <= Number(price)) {
      return setError("Compare-at must be greater than the main price when 'On sale' is checked.");
    }

    try {
      setBusy(true);

      // 1) Upload main (keep public_id for future server-side delete)
      const mainUp: CloudUpload = await uploadToCloudinary(main, `${slug}/main`);

      // 2) Upload gallery files (optional)
      let galleryUploads: CloudUpload[] = [];
      if (gallery.length) {
        galleryUploads = await Promise.all(
          gallery.map((f, i) => uploadToCloudinary(f, `${slug}/img-${i + 1}`))
        );
      }

      // 3) Build doc
      const sizes = parseList(sizesText);
      const colors = parseList(colorsText);
      const min_price_cents = Math.round(Number(price) * 100); // £ → pence
      const compare_at_cents = compareAt !== "" ? Math.round(Number(compareAt) * 100) : null;

      const payload: any = {
        slug,
        title,
        brand,
        collection,
        gender,
        description,
        min_price_cents,
        has_sale: !!hasSale,
        sizes,
        colors,
        primary_image_url: mainUp.url,
        primary_public_id: mainUp.publicId,           // optional but useful
        image_urls: galleryUploads.map(g => g.url),
        gallery_public_ids: galleryUploads.map(g => g.publicId),
        is_active: true,
        created_at: serverTimestamp(),
        currency: "GBP",
      };
      if (compare_at_cents && hasSale) payload.compare_at_cents = compare_at_cents;

      // 4) Save/Update
      await setDoc(doc(db, "products", slug), payload);
      setMsg(existing ? "Updated product!" : "Created product!");
      setExisting({ id: slug });

      // Reset light bits
      setMain(null);
      setGallery([]);
    } catch (e: any) {
      setError(e?.message || "Failed to save product");
    } finally {
      setBusy(false);
    }
  };

  // SOFT DELETE (hide from site)
  const softDelete = async () => {
    if (!slug) return;
    if (!confirm(`Hide "${slug}" from the catalogue?`)) return;
    try {
      setBusy(true); setMsg(null); setError(null);
      await updateDoc(doc(db, "products", slug), {
        is_active: false,
        deleted_at: serverTimestamp(),
      });
      setMsg("Product hidden (soft deleted).");
    } catch (e:any) {
      setError(e.message || "Soft delete failed");
    } finally { setBusy(false); }
  };

  // HARD DELETE (remove Firestore doc; images remain on Cloudinary)
  const hardDelete = async () => {
    if (!slug) return;
    if (!confirm(`Permanently delete "${slug}" document? Images on Cloudinary will remain.`)) return;
    try {
      setBusy(true); setMsg(null); setError(null);
      await deleteDoc(doc(db, "products", slug));
      setMsg("Product document deleted.");
      setExisting(null);
      // clear fields
      setTitle(""); setDescription(""); setMain(null); setGallery([]);
    } catch (e:any) {
      setError(e.message || "Hard delete failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen w-full flex items-start md:items-center justify-center bg-gray-50 py-10">
      <form onSubmit={submit} className="space-y-6 border p-6 md:p-8 rounded-2xl max-w-3xl w-full bg-white shadow-sm mx-4">
        <header className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Add / Edit Product</h2>
          {existing && <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">Editing: {existing.id}</span>}
        </header>

        {/* Identity */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input className="border px-3 py-2 w-full rounded" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Linen Shirt - Olive" />
          </div>
          <div>
            <label className="block text-sm mb-1">Slug</label>
            <input
              className={`border px-3 py-2 w-full rounded ${existing ? 'border-amber-400 bg-amber-50' : ''}`}
              value={slug}
              onChange={e=>setSlug(toSlug(e.target.value))}
              placeholder="linen-shirt-olive"
            />
            {existing && <p className="text-xs text-amber-700 mt-1">A product with this slug exists — saving will update it.</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Brand</label>
            <input className="border px-3 py-2 w-full rounded" value={brand} onChange={e=>setBrand(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Collection</label>
            <input className="border px-3 py-2 w-full rounded" value={collection} onChange={e=>setCollection(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Gender</label>
            <select className="border px-3 py-2 w-full rounded" value={gender} onChange={e=>setGender(e.target.value as Gender)}>
              <option value="women">women</option>
              <option value="men">men</option>
              <option value="unisex">unisex</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea className="border px-3 py-2 w-full rounded min-h-[80px]"
            value={description} onChange={e=>setDescription(e.target.value)}
            placeholder="Breathable premium linen" />
        </div>

        {/* Pricing (GBP) */}
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Price (£)</label>
            <input
              type="number" step="0.01"
              className="border px-3 py-2 w-full rounded"
              value={price}
              onChange={e=>setPrice(parseFloat(e.target.value || "0"))}
            />
            <p className="text-xs text-gray-500 mt-1">Saved as pence in <code>min_price_cents</code>.</p>
          </div>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={hasSale} onChange={e=>setHasSale(e.target.checked)} />
              On sale
            </label>
            <input
              type="number" step="0.01"
              className="border px-3 py-2 w-full rounded"
              placeholder="Compare-at (£)"
              disabled={!hasSale}
              value={compareAt}
              onChange={e=>setCompareAt(e.target.value === "" ? "" : parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Sizes & Colors */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm mb-1">Sizes (CSV or new lines)</label>
              <div className="flex gap-2">
                <button type="button" className="text-xs px-2 py-1 rounded border"
                        onClick={() => setSizesText(makeUkSizeRange(8, 20).join(", "))}>
                  Fill 8–20
                </button>
                <button type="button" className="text-xs px-2 py-1 rounded border"
                        onClick={() => setSizesText(makeUkSizeRange(8, 24).join(", "))}>
                  8–24
                </button>
              </div>
            </div>
            <textarea className="border px-3 py-2 w-full rounded"
                      value={sizesText} onChange={e=>setSizesText(e.target.value)}
                      placeholder="8, 10, 12, 14, 16, 18, 20" />
            <p className="text-xs text-gray-500 mt-1">UK sizes — defaults to 8 and above.</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Colors (CSV or new lines)</label>
            <textarea className="border px-3 py-2 w-full rounded"
                      value={colorsText} onChange={e=>setColorsText(e.target.value)}
                      placeholder="Olive, Black, Purple Ankara" />
          </div>
        </div>

        {/* Images */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2">Main image</label>
            <input type="file" accept="image/*" onChange={e=>setMain(e.target.files?.[0]||null)} />
            {mainPreview && (
              <div className="mt-2 aspect-[3/4] rounded overflow-hidden border bg-gray-50">
                <img src={mainPreview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-2">Gallery images (upload multiple)</label>
            <input multiple type="file" accept="image/*" onChange={e=>onPickGallery(e.target.files)} />
            {!!galleryPreviews.length && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {galleryPreviews.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded overflow-hidden border bg-gray-50">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-xs bg-white/90 rounded px-1"
                      onClick={() => removeGalleryIndex(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button disabled={busy} className="px-4 py-2 bg-emerald-600 text-white rounded">
            {busy ? "Saving…" : existing ? "Update Product" : "Add Product"}
          </button>

          {/* Soft delete */}
          {existing && (
            <button type="button" disabled={busy}
              onClick={softDelete}
              className="px-4 py-2 rounded border border-amber-500 text-amber-700">
              Hide (soft delete)
            </button>
          )}

          {/* Hard delete */}
          {existing && (
            <button type="button" disabled={busy}
              onClick={hardDelete}
              className="px-4 py-2 rounded border border-red-600 text-red-700">
              Delete (hard)
            </button>
          )}

          {msg && <span className="text-emerald-700 text-sm">{msg}</span>}
          {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>

        <p className="text-xs text-gray-500">
          Will save to: <code>products/{slug || "…"}</code>
        </p>
      </form>
    </div>
  );
}
