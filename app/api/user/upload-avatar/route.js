import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { getCurrentUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar");

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Basic validation: type and size (2MB max)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, or WEBP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 2MB." },
        { status: 400 }
      );
    }

    // Convert the uploaded file into a buffer, then a base64 data URI
    // Cloudinary's upload() can accept directly.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: "velora/avatars",
      public_id: currentUser._id.toString(), // overwrites previous avatar for this user
      overwrite: true,
      transformation: [{ width: 256, height: 256, crop: "fill", gravity: "face" }],
    });

    await dbConnect();

    const user = await User.findById(currentUser._id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    user.avatarUrl = uploadResult.secure_url;
    await user.save();

    return NextResponse.json(
      { message: "Avatar updated.", avatarUrl: user.avatarUrl },
      { status: 200 }
    );
  } catch (err) {
    console.error("Avatar upload error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}