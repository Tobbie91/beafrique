import {
  FaWhatsapp as FaWhatsappRaw,
  FaInstagram as FaInstagramRaw,
  FaTiktok as FaTiktokRaw,
  FaLinkedin as FaLinkedinRaw,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { BRAND } from "../config";
import logo from "../assets/images/logo.webp";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const FaWhatsapp  = FaWhatsappRaw  as unknown as React.ElementType;
  const FaInstagram = FaInstagramRaw as unknown as React.ElementType;
  const FaTiktok    = FaTiktokRaw    as unknown as React.ElementType;
  const FaLinkedin  = FaLinkedinRaw  as unknown as React.ElementType;
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to your backend / provider
    console.log("Submitted Email:", email);
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <footer className="mt-16 bg-emerald-900 text-emerald-50">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-yellow-400" />

      <div className="container py-12">
        {/* Top row: brand + newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="Be Afrique Logo" className="h-12 w-auto rounded-md ring-1 ring-white/10" />
            <div>
              <p className="text-xl font-bold tracking-tight">
                <span className="text-yellow-400">Be</span> Afrique Limited
              </p>
              <p className="mt-1 text-sm text-emerald-100/80">
                Conscious fashion. Empowering women. Celebrating African heritage.
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="rounded-2xl bg-emerald-800/40 ring-1 ring-white/10 p-3 sm:p-4">
            <p className="text-sm text-emerald-100/90">
              Sign up for news, drops, and events. We won’t spam.
            </p>
            <form onSubmit={handleEmailSubmit} className="mt-3 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email"
                  className="w-full rounded-full bg-white px-4 py-3 pr-28 text-sm text-emerald-900 outline-none ring-1 ring-emerald-200 focus:ring-2 focus:ring-yellow-300"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                >
                  Sign Up
                </button>
              </div>
              {submitted && (
                <span className="text-xs text-emerald-100/80">
                  Thanks—check your inbox to confirm.
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

        {/* Middle grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-yellow-300">About</h4>
            <p className="mt-3 text-sm leading-relaxed text-emerald-50/90">
              We are a purpose-driven fashion brand focused on environmental consciousness and social
              impact. We empower women with unique, expressive pieces—fostering independence and growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-yellow-300">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-yellow-300">Conscious Fashion</Link></li>
              <li><Link to="/women-empowerment" className="hover:text-yellow-300">Women Empowerment Programs</Link></li>
              <li><Link to="/mentorship-program" className="hover:text-yellow-300">Mentorship Program</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-300">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-yellow-300">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Phone: <a href="tel:+2348063328191" className="hover:text-yellow-300">+234 806 332 8191</a></li>
              <li>Email: <a href="mailto:service.info@dexy-creation.com" className="hover:text-yellow-300">service.info@dexy-creation.com</a></li>
              <li>Opening Hours: Mon–Sat (08:00–18:00), Sun Closed</li>
              <li>
                Nigeria: <span className="text-emerald-50/90">Lagos</span>
              </li>
              <li>
                UK:{" "}
                <a
                  className="hover:text-yellow-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.google.com/maps?q=24+Jubilee+Road,+Southsea,+Portsmouth,+United+Kingdom+PO40JE"
                >
                  24 Jubilee Road, Southsea, Portsmouth, PO40JE
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-yellow-300">Follow Us</h4>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://www.instagram.com/be_afrique_?igsh=MTR3amFjMHg0aGVheg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 hover:bg-yellow-400"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5 text-white group-hover:text-emerald-900" />
              </a>
              <a
                href="https://wa.me/447733729418"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 hover:bg-yellow-400"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-5 w-5 text-white group-hover:text-emerald-900" />
              </a>
              <a
                href="https://www.tiktok.com/@be_afrique"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 hover:bg-yellow-400"
                aria-label="TikTok"
              >
                <FaTiktok className="h-5 w-5 text-white group-hover:text-emerald-900" />
              </a>
              <a
                href="https://www.linkedin.com/company/be-afrique"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 hover:bg-yellow-400"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5 text-white group-hover:text-emerald-900" />
              </a>
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-4">
              <a
                href="https://wa.me/447733729418?text=Hi%20Be%20Afrique%2C%20I%27d%20love%20to%20chat%20about%20a%20custom%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-emerald-900 hover:bg-yellow-500"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container h-14 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-emerald-100/90">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-yellow-300">Privacy</Link>
            <span aria-hidden>•</span>
            <Link to="/terms" className="hover:text-yellow-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
