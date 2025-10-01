// pages/AdminDashboard.tsx
import { AdminTopbar } from "../components/AdminGuard";
import AdminAddProduct from "../components/AdminAddProduct"; // the Cloudinary+Firestore uploader

export default function AdminDashboard() {
  return (
    <div>
      <AdminTopbar />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Add Product</h1>
        <AdminAddProduct />
      </div>
    </div>
  );
}
