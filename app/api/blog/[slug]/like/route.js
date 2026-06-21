import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { getCurrentUser } from "@/lib/auth";

// Toggle like — requires login
export async function POST(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to like a post." },
        { status: 401 }
      );
    }

    const { slug } = await params;
    await dbConnect();

    const post = await Blog.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const userId = user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(user._id);
    }

    await post.save();

    return NextResponse.json(
      { likeCount: post.likes.length, likedByMe: !alreadyLiked },
      { status: 200 }
    );
  } catch (err) {
    console.error("Like POST error:", err);
    return NextResponse.json({ error: "Failed to update like." }, { status: 500 });
  }
}