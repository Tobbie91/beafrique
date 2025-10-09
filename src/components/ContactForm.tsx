// ContactForm.tsx
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"err">("idle");
  const [err, setErr] = useState<string|null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErr(null);

    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("https://formspree.io/f/mblrlpbd", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: fd,
      });
      const json = await res.json();
      if (res.ok) setStatus("ok");
      else {
        setStatus("err");
        setErr(json?.errors?.map((x:any)=>x.message).join(", ") || "Failed to send");
      }
    } catch (e:any) {
      setStatus("err");
      setErr(e?.message || "Network error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input name="name" placeholder="Your name" required className="border p-2 rounded w-full" />
      <input name="email" type="email" placeholder="Your email" required className="border p-2 rounded w-full" />
      <input name="phone" placeholder="Phone" className="border p-2 rounded w-full" />
      <textarea name="message" placeholder="Tell us a bit about your request" required className="border p-2 rounded w-full" />
      <button disabled={status==="sending"} className="bg-emerald-600 text-white px-4 py-2 rounded">
        {status==="sending" ? "Sending…" : "Send"}
      </button>
      {status==="ok" && <p className="text-emerald-700">Thanks! We’ll get back to you shortly.</p>}
      {status==="err" && <p className="text-red-600">{err}</p>}
    </form>
  );
}
