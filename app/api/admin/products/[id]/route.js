import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import { getCurrentAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

// Get single product (for edit page prefill)
export async function GET(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.error("Admin product GET error:", err);
    return NextResponse.json({ error: "Failed to load product." }, { status: 500 });
  }
}

// Update product
export async function PUT(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
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

    if (!name || !category || !price) {
      return NextResponse.json(
        { error: "Name, category, and price are required." },
        { status: 400 }
      );
    }

    const update = {
      name,
      category,
      description,
      price,
      colors: colors ? colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
      sizes: sizes ? sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      onSale,
      isNewArrival,
      isBestSeller,
    };

    // Regenerate slug only if the name changed
    if (name !== existing.name) {
      update.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Only re-upload if a new image file was actually provided
    if (file && typeof file !== "string" && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResult = await cloudinary.uploader.upload(base64, {
        folder: "velora/products",
        transformation: [{ width: 600, height: 698, crop: "fill" }],
      });

      update.image = uploadResult.secure_url;
    }

    const product = await Product.findByIdAndUpdate(id, update, { new: true });

    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.error("Admin product PUT error:", err);
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A product with this name already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

// Delete product
export async function DELETE(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Admin product DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}