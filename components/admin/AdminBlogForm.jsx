"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";

export default function AdminBlogForm({ initialPost = null }) {
  const router = useRouter();
  const isEdit = Boolean(initialPost);

  const [title, setTitle] = useState(initialPost?.title || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [author, setAuthor] = useState(initialPost?.author || "Velora Team");
  const [readTime, setReadTime] = useState(initialPost?.readTime || "5 min read");
  const [published, setPublished] = useState(initialPost?.published ?? true);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialPost?.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    if (!isEdit && !imageFile) {
      setError("A featured image is required.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("excerpt", excerpt.trim());
      formData.append("content", content.trim());
      formData.append("author", author.trim());
      formData.append("readTime", readTime.trim());
      formData.append("published", String(published));
      if (imageFile) formData.append("image", imageFile);

      const url = isEdit ? `/api/admin/blog/${initialPost._id}` : "/api/admin/blog";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard/blog");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {/* Image upload — 945x430 (≈2.2:1), matches blog hero/card crop */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Featured Image {!isEdit && <span className="text-red-500">*</span>}
        </label>
        <label
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
          style={{ aspectRatio: "945 / 430" }}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-gray-400">
              <ImagePlus size={22} />
              <span className="text-xs">Click to upload</span>
              <span className="text-[11px] text-gray-400">Recommended 945 × 430px</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder="e.g. 5 Wardrobe Staples Every Minimalist Needs"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder="Short summary shown on the blog grid card"
        />
      </div>

      {/* Content */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Content (HTML) <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono outline-none focus:border-primary"
          placeholder="<p>Write your post content. Basic HTML tags supported.</p>"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Read Time</label>
          <input
            type="text"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="5 min read"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="published" className="text-sm text-gray-700">
          Published (visible on the public blog)
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {loading ? "Saving..." : isEdit ? "Save Changes" : "Publish Post"}
      </button>
    </form>
  );
}