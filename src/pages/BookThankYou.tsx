// src/pages/BookThankYou.tsx
import { useState } from "react";

const DRIVE_FILE_ID = "1GC_UfFdzJHd9aJ2jSa1jvbSdT5_2BQUW";
const DOWNLOAD_URL  = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;
const VIEW_URL      = `https://drive.google.com/uc?export=view&id=${DRIVE_FILE_ID}`;

// ✅ Choose a password you'll set on the PDF (or the one you already use)
const BOOK_PASSWORD = "homemoney"; 

export default function BookThankYou() {
  const [copied, setCopied] = useState(false);

  async function copyPw() {
    try {
      await navigator.clipboard.writeText(BOOK_PASSWORD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="container py-16 text-center">
      <h1 className="text-3xl font-bold">Thank you for your purchase! 🎉</h1>
      <p className="mt-2 text-gray-600">Your e-book is ready below.</p>

      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
        <a
          href={DOWNLOAD_URL}
          className="rounded-full bg-emerald-700 text-white px-6 py-3 font-semibold hover:bg-emerald-800"
        >
          Download the PDF
        </a>
        <a
          href={VIEW_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border px-6 py-3 font-semibold text-emerald-900 border-emerald-200 hover:bg-emerald-50"
        >
          Open in browser
        </a>
      </div>

      <div className="mt-8 inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
        <span className="text-sm text-emerald-900 font-semibold">Password:</span>
        <code className="text-sm">{BOOK_PASSWORD}</code>
        <button
          onClick={copyPw}
          className="text-sm text-emerald-800 underline decoration-emerald-300 hover:decoration-emerald-600"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Having trouble? Use “Open in browser”, then enter the password. Still stuck? 
        <a className="underline ml-1" href="mailto:Bukonla@beafrique.com?subject=E-book%20download%20help">Email us</a>.
      </p>
    </div>
  );
}
