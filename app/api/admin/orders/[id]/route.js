import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log("[admin order detail] fetching id:", id);

    await dbConnect();

    const order = await Order.findById(id).lean();
    if (!order) {
      console.log("[admin order detail] NOT FOUND for id:", id);
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const serialized = { ...order, _id: order._id.toString() };

    return NextResponse.json({ order: serialized }, { status: 200 });
  } catch (err) {
    console.error("Admin single order fetch error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}