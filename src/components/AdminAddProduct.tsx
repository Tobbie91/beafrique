
import { useEffect, useMemo, useRef, useState } from "react";
import { db } from "../lib/firebase";
import {
  doc, getDoc, setDoc, serverTimestamp,
} from "firebase/firestore";
import { uploadToCloudinary, type CloudUpload } from "../lib/cloud";
import { useParams } from "react-router-dom";

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
  const [price, setPrice] = useState<number>(180); // £
  const [hasSale, setHasSale] = useState(false);
  const [compareAt, setCompareAt] = useState<number | "">("");
  const [sizesText, setSizesText] = useState(makeUkSizeRange(8, 20).join(", "));
  const [colorsText, setColorsText] = useState("Olive");
  const [main, setMain] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]); 
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] = useState<null | { id: string }>(null);

// file inputs need refs so we can clear the actual <input> value
const mainInputRef = useRef<HTMLInputElement|null>(null);
const galleryInputRef = useRef<HTMLInputElement|null>(null);

function resetForm() {
  // core
  setSlug("");
  setTitle("");
  setBrand("Be-Afrique");
  setCollection("Be-Afrique");
  setGender("unisex");
  setDescription("");
  setPrice(180);
  setHasSale(false);
  setCompareAt("");
  setSizesText(makeUkSizeRange(8, 20).join(", "));
  setColorsText("Olive");

  // images
  setMain(null);
  setGallery([]);

  // UX
  setExisting(null);
  setMsg(null);
  setError(null);

  // Clear file input elements so they can pick the same file again
  if (mainInputRef.current) mainInputRef.current.value = "";
  if (galleryInputRef.current) galleryInputRef.current.value = "";
}


  const mainPreview = useMemo(() => (main ? URL.createObjectURL(main) : ""), [main]);
  const galleryPreviews = useMemo(() => gallery.map(f => URL.createObjectURL(f)), [gallery]);

  const { slug: slugParam } = useParams();
useEffect(() => {
  if (slugParam && slug !== slugParam) setSlug(slugParam);
}, [slugParam]);

  useEffect(() => {
    return () => {
      if (mainPreview) URL.revokeObjectURL(mainPreview);
      galleryPreviews.forEach(u => URL.revokeObjectURL(u));
    };
  }, [mainPreview, galleryPreviews]);

  useEffect(() => {
    if (!title) return;
    const auto = toSlug(title);
    if (!slug || slug === toSlug(slug)) setSlug(auto);
  }, [title]);


  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const ref = doc(db, "products", slug);
      const snap = await getDoc(ref);
      if (cancelled) return;
  
      if (!snap.exists()) {
        setExisting(null);
        return;
      }
  
      const p = snap.data() as any;
      setExisting({ id: slug });
  
      // Prefill fields
      setTitle(p.title || "");
      setBrand(p.brand || "Be-Afrique");
      setCollection(p.collection || "Be-Afrique");
      setDescription(p.description || "");
      setColorsText((p.colors || []).join(", "));
      setSizesText((p.sizes || []).join(", "));
      setPrice(typeof p.min_price_cents === "number" ? p.min_price_cents / 100 : 180);
      setHasSale(!!p.has_sale);
      if (typeof p.compare_at_cents === "number") setCompareAt(p.compare_at_cents / 100);
   
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
    if (!existing && !main) return setError("Please choose a main image.");
    if (hasSale && compareAt !== "" && Number(compareAt) <= Number(price)) {
      return setError("Compare-at must be greater than the main price when 'On sale' is checked.");
    }

    try {
      setBusy(true);

// @ts-ignore
      const mainUp: CloudUpload = await uploadToCloudinary(main, `${slug}/main`);
      let galleryUploads: CloudUpload[] = [];
      if (gallery.length) {
        galleryUploads = await Promise.all(
          gallery.map((f, i) => uploadToCloudinary(f, `${slug}/img-${i + 1}`))
        );
      }

      const sizes = parseList(sizesText);
      const colors = parseList(colorsText);
      const min_price_cents = Math.round(Number(price) * 100); // £ → pence
      const compare_at_cents = compareAt !== "" ? Math.round(Number(compareAt) * 100) : null;

let existingDoc: any = null;
if (existing) {
  const ref = doc(db, "products", slug);
  const snap = await getDoc(ref);
  if (snap.exists()) existingDoc = snap.data();
}


let mainUrl = existingDoc?.primary_image_url || "";
let mainPublicId = existingDoc?.primary_public_id || "";
if (main) {
  const mainUp: CloudUpload = await uploadToCloudinary(main, `${slug}/main`);
  mainUrl = mainUp.url;
  mainPublicId = mainUp.publicId;
}


let imageUrls: string[] = existingDoc?.image_urls || [];
let galleryPublicIds: string[] = existingDoc?.gallery_public_ids || [];
if (gallery.length) {
  const ups = await Promise.all(gallery.map((f, i) => uploadToCloudinary(f, `${slug}/img-${(imageUrls.length) + i + 1}`)));
  imageUrls = [...imageUrls, ...ups.map(u => u.url)];
  galleryPublicIds = [...galleryPublicIds, ...ups.map(u => u.publicId)];
}



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
  primary_image_url: mainUrl,
  primary_public_id: mainPublicId,
  image_urls: imageUrls,
  gallery_public_ids: galleryPublicIds,
  is_active: existing ? (existingDoc?.is_active ?? true) : true,
  created_at: existing ? (existingDoc?.created_at || serverTimestamp()) : serverTimestamp(),
  currency: "GBP",
};
if (compare_at_cents && hasSale) payload.compare_at_cents = compare_at_cents;

      await setDoc(doc(db, "products", slug), payload);
      setMsg(existing ? "Updated product!" : "Created product!");
      setExisting({ id: slug });

      setMain(null);
      setGallery([]);
      if (mainInputRef.current) mainInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    } catch (e: any) {
      setError(e?.message || "Failed to save product");
    } finally {
      setBusy(false);
    }
  };


  const isEditing = !!existing;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="border-b bg-white">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <p className="text-xs text-gray-500">Admin • Products</p>
            <h1 className="text-lg md:text-xl font-semibold">
              {isEditing ? `Edit: ${existing?.id}` : "Add new product"}
            </h1>
          </div>

          {/* Actions (desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={resetForm}
              className="px-4 py-2 rounded border bg-white hover:bg-gray-50"
            >
              Clear form
            </button>
            <button
              disabled={busy}
              onClick={(e) => (e.preventDefault(), (document.getElementById("product-form") as HTMLFormElement)?.requestSubmit())}
              className={`px-4 py-2 rounded text-white ${busy ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {busy ? "Saving…" : isEditing ? "Update product" : "Save product"}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container py-6 grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main form */}
        <form id="product-form" onSubmit={submit} className="space-y-6">
          {/* DETAILS */}
          <section className="rounded-2xl bg-white border shadow-sm">
            <div className="p-5 border-b">
              <h2 className="text-base md:text-lg font-semibold">Details</h2>
              <p className="text-xs text-gray-500 mt-1">Basic information customers will see.</p>
            </div>
            <div className="p-5 grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Title</label>
                  <input
                    className="w-full h-10 border rounded px-3"
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
                    placeholder="Linen Shirt – Olive"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm mb-1">Slug</label>
                    {isEditing && <span className="text-[11px] text-amber-700">Updating existing product</span>}
                  </div>
                  <input
                    className={`w-full h-10 border rounded px-3 ${isEditing ? "bg-amber-50 border-amber-300" : ""}`}
                    value={slug}
                    onChange={e=>setSlug(toSlug(e.target.value))}
                    placeholder="linen-shirt-olive"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Brand</label>
                  <input className="w-full h-10 border rounded px-3" value={brand} onChange={e=>setBrand(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Collection</label>
                  <input className="w-full h-10 border rounded px-3" value={collection} onChange={e=>setCollection(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Gender</label>
                  <select className="w-full h-10 border rounded px-3" value={gender} onChange={e=>setGender(e.target.value as Gender)}>
                    <option value="women">women</option>
                    <option value="men">men</option>
                    <option value="unisex">unisex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[90px]"
                  value={description}
                  onChange={e=>setDescription(e.target.value)}
                  placeholder="Breathable premium linen…"
                />
                <p className="text-xs text-gray-500 mt-1">Keep it short and benefit-focused.</p>
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section className="rounded-2xl bg-white border shadow-sm">
            <div className="p-5 border-b">
              <h2 className="text-base md:text-lg font-semibold">Pricing</h2>
              <p className="text-xs text-gray-500 mt-1">GBP only (saved as pence).</p>
            </div>
            <div className="p-5 grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Price (£)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full h-10 border rounded px-3"
                  value={price}
                  onChange={e=>setPrice(parseFloat(e.target.value || "0"))}
                />
              </div>
              <div className="md:col-span-2 grid grid-cols-[auto_1fr] items-end gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={hasSale} onChange={e=>setHasSale(e.target.checked)} />
                  On sale
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="h-10 border rounded px-3"
                  placeholder="Compare-at (£)"
                  disabled={!hasSale}
                  value={compareAt}
                  onChange={e=>setCompareAt(e.target.value === "" ? "" : parseFloat(e.target.value))}
                />
              </div>
            </div>
          </section>

          {/* OPTIONS */}
          <section className="rounded-2xl bg-white border shadow-sm">
            <div className="p-5 border-b">
              <h2 className="text-base md:text-lg font-semibold">Options</h2>
              <p className="text-xs text-gray-500 mt-1">Sizes and colors customers can pick.</p>
            </div>
            <div className="p-5 grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm mb-1">Sizes</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-[11px] px-2 py-1 rounded border bg-white hover:bg-gray-50"
                      onClick={() => setSizesText(makeUkSizeRange(8, 20).join(", "))}
                    >
                      Fill 8–20
                    </button>
                    <button
                      type="button"
                      className="text-[11px] px-2 py-1 rounded border bg-white hover:bg-gray-50"
                      onClick={() => setSizesText(makeUkSizeRange(8, 24).join(", "))}
                    >
                      8–24
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[70px]"
                  value={sizesText}
                  onChange={e=>setSizesText(e.target.value)}
                  placeholder="8, 10, 12, 14, 16, 18, 20"
                />
                <p className="text-xs text-gray-500 mt-1">CSV or new lines.</p>
              </div>
              <div>
                <label className="block text-sm mb-1">Colors</label>
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[70px]"
                  value={colorsText}
                  onChange={e=>setColorsText(e.target.value)}
                  placeholder="Olive, Black, Purple Ankara"
                />
                <p className="text-xs text-gray-500 mt-1">CSV or new lines.</p>
              </div>
            </div>
          </section>

          {/* IMAGES */}
          <section className="rounded-2xl bg-white border shadow-sm">
            <div className="p-5 border-b">
              <h2 className="text-base md:text-lg font-semibold">Images</h2>
              <p className="text-xs text-gray-500 mt-1">Main image is required for new products.</p>
            </div>
            <div className="p-5 grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">Main image</label>
                <input
                  ref={mainInputRef}
                  type="file"
                  accept="image/*"
                  onChange={e=>setMain(e.target.files?.[0]||null)}
                />
                {mainPreview && (
                  <div className="mt-2 aspect-[3/4] rounded overflow-hidden border bg-gray-50">
                    <img src={mainPreview} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm mb-2">Gallery images (multiple)</label>
                <input
                  ref={galleryInputRef}
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={e=>onPickGallery(e.target.files)}
                />
                {!!galleryPreviews.length && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {galleryPreviews.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded overflow-hidden border bg-gray-50">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-1 right-1 text-xs bg-white/90 rounded px-1"
                          onClick={() => removeGalleryIndex(i)}
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Mobile actions */}
          <div className="sm:hidden sticky bottom-0 bg-white border-t p-3 flex items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={resetForm}
              className="flex-1 px-4 py-2 rounded border"
            >
              Clear
            </button>
            <button
              disabled={busy}
              className={`flex-1 px-4 py-2 rounded text-white ${busy ? "bg-emerald-400" : "bg-emerald-600"}`}
            >
              {busy ? "Saving…" : isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>

        {/* Summary / side panel */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-white border shadow-sm p-5">
            <h3 className="text-sm font-semibold">Quick preview</h3>
            <div className="mt-3 aspect-[3/4] rounded border bg-gray-50 overflow-hidden">
              {mainPreview ? (
                <img src={mainPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400 text-sm">No image</div>
              )}
            </div>
            <div className="mt-3 text-sm">
              <div className="font-medium">{title || "Untitled product"}</div>
              <div className="text-gray-500">{collection || "—"} • {brand || "—"}</div>
              <div className="mt-1 font-semibold">£{Number(price || 0).toFixed(2)}</div>
              {hasSale && compareAt !== "" && (
                <div className="text-xs text-emerald-700">
                  On sale • Compare-at £{Number(compareAt).toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {(msg || error) && (
            <div className={`rounded-2xl border p-4 ${error ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
              <p className={`text-sm ${error ? "text-red-700" : "text-emerald-800"}`}>
                {error || msg}
              </p>
            </div>
          )}

          {/* Desktop actions */}
          <div className="hidden sm:flex flex-col gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={resetForm}
              className="px-4 py-2 rounded border bg-white hover:bg-gray-50"
            >
              Clear form
            </button>
            <button
              disabled={busy}
              onClick={(e) => (e.preventDefault(), (document.getElementById("product-form") as HTMLFormElement)?.requestSubmit())}
              className={`px-4 py-2 rounded text-white ${busy ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {busy ? "Saving…" : isEditing ? "Update product" : "Save product"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}