import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import PostNavigation from "@/components/blog/PostNavigation";
import RelatedPosts from "@/components/blog/RelatedPosts";
import BlogEngagement from "@/components/blog/BlogEngagement";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getPostData(slug) {
  await dbConnect();

  const post = await Blog.findOne({ slug, published: true });
  if (!post) return null;

  const allPosts = await Blog.find({ published: true })
    .select("title slug image author createdAt")
    .sort({ createdAt: -1 });

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prev = allPosts[currentIndex + 1] || null;
  const next = allPosts[currentIndex - 1] || null;

  const related = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 2)
    .map((p) => ({
      id: p._id.toString(),
      slug: p.slug,
      title: p.title,
      image: p.image,
      author: p.author,
      date: new Date(p.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

  return {
    post: {
      title: post.title,
      slug: post.slug,
      content: post.content,
      image: post.image,
      author: post.author,
      excerpt: post.excerpt,
      date: new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    },
    prev: prev
      ? { slug: prev.slug, title: prev.title }
      : null,
    next: next
      ? { slug: next.slug, title: next.title }
      : null,
    related,
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const post = await Blog.findOne({ slug, published: true }).select("title excerpt");
  if (!post) return {};
  return {
    title: `${post.title} | Velora Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const data = await getPostData(slug);

  if (!data) notFound();

  const { post, prev, next, related } = data;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Post Header */}
      <h1 className="mb-2 text-3xl font-bold text-ink">{post.title}</h1>
      <p className="mb-6 text-sm text-slate-400">
        By {post.author} / {post.date}
      </p>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="mb-8 text-lg text-slate-600 leading-relaxed">
          {post.excerpt}
        </p>
      )}

      {/* Featured Image */}
      <div className="mb-8 overflow-hidden rounded-2xl">
        <img src={post.image} alt={post.title} className="h-72 w-full object-cover" />
      </div>

      {/* Post Content */}
      <div
        className="prose prose-slate max-w-none text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Like + Share + Comments (client island, fetches its own state) */}
      <BlogEngagement slug={slug} title={post.title} />

      {/* Prev / Next */}
      <PostNavigation prev={prev} next={next} />

      {/* Related Posts */}
      {related.length > 0 && <RelatedPosts posts={related} />}
    </main>
  );
}