"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Pencil, ArrowLeft, Heart, MessageCircle } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminBlogDetailPage() {
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

  if (error || !post) {
    return (
      <>
        <AdminHeader />
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <p className="text-sm text-red-600">{error || "Post not found."}</p>
          <Link
            href="/admin/dashboard/blog"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            <ArrowLeft size={14} />
            Back to Blog Posts
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin/dashboard/blog"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <Link
            href={`/admin/dashboard/blog/${id}/edit`}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <Pencil size={14} />
            Edit Post
          </Link>
        </div>

        {/* Status + engagement */}
        <div className="mb-4 flex items-center gap-3">
          {post.published ? (
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              Published
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              Draft
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Heart size={13} /> {post.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <MessageCircle size={13} /> {post.comments?.length || 0}
          </span>
        </div>

        {/* Title + meta */}
        <h1 className="mb-2 text-2xl font-bold text-gray-900">{post.title}</h1>
        <p className="mb-6 text-sm text-gray-500">
          By {post.author} · {post.readTime} ·{" "}
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        {/* Featured image — 945x430 (≈2.2:1), matches upload crop */}
        <div className="mb-6 overflow-hidden rounded-lg" style={{ aspectRatio: "945 / 430" }}>
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-6 rounded-md bg-gray-50 px-4 py-3 text-sm italic text-gray-600">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="prose prose-slate max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Recent comments preview */}
        {post.comments?.length > 0 && (
          <div className="mt-10 border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Comments ({post.comments.length})
            </h2>
            <ul className="space-y-4">
              {post.comments
                .slice()
                .reverse()
                .slice(0, 5)
                .map((c) => (
                  <li key={c._id} className="rounded-md border border-gray-100 px-4 py-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-gray-900">{c.name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{c.text}</p>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}