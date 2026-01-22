import { Link, NavLink } from "react-router-dom";

export function AdminTopbar() {
  const linkBase =
    "px-3 py-1.5 rounded-lg text-sm font-medium border hover:bg-emerald-50";
  const active =
    "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700";
  const inactive = "text-emerald-900 border-emerald-200";

  return (
    <div className="p-3 border-b bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to="/admin" className="font-semibold">
          Admin
        </Link>
        <nav className="hidden sm:flex items-center gap-2">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : inactive}`
            }
          >
            All Products
          </NavLink>
          <NavLink
            to="/admin/products/new"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : inactive}`
            }
          >
            + Add product
          </NavLink>
          <NavLink
            to="/admin/blogs"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? active : inactive}`
            }
          >
            Blog Posts
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile menu: show compact links */}
        <Link to="/admin/products" className="sm:hidden underline text-sm">
          Products
        </Link>
        <Link to="/admin/blogs" className="sm:hidden underline text-sm">
          Blog
        </Link>
        <Link to="/admin/products/new" className="sm:hidden underline text-sm">
          Add
        </Link>

        <button className="text-sm underline" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </div>
    </div>
  );
}

// components/AdminGuard.tsx
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }: { children: JSX.Element }) {
  const [state, setState] = useState<"loading" | "ok" | "no" | "signedout">(
    "loading"
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState("signedout");
        return;
      }
      const r = await getDoc(doc(db, "roles", user.uid));
      setState(r.exists() && r.data()?.admin === true ? "ok" : "no");
    });
    return unsub;
  }, []);

  if (state === "loading") return <div className="p-6">Checking admin…</div>;
  if (state === "signedout") return <Navigate to="/admin/sign-in" replace />;
  if (state === "no") {
    return (
      <div className="p-6">
        <p className="mb-3">You’re signed in, but not authorized for admin.</p>
        <button className="underline" onClick={() => signOut(auth)}>
          Sign out
        </button>
      </div>
    );
  }
  return children;
}
