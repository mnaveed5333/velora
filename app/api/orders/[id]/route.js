import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { getCurrentAdmin } from "@/lib/auth"; // adjust if your admin check has a different name

export async function GET(request, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const serialized = { ...order, _id: order._id.toString() };

    return NextResponse.json({ order: serialized }, { status: 200 });
  } catch (err) {
    console.error("Admin single order fetch error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}