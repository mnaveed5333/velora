"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load product.");
          setLoading(false);
          return;
        }
        setProduct(data.product);
        setLoading(false);
      } catch (err) {
        setError("Something went wrong.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleUpdate = async (formData) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: "PUT", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update product.");
    setTimeout(() => router.push("/admin/dashboard/products"), 800);
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
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Edit Product</h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {product && (
          <ProductForm initialData={product} onSubmit={handleUpdate} submitLabel="Update Product" />
        )}
      </div>
    </>
  );
}