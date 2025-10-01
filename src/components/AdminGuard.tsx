// // components/AdminGuard.tsx
// import { useEffect, useState } from "react";
// import { auth, db } from "../lib/firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { Navigate } from "react-router-dom";

// export default function AdminGuard({ children }: { children: JSX.Element }) {
//   const [state, setState] = useState<"loading"|"ok"|"no">("loading");

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       if (!user) { setState("no"); return; }
//       const r = await getDoc(doc(db, "roles", user.uid));
//       if (r.exists() && r.data()?.admin === true) setState("ok");
//       else setState("no");
//     });
//     return unsub;
//   }, []);

//   if (state === "loading") return <div className="p-6">Checking admin…</div>;
//   if (state === "no") return <Navigate to="/admin/sign-in" replace />;
//   return children;
// }

export function AdminTopbar() {
  return (
    <div className="p-3 border-b flex justify-between items-center">
      <div className="font-semibold">Admin</div>
      <button className="text-sm underline" onClick={() => signOut(auth)}>Sign out</button>
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
  const [state, setState] = useState<"loading"|"ok"|"no"|"signedout">("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setState("signedout"); return; }
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
        <button className="underline" onClick={() => signOut(auth)}>Sign out</button>
      </div>
    );
  }
  return children;
}
