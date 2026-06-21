import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import Blog from "@/lib/models/Blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  await dbConnect();

  const products = await Product.find().select("slug updatedAt createdAt");
  const posts = await Blog.find({ published: true }).select("slug updatedAt createdAt");

  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "/shop", priority: 0.9 },
    { url: "/blog", priority: 0.8 },
    { url: "/about", priority: 0.6 },
    { url: "/contact", priority: 0.5 },
  ].map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: new Date(),
    priority: page.priority,
  }));

  const productPages = products.map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    lastModified: p.updatedAt || p.createdAt,
    priority: 0.7,
  }));

  const blogPages = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt || p.createdAt,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}