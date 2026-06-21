import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";

// TODO: wrap this route with your existing admin auth check
// (the same middleware/cookie check you use on other admin routes).

export async function POST(req) {
  try {
    await dbConnect();
    const { orderId, adminEmail } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required." }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    order.paymentStatus = "paid";
    order.status = "processing";
    order.verifiedAt = new Date();
    order.verifiedBy = adminEmail || "admin";
    await order.save();

    return NextResponse.json({ success: true, order: { _id: order._id.toString() } });
  } catch (err) {
    console.error("Order verify error:", err);
    return NextResponse.json(
      { error: "Failed to verify order." },
      { status: 500 }
    );
  }
}