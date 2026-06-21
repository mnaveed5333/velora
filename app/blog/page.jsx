import BlogHero from "@/components/blog/BlogHero";
import BlogSearch from "@/components/blog/BlogSearch";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";

export const metadata = {
  title: "Blog | Velora",
  description: "Style tips and fashion advice from Velora",
};

export const dynamic = "force-dynamic";

async function getPosts() {
  await dbConnect();
  const posts = await Blog.find({ published: true })
    .select("title slug excerpt image author readTime createdAt likes")
    .sort({ createdAt: -1 });

  return posts.map((p) => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    image: p.image,
    author: p.author,
    date: new Date(p.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    readTime: p.readTime,
    likeCount: p.likes.length,
  }));
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <BlogHero />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-400">
            No posts yet — check back soon.
          </p>
        ) : (
          <BlogSearch posts={posts} />
        )}
      </div>
    </main>
  );
}