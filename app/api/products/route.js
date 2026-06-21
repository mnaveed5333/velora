import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";

// Public product listing — supports ?bestseller=true, ?newArrival=true, ?onSale=true, ?category=Men
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const filter = {};

    if (searchParams.get("bestseller") === "true") filter.isBestSeller = true;
    if (searchParams.get("newArrival") === "true") filter.isNewArrival = true;
    if (searchParams.get("onSale") === "true") filter.onSale = true;
    if (searchParams.get("category")) filter.category = searchParams.get("category");

    const limit = Number(searchParams.get("limit")) || 0;

    let query = Product.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(limit);

    const products = await query.lean();

    const serialized = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json({ products: serialized }, { status: 200 });
  } catch (err) {
    console.error("Public products GET error:", err);
    return NextResponse.json({ error: "Failed to load products." }, { status: 500 });
  }
}