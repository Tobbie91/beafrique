import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../store/cart";

export default function HeaderCartIcon() {
  const count = useCart((s) => s.count()); 

  return (
    <Link
      to="/cart"
      aria-label="View cart"
      className="ml-2 relative inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-emerald-900 hover:bg-emerald-50"
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="hidden lg:inline text-sm font-medium">Cart</span>
      <span className="ml-1 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-emerald-900">
        {count}
      </span>
    </Link>
  );
}
