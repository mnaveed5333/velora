"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import BlogGrid from "@/components/blog/BlogGrid";

export default function BlogSearch({ posts }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) => post.title.toLowerCase().includes(q));
  }, [posts, query]);

  return (
    <div>
      {/* Search bar */}
      <div className="mx-auto mb-10 max-w-md">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts by title..."
            className="w-full rounded-full border border-ink/15 bg-white px-11 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-primary"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/35 hover:text-primary"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">
          No posts match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <BlogGrid posts={filtered} />
      )}
    </div>
  );
}