// pages/AdminSignIn.tsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBusy(true); setErr(null);
      await signInWithEmailAndPassword(auth, email, pass);
      nav("/admin/products/new"); // your admin home
    } catch (e:any) {
      setErr(e.message || "Sign-in failed");
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="max-w-sm m-8 space-y-3">
      <h1 className="text-2xl font-bold">Admin Sign In</h1>
      <input className="border px-3 py-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" className="border px-3 py-2 w-full" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} />
      <button disabled={busy} className="px-4 py-2 bg-emerald-600 text-white rounded">{busy ? "…" : "Sign in"}</button>
      {err && <p className="text-red-600 text-sm">{err}</p>}
    </form>
  );
}
