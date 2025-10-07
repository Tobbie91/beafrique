// src/components/Layout.tsx
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;        // absolute URL preferred
  canonicalPath?: string; // if omitted, current path is used
  ogType?: "website" | "article" | "product";
  robots?: string;
};

export default function Layout({
  children,
  seo = {},
}: {
  children: ReactNode;
  seo?: SEOProps;
}) {
  const {
    title = "Be Afrique — Sustainable, Culture-Forward Fashion",
    description = "Limited-quantity, sustainable pieces celebrating African culture and empowering artisans.",
    image = "https://beafrique.com/og-cover.jpg",
    canonicalPath,
    ogType = "website",
    robots = "index,follow",
  } = seo;

  // Base site URL (adjust to your production domain)
  const SITE = "https://beafrique.com";

  // Build canonical from current route if not provided
  const { pathname, search } = useLocation();
  const canonical = `${SITE}${canonicalPath ?? `${pathname}${search}`}`;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Helmet>
        {/* Basic */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={robots} />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="Be Afrique" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Favicons (optional; adjust paths) */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Optional: language/dir */}
        <html lang="en" />
      </Helmet>

      <Header />
      <main className="flex-1 pt-4">{children}</main>
      <Footer />
    </div>
  );
}
