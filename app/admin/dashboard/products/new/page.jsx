"use client";

import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  const handleAdd = async (formData) => {
    const res = await fetch("/api/admin/products", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add product.");
    router.push("/admin/dashboard/products");
  };

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Upload Product</h1>
          <button
            onClick={() => router.push("/admin/dashboard/products")}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Products
          </button>
        </div>

        <ProductForm onSubmit={handleAdd} submitLabel="Upload Product" />
      </div>
    </>
  );
}