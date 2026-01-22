import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";

type BlogPost = {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  category: string;
  featured_image_url?: string;
  created_at: any;
  tags?: string[];
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const qref = query(
          collection(db, "blogs"),
          where("is_published", "==", true),
          orderBy("created_at", "desc")
        );
        const snap = await getDocs(qref);
        const data = snap.docs.map(d => ({ slug: d.id, ...(d.data() as any) })) as BlogPost[];
        setPosts(data);
      } catch (e: any) {
        setError(e.message || "Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="container py-10">Loading…</div>;
  if (error) return <div className="container py-10 text-red-600">Error: {error}</div>;
  if (!posts.length) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600">No blog posts yet. Check back soon!</p>
      </div>
    );
  }

  // Get unique categories
  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean)));

  // Filter posts by category
  const filteredPosts = selectedCategory === "all"
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
    <div className="container py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Blog</h1>
      <p className="text-gray-600 mb-8">Latest news, fashion tips, and stories from Be Afrique.</p>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Posts
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Blog posts grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Featured image */}
            <div className="aspect-video bg-gray-100 overflow-hidden">
              {post.featured_image_url ? (
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded">{post.category}</span>
                <span>•</span>
                <span>{post.created_at?.toDate ? post.created_at.toDate().toLocaleDateString() : ""}</span>
              </div>

              <h2 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{post.author}</span>
                <span className="text-emerald-600 font-medium group-hover:underline">Read more →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No posts in this category yet.
        </div>
      )}
    </div>
  );
}
