import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { getCurrentAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

// List all blog posts (admin)
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const posts = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    console.error("Admin blog GET error:", err);
    return NextResponse.json({ error: "Failed to load posts." }, { status: 500 });
  }
}

// Create a new blog post (admin)
export async function POST(req) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title")?.toString().trim();
    const excerpt = formData.get("excerpt")?.toString().trim() || "";
    const content = formData.get("content")?.toString().trim();
    const author = formData.get("author")?.toString().trim() || "Velora Team";
    const readTime = formData.get("readTime")?.toString().trim() || "5 min read";
    const published = formData.get("published") !== "false";
    const file = formData.get("image");

    if (!title || !content || !file) {
      return NextResponse.json(
        { error: "Title, content, and image are required." },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: "velora/blog",
      transformation: [{ width: 1200, height: 700, crop: "fill" }],
    });

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await dbConnect();

    const post = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      author,
      readTime,
      published,
      image: uploadResult.secure_url,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("Admin blog POST error:", err);
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A blog post with this title already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}