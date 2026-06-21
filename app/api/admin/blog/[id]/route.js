import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { getCurrentAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

// Get a single blog post (admin)
export async function GET(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const post = await Blog.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (err) {
    console.error("Admin blog GET (one) error:", err);
    return NextResponse.json({ error: "Failed to load post." }, { status: 500 });
  }
}

// Update a blog post (admin) - image optional, only re-uploads if a new file is sent
export async function PUT(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await req.formData();
    const title = formData.get("title")?.toString().trim();
    const excerpt = formData.get("excerpt")?.toString().trim() || "";
    const content = formData.get("content")?.toString().trim();
    const author = formData.get("author")?.toString().trim() || "Velora Team";
    const readTime = formData.get("readTime")?.toString().trim() || "5 min read";
    const published = formData.get("published") !== "false";
    const file = formData.get("image");

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    await dbConnect();
    const post = await Blog.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    let imageUrl = post.image;

    // Only re-upload if a real new file was sent (not empty placeholder)
    if (file && typeof file !== "string" && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(base64, {
        folder: "velora/blog",
        transformation: [{ width: 1200, height: 700, crop: "fill" }],
      });

      imageUrl = uploadResult.secure_url;
    }

    post.title = title;
    post.excerpt = excerpt;
    post.content = content;
    post.author = author;
    post.readTime = readTime;
    post.published = published;
    post.image = imageUrl;

    // Re-slug only if the title actually changed, so existing links keep working otherwise
    const newSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (newSlug !== post.slug) {
      post.slug = newSlug;
    }

    await post.save();

    return NextResponse.json({ post }, { status: 200 });
  } catch (err) {
    console.error("Admin blog PUT error:", err);
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A blog post with this title already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}

// Delete a blog post (admin)
export async function DELETE(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const post = await Blog.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Admin blog DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
  }
}