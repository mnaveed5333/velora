import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { getCurrentUser } from "@/lib/auth";

// Post a comment — requires login
export async function POST(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to comment." },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await req.json();
    const text = body?.text?.toString().trim();

    if (!text) {
      return NextResponse.json({ error: "Comment cannot be empty." }, { status: 400 });
    }

    await dbConnect();
    const post = await Blog.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    post.comments.push({
      user: user._id,
      name: user.name,
      text,
    });

    await post.save();

    const newComment = post.comments[post.comments.length - 1];

    return NextResponse.json(
      {
        comment: {
          _id: newComment._id,
          text: newComment.text,
          name: newComment.name,
          createdAt: newComment.createdAt,
          avatarUrl: user.avatarUrl || null,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Comment POST error:", err);
    return NextResponse.json({ error: "Failed to post comment." }, { status: 500 });
  }
}