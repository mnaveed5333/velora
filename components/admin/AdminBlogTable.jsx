"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Heart, MessageCircle } from "lucide-react";

export default function AdminBlogTable({ posts: initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 bg-white py-16 text-center">
        <p className="text-sm text-gray-500">No blog posts yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Post</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Engagement</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.map((post) => (
            <tr key={post._id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-10 w-14 rounded-md object-cover"
                  />
                  <span className="font-medium text-gray-900 line-clamp-1">{post.title}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {post.published ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Published
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    Draft
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart size={13} /> {post.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={13} /> {post.comments?.length || 0}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-700">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/dashboard/blog/${post._id}/edit`}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={deletingId === post._id}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}