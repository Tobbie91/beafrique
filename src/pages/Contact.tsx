import { BRAND } from '../config'

export default function Contact() {
  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information Section */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-center md:text-left text-gray-900">
            Get in Touch
          </h1>
          <p className="mt-2 text-gray-600 text-lg text-center md:text-left">
            We'd love to hear from you. Schedule a free consultation or drop us a message.
          </p>

          {/* Contact Info List */}
          <ul className="mt-6 space-y-4 text-gray-700 text-lg">
            <li><strong>📞 Phone:</strong> {BRAND.phone}</li>
            <li><strong>📧 Email:</strong> {BRAND.email}</li>
            <li><strong>🏢 Address:</strong> {BRAND.address}</li>
          </ul>

          {/* WhatsApp Link */}
          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 rounded-lg bg-green-600 text-white px-6 py-3 text-lg font-semibold hover:bg-green-700 transition"
          >
            Chat with Us on WhatsApp
          </a>
        </div>

        {/* Contact Form Section */}
        <form className="p-8 rounded-2xl border bg-white shadow-xl space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Send Us a Message</h2>

          {/* Name Inputs */}
          <div className="grid sm:grid-cols-2 gap-6">
            <input
              placeholder="First Name"
              className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              placeholder="Last Name"
              className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Email Input */}
          <input
            placeholder="Your Email"
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg w-full focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          {/* Message Textarea */}
          <textarea
            placeholder="Your Message"
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg w-full h-40 focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          {/* Submit Button */}
          <button className="w-full bg-green-600 text-white py-3 text-lg font-semibold rounded-lg hover:bg-green-700 transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
