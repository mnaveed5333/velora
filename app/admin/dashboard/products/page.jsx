"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductTable from "@/components/admin/ProductTable";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load products.");
        setLoading(false);
        return;
      }
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete product.");
        return;
      }
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              {products.length} {products.length === 1 ? "product" : "products"} total
            </p>
          </div>
          <Link
            href="/admin/dashboard/products/new"
            className="flex items-center gap-1.5 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <Plus size={16} />
            Upload Product
          </Link>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {products.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-sm text-gray-500">No products yet.</p>
            <Link
              href="/admin/dashboard/products/new"
              className="mt-3 inline-block text-sm font-medium text-red-600 hover:text-red-700"
            >
              Upload your first product →
            </Link>
          </div>
        ) : (
          <ProductTable products={products} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
}