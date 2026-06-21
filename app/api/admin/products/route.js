import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import { getCurrentAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

// List all products (admin)
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    console.error("Admin products GET error:", err);
    return NextResponse.json({ error: "Failed to load products." }, { status: 500 });
  }
}

// Create a new product (admin)
export async function POST(req) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString().trim();
    const category = formData.get("category")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || "";
    const price = Number(formData.get("price"));
    const colors = formData.get("colors")?.toString() || "";
    const sizes = formData.get("sizes")?.toString() || "";
    const onSale = formData.get("onSale") === "true";
    const isNewArrival = formData.get("isNewArrival") === "true";
    const isBestSeller = formData.get("isBestSeller") === "true";
    const file = formData.get("image");

    if (!name || !category || !price || !file) {
      return NextResponse.json(
        { error: "Name, category, price, and image are required." },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: "velora/products",
      transformation: [{ width: 600, height: 698, crop: "fill" }],
    });

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await dbConnect();

    const product = await Product.create({
      name,
      slug,
      category,
      description,
      price,
      image: uploadResult.secure_url,
      colors: colors ? colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
      sizes: sizes ? sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      onSale,
      isNewArrival,
      isBestSeller,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("Admin products POST error:", err);
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A product with this name already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}