"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminBlogTable from "@/components/admin/AdminBlogTable";

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/blog");

        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load posts.");
          setLoading(false);
          return;
        }

        setPosts(data.posts);
        setLoading(false);
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, [router]);

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-semibold text-gray-900">Blog Posts</h1>
            <p className="text-sm text-gray-500">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </div>
          <Link
            href="/admin/dashboard/blog/new"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <Plus size={15} />
            New Post
          </Link>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <AdminBlogTable posts={posts} />
      </div>
    </>
  );
}