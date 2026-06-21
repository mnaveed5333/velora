"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminBlogForm from "@/components/admin/AdminBlogForm";

export default function EditBlogPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/blog/${id}`);

        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load post.");
          setLoading(false);
          return;
        }

        setPost(data.post);
        setLoading(false);
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

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
      <div className="px-4 py-12">
        <h1 className="mb-8 text-center text-2xl font-semibold text-gray-900">
          Edit Blog Post
        </h1>
        {error ? (
          <p className="text-center text-sm text-red-600">{error}</p>
        ) : (
          <AdminBlogForm initialPost={post} />
        )}
      </div>
    </>
  );
}