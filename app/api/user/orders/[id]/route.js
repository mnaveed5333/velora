import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const belongsToUser =
      (order.userId && order.userId.toString() === user._id.toString()) ||
      (user.email && order.email === user.email);

    if (!belongsToUser) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const serialized = { ...order, _id: order._id.toString() };

    return NextResponse.json({ order: serialized }, { status: 200 });
  } catch (err) {
    console.error("Single order fetch error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}