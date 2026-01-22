import { useEffect, useMemo, useRef, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary, type CloudUpload } from "../lib/cloud";
import { useParams } from "react-router-dom";

function toSlug(s: string) {
  return s.toLowerCase().trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function AdminAddBlog() {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Be Afrique Team");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] = useState<null | { id: string }>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  function resetForm() {
    setSlug("");
    setTitle("");
    setAuthor("Be Afrique Team");
    setExcerpt("");
    setContent("");
    setCategory("Fashion");
    setTags("");
    setIsPublished(false);
    setFeaturedImage(null);
    setExisting(null);
    setMsg(null);
    setError(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  const imagePreview = useMemo(() => (featuredImage ? URL.createObjectURL(featuredImage) : ""), [featuredImage]);

  const { slug: slugParam } = useParams();
  useEffect(() => {
    if (slugParam && slug !== slugParam) setSlug(slugParam);
  }, [slugParam]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!title) return;
    const auto = toSlug(title);
    if (!slug || slug === toSlug(slug)) setSlug(auto);
  }, [title]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const ref = doc(db, "blogs", slug);
      const snap = await getDoc(ref);
      if (cancelled) return;

      if (!snap.exists()) {
        setExisting(null);
        return;
      }

      const b = snap.data() as any;
      setExisting({ id: slug });

      setTitle(b.title || "");
      setAuthor(b.author || "Be Afrique Team");
      setExcerpt(b.excerpt || "");
      setContent(b.content || "");
      setCategory(b.category || "Fashion");
      setTags(b.tags?.join(", ") || "");
      setIsPublished(!!b.is_published);
    })();

    return () => { cancelled = true; };
  }, [slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setMsg(null);

    if (!slug) return setError("Please provide a slug.");
    if (!title) return setError("Please provide a title.");
    if (!existing && !featuredImage) return setError("Please choose a featured image.");

    try {
      setBusy(true);

      let existingDoc: any = null;
      if (existing) {
        const ref = doc(db, "blogs", slug);
        const snap = await getDoc(ref);
        if (snap.exists()) existingDoc = snap.data();
      }

      let imageUrl = existingDoc?.featured_image_url || "";
      let imagePublicId = existingDoc?.featured_image_public_id || "";
      if (featuredImage) {
        const upload: CloudUpload = await uploadToCloudinary(featuredImage, `blog/${slug}/featured`);
        imageUrl = upload.url;
        imagePublicId = upload.publicId;
      }

      const tagList = tags.split(/[,\n]+/).map(t => t.trim()).filter(Boolean);

      const payload: any = {
        slug,
        title,
        author,
        excerpt,
        content,
        category,
        tags: tagList,
        is_published: isPublished,
        featured_image_url: imageUrl,
        featured_image_public_id: imagePublicId,
        created_at: existing ? (existingDoc?.created_at || serverTimestamp()) : serverTimestamp(),
        updated_at: serverTimestamp(),
      };

      await setDoc(doc(db, "blogs", slug), payload);
      setMsg(existing ? "Updated blog post!" : "Created blog post!");
      setExisting({ id: slug });

      setFeaturedImage(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    } catch (e: any) {
      setError(e?.message || "Failed to save blog post");
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
            <p className="text-xs text-gray-500">Admin • Blog</p>
            <h1 className="text-lg md:text-xl font-semibold">
              {isEditing ? `Edit: ${existing?.id}` : "Add new blog post"}
            </h1>
          </div>

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
              onClick={(e) => (e.preventDefault(), (document.getElementById("blog-form") as HTMLFormElement)?.requestSubmit())}
              className={`px-4 py-2 rounded text-white ${busy ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {busy ? "Saving…" : isEditing ? "Update post" : "Save post"}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container py-6 grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main form */}
        <form id="blog-form" onSubmit={submit} className="space-y-6">
          {/* DETAILS */}
          <section className="rounded-2xl bg-white border shadow-sm">
            <div className="p-5 border-b">
              <h2 className="text-base md:text-lg font-semibold">Details</h2>
              <p className="text-xs text-gray-500 mt-1">Basic information about your blog post.</p>
            </div>
            <div className="p-5 grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Title</label>
                  <input
                    className="w-full h-10 border rounded px-3"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="5 African Fashion Trends for 2024"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm mb-1">Slug</label>
                    {isEditing && <span className="text-[11px] text-amber-700">Updating existing post</span>}
                  </div>
                  <input
                    className={`w-full h-10 border rounded px-3 ${isEditing ? "bg-amber-50 border-amber-300" : ""}`}
                    value={slug}
                    onChange={e => setSlug(toSlug(e.target.value))}
                    placeholder="african-fashion-trends-2024"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Author</label>
                  <input
                    className="w-full h-10 border rounded px-3"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    placeholder="Be Afrique Team"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select
                    className="w-full h-10 border rounded px-3"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Style Tips">Style Tips</option>
                    <option value="Culture">Culture</option>
                    <option value="Sustainability">Sustainability</option>
                    <option value="Behind the Scenes">Behind the Scenes</option>
                    <option value="News">News</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Excerpt (Short summary)</label>
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[70px]"
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="A brief summary that appears on the blog listing page..."
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Content (Main article)</label>
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[300px] font-mono text-sm"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your blog post content here. You can use line breaks for paragraphs..."
                />
                <p className="text-xs text-gray-500 mt-1">Supports line breaks. Keep paragraphs separated by blank lines.</p>
              </div>

              <div>
                <label className="block text-sm mb-1">Tags (comma-separated)</label>
                <input
                  className="w-full h-10 border rounded px-3"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="african fashion, ankara, sustainability"
                />
              </div>
            </div>
          </section>

          {/* FEATURED IMAGE */}
          <section className="rounded-2xl bg-white border shadow-sm">
            <div className="p-5 border-b">
              <h2 className="text-base md:text-lg font-semibold">Featured Image</h2>
              <p className="text-xs text-gray-500 mt-1">Main image for the blog post.</p>
            </div>
            <div className="p-5">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={e => setFeaturedImage(e.target.files?.[0] || null)}
              />
              {imagePreview && (
                <div className="mt-4 aspect-video max-w-md rounded overflow-hidden border bg-gray-50">
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </section>

          {/* PUBLISH STATUS */}
          <section className="rounded-2xl bg-white border shadow-sm">
            <div className="p-5">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium">Publish this post</div>
                  <div className="text-xs text-gray-500">Make it visible on the blog page</div>
                </div>
              </label>
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
            <div className="mt-3 aspect-video rounded border bg-gray-50 overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400 text-sm">No image</div>
              )}
            </div>
            <div className="mt-3 text-sm">
              <div className="font-medium line-clamp-2">{title || "Untitled post"}</div>
              <div className="text-gray-500 text-xs mt-1">{category} • {author}</div>
              {excerpt && (
                <div className="text-gray-600 text-xs mt-2 line-clamp-3">{excerpt}</div>
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
        </aside>
      </div>
    </div>
  );
}
