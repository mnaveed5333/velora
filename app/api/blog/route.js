import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";

// Public listing — published posts only, no comment/like detail needed for the grid
export async function GET() {
  try {
    await dbConnect();
    const posts = await Blog.find({ published: true })
      .select("title slug excerpt image author readTime createdAt likes")
      .sort({ createdAt: -1 });

    // Send a lightweight likeCount instead of the full likes array
    const shaped = posts.map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      image: p.image,
      author: p.author,
      readTime: p.readTime,
      createdAt: p.createdAt,
      likeCount: p.likes.length,
    }));

    return NextResponse.json({ posts: shaped }, { status: 200 });
  } catch (err) {
    console.error("Public blog GET error:", err);
    return NextResponse.json({ error: "Failed to load posts." }, { status: 500 });
  }
}