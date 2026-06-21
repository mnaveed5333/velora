import Link from "next/link";

export default function RelatedPosts({ posts }) {
  return (
    <div className="mt-10">
      <h2 className="mb-6 text-xl font-bold text-ink">Related Posts</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            <div className="mb-3 overflow-hidden rounded-xl">
              <img
                src={post.image}
                alt={post.title}
                className="h-44 w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <h3 className="mb-1 font-semibold text-ink group-hover:text-primary">
              {post.title}
            </h3>
            <p className="text-xs text-slate-400">
              {post.date} | By {post.author}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}