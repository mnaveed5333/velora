import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    await dbConnect();

    const post = await Blog.findOne({ slug, published: true }).populate(
      "comments.user",
      "name avatarUrl"
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    // Optional viewer — logged-in or not, page still renders
    const user = await getCurrentUser();
    const userId = user?._id?.toString();

    const shaped = {
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      readTime: post.readTime,
      createdAt: post.createdAt,
      likeCount: post.likes.length,
      likedByMe: userId ? post.likes.some((id) => id.toString() === userId) : false,
      comments: post.comments
        .slice()
        .reverse() // newest first
        .map((c) => ({
          _id: c._id,
          text: c.text,
          name: c.name,
          createdAt: c.createdAt,
          avatarUrl: c.user?.avatarUrl || null,
        })),
    };

    return NextResponse.json({ post: shaped }, { status: 200 });
  } catch (err) {
    console.error("Public blog GET (one) error:", err);
    return NextResponse.json({ error: "Failed to load post." }, { status: 500 });
  }
}