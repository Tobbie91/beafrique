import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import WhatWeDo from "./pages/WhatWeDo";
import Catalogue from "./pages/Catalogue";
import Client from "./pages/Client";
import OurTeam from "./pages/OurTeam";
import RefundPolicy from "./pages/RefundPolicy";
import ProductsTest from "./pages/Products";
import AdminGuard from "./components/AdminGuard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSignIn from "./pages/AdminSignIn";
import CartPage from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import FormerDesigns from "./pages/FormerDesigns";
import Book from "./pages/Resources";
import BookThankYou from "./pages/BookThankYou";
import AdminProducts from "./pages/AdminProducts";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminBlogs from "./pages/AdminBlogs";
import AdminAddBlog from "./pages/AdminAddBlog";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* public pages */}
        <Route path="/about" element={<About />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/what-we-do" element={<WhatWeDo />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/client" element={<Client />} />
        <Route path="/former-designs" element={<FormerDesigns />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/resources" element={<Book />} />
        <Route path="/book/thank-you" element={<BookThankYou />} />

        {/* Blog pages */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        <Route path="/admin/sign-in" element={<AdminSignIn />} />

        <Route
          path="/admin/products/new"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
        <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
        <Route path="/admin/products/edit/:slug" element={<AdminGuard><AdminDashboard /></AdminGuard>} />

        {/* Admin blog routes */}
        <Route path="/admin/blogs" element={<AdminGuard><AdminBlogs /></AdminGuard>} />
        <Route path="/admin/blogs/new" element={<AdminGuard><AdminAddBlog /></AdminGuard>} />
        <Route path="/admin/blogs/edit/:slug" element={<AdminGuard><AdminAddBlog /></AdminGuard>} />
        {/* product pages */}
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/products" element={<ProductsTest />} />
        {/* catch-all LAST */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancel" element={<CheckoutCancel />} />
      </Routes>
    </Layout>
  );
}
