import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, Link } from "react-router-dom";

type BlogPost = {
  slug: string;
  title: string;
  author: string;
  excerpt?: string;
  content: string;
  category: string;
  featured_image_url?: string;
  created_at: any;
  tags?: string[];
  is_published: boolean;
};

export default function BlogPost() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const ref = doc(db, "blogs", slug);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("Blog post not found");
          setPost(null);
          setLoading(false);
          return;
        }

        const data = { slug: snap.id, ...(snap.data() as any) } as BlogPost;

        if (!data.is_published) {
          setError("This post is not published yet");
          setPost(null);
          setLoading(false);
          return;
        }

        setPost(data);
      } catch (e: any) {
        setError(e.message || "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <div className="container py-10">Loading…</div>;
  if (error) {
    return (
      <div className="container py-10">
        <div className="text-red-600 mb-4">{error}</div>
        <Link to="/blog" className="text-emerald-600 hover:underline">← Back to blog</Link>
      </div>
    );
  }
  if (!post) return <div className="container py-10">Post not found</div>;

  // Format content with paragraphs
  const paragraphs = post.content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-white border-b">
        <div className="container py-8 md:py-12">
          <Link to="/blog" className="text-emerald-600 hover:underline text-sm mb-4 inline-block">
            ← Back to blog
          </Link>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded font-medium">{post.category}</span>
            <span>•</span>
            <span>{post.created_at?.toDate ? post.created_at.toDate().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : ""}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-4xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-gray-600 mb-4 max-w-3xl">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-medium">{post.author}</span>
          </div>
        </div>
      </div>

      {/* Featured image */}
      {post.featured_image_url && (
        <div className="container py-8">
          <div className="aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container py-8 md:py-12">
        <article className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-emerald max-w-none">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-6">
                {para}
              </p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-12 pt-8 border-t">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              ← Back to all posts
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
