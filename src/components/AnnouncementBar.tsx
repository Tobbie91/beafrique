// src/components/AnnouncementBar.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DISMISS_KEY = "bea.announcement.dismissed";

export default function AnnouncementBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === "1") setHidden(true);
  }, []);

  if (hidden) return null;

  return (
    <div className="bg-emerald-950 text-emerald-50">
      <div
        className="
          container relative flex flex-wrap items-center justify-center gap-x-3 gap-y-1
          px-4 py-2 text-xs md:text-sm text-center
          overflow-hidden
          pr-10   /* reserve space for the close button on mobile */
        "
      >
        <span className="inline-flex items-center gap-2 font-medium tracking-wide break-words">
          <span aria-hidden>🌿</span>
          <span>Made in limited quantities to reduce waste and promote sustainability.</span>
        </span>

        <Link
          to="/about"
          className="underline underline-offset-4 decoration-emerald-300 hover:decoration-yellow-400"
        >
          Learn more
        </Link>

        {/* Dismiss */}
        <button
          aria-label="Close announcement"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            setHidden(true);
          }}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            rounded-md px-2 py-1 hover:bg-emerald-900/60
          "
        >
          ×
        </button>
      </div>
    </div>
  );
}

