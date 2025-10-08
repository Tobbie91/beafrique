// src/pages/Contact.tsx
import { useState } from "react";
import { BRAND } from "../config";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErr(null);

    const fd = new FormData(e.currentTarget);

    // Good defaults for inbox context
    fd.set("_subject", `New inquiry from ${fd.get("firstName") || "Website"}`);
    // Formspree uses _replyto as the reply-to header
    if (fd.get("email")) fd.set("_replyto", String(fd.get("email")));

    try {
      const res = await fetch("https://formspree.io/f/mblrlpbd", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("err");
        setErr(
          (json?.errors && json.errors.map((x: any) => x.message).join(", ")) ||
            "Failed to send. Please try again."
        );
      }
    } catch (e: any) {
      setStatus("err");
      setErr(e?.message || "Network error. Please try again.");
    }
  }

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT: Contact info */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-center md:text-left text-gray-900">
            Get in Touch
          </h1>
          <p className="mt-2 text-gray-600 text-lg text-center md:text-left">
            We'd love to hear from you. Schedule a free consultation or drop us a message.
          </p>

          <ul className="mt-6 space-y-4 text-gray-700 text-lg">
            <li><strong>📞 Phone:</strong> {BRAND.phone}</li>
            <li><strong>📧 Email:</strong> {BRAND.email}</li>
            <li><strong>🏢 Address:</strong> {BRAND.address}</li>
          </ul>

          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 rounded-lg bg-green-600 text-white px-6 py-3 text-lg font-semibold hover:bg-green-700 transition"
          >
            Chat with Us on WhatsApp
          </a>
        </div>

        {/* RIGHT: Formspree form, styled to match your design */}
        <form onSubmit={onSubmit} className="p-8 rounded-2xl border bg-white shadow-xl space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Send Us a Message</h2>

          {/* Honeypot (anti-spam) */}
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid sm:grid-cols-2 gap-6">
            <input
              name="firstName"
              placeholder="First Name"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Your Email"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            name="phone"
            placeholder="Phone (optional)"
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            required
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg w-full h-40 focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <button
            disabled={status === "sending"}
            className={`w-full text-white py-3 text-lg font-semibold rounded-lg transition
              ${status === "sending" ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>

          {status === "ok" && (
            <p className="text-emerald-700 text-center">
              Thanks! We’ll get back to you shortly.
            </p>
          )}
          {status === "err" && <p className="text-red-600 text-center">{err}</p>}
        </form>
      </div>
    </div>
  );
}

