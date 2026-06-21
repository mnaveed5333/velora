import Link from "next/link";
import { Heart } from "lucide-react";

export default function BlogCard({ post }) {
  const { slug, title, date, readTime, image, excerpt, likeCount } = post;

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
    >
      {/* Image — 945x430 (≈2.2:1), matches admin upload crop */}
      <div className="overflow-hidden" style={{ aspectRatio: "945 / 430" }}>
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-2 text-xl font-bold text-ink leading-snug group-hover:text-primary">
          {title}
        </h3>
        <p className="mb-3 text-sm font-semibold text-slate-700">
          {date} | {readTime}
        </p>
        <p className="mb-3 text-sm text-slate-600 leading-relaxed line-clamp-3">{excerpt}</p>
        {typeof likeCount === "number" && (
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <Heart size={12} />
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </p>
        )}
      </div>
    </Link>
  );
}