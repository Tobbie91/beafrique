import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import WhatWeDo from './pages/WhatWeDo'
import Catalogue from './pages/Catalogue'
import Client from './pages/Client'
import OurTeam from './pages/OurTeam'
import AdminNewProduct from './pages/AdminNewProduct'
import RefundPolicy from './pages/RefundPolicy'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* New structure */}
        <Route path="/about" element={<About />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/what-we-do" element={<WhatWeDo />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/client" element={<Client />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/admin/products/new" element={<AdminNewProduct />} />
        {/* Keep PDP and legacy aliases working */}
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/products" element={<Navigate to="/catalogue" replace />} />

        {/* Optional: keep checkout if you still want it available */}
        <Route path="/checkout" element={<Checkout />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
