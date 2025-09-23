import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../store/cart'
import logo from '../assets/images/logo.webp'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  // cart totals for header badge
  const count = useCart(s => s.items.reduce((n, i) => n + i.qty, 0))
  const total = useCart(s => s.items.reduce((sum, i) => sum + i.price * i.qty, 0))

  const link = (isActive: boolean) =>
    `px-3 py-2 rounded-md transition hover:bg-brand/10 hover:text-brand ${isActive ? 'text-brand' : ''}`

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      {/* Top strip */}
      <div className="bg-emerald-900 text-white">
        <div className="container h-20 flex flex-col md:flex-row items-center justify-between text-sm space-y-4 md:space-y-0 md:h-16">
          {/* Contact info */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:gap-6">
            <div className="flex items-center gap-2">
              <span>📧</span>
              <a href="mailto:hello@beafrique.com" className="font-medium hover:underline">
                hello@beafrique.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <span className="font-medium">+44 7733 729 418</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏰</span>
              <span className="font-medium">Mon - Sat: 8:00 AM - 7:00 PM</span>
            </div>
          </div>

          {/* Shop Now */}
          <div className="flex justify-center md:justify-end">
            <Link
              to="/catalogue"
              className="inline-block bg-yellow-500 text-emerald-900 py-2 px-6 rounded-full font-semibold hover:bg-yellow-600"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="container h-20 flex items-center justify-between mt-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Be Afrique Limited Logo" className="h-15 w-[70px]" />
        </Link>

        {/* Desktop nav + cart */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={({ isActive }) => link(isActive)}>Home</NavLink>

          <div
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <NavLink to="/about" className={({ isActive }) => link(isActive)}>
              About Us
            </NavLink>
            {aboutOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-xl border bg-white shadow-soft p-2">
                <NavLink
                  to="/about#values"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg hover:bg-brand/10 ${isActive ? 'text-brand' : 'text-gray-700'}`
                  }
                >
                  Our Values
                </NavLink>
                <NavLink
                  to="/our-team"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg hover:bg-brand/10 ${isActive ? 'text-brand' : 'text-gray-700'}`
                  }
                >
                  Our Team
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/what-we-do" className={({ isActive }) => link(isActive)}>What We Do</NavLink>
          <NavLink to="/client" className={({ isActive }) => link(isActive)}>The Journey</NavLink>
          <NavLink to="/catalogue" className={({ isActive }) => link(isActive)}>Catalogue</NavLink>
          <NavLink to="/contact" className={({ isActive }) => link(isActive)}>Contact Us</NavLink>

          {/* Cart button */}
          <Link
            to="/checkout"
            aria-label="View cart"
            className="ml-2 relative inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-emerald-900 hover:bg-emerald-50"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden lg:inline text-sm font-medium">Cart</span>
            <span className="ml-1 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-emerald-900">
              {count}
            </span>
            {count > 0 && (
              <span className="hidden xl:inline text-xs text-gray-500">&nbsp;• {total.toLocaleString()}</span>
            )}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden w-10 h-10 grid place-content-center rounded-lg hover:bg-brand/10"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-3 flex flex-col">
            <NavLink to="/" end onClick={() => setOpen(false)} className={({ isActive }) => link(isActive)}>
              Home
            </NavLink>

            {/* About nested */}
            <details className="px-1 py-2">
              <summary className="cursor-pointer px-2 py-1 rounded-md hover:bg-brand/10">About Us</summary>
              <div className="mt-2 ml-3 flex flex-col">
                <NavLink to="/about#values" onClick={() => setOpen(false)} className={({ isActive }) => link(isActive)}>
                  Our Values
                </NavLink>
                <NavLink to="/about#team" onClick={() => setOpen(false)} className={({ isActive }) => link(isActive)}>
                  Our Team
                </NavLink>
              </div>
            </details>

            <NavLink to="/what-we-do" onClick={() => setOpen(false)} className={({ isActive }) => link(isActive)}>
              What We Do
            </NavLink>
            <NavLink to="/catalogue" onClick={() => setOpen(false)} className={({ isActive }) => link(isActive)}>
              Catalogue
            </NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)} className={({ isActive }) => link(isActive)}>
              Contact Us
            </NavLink>

            {/* Mobile cart link with count */}
            <Link
              to="/checkout"
              onClick={() => setOpen(false)}
              className="mt-2 px-3 py-2 rounded-md transition hover:bg-brand/10"
            >
              Cart <span className="ml-1 text-xs bg-yellow-400 text-emerald-900 px-2 py-0.5 rounded-full">{count}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
