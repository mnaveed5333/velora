import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";

export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    console.error("Fetch admin orders error:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { screenshot, items, subtotal, ...billingData } = body;

    await dbConnect();

    const order = await Order.create({
      ...billingData,
      items,
      total: subtotal,
      paymentMethod: "transfer",
      paymentStatus: "pending",
      paymentScreenshot: screenshot,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err) {
    console.error("Transfer order error:", err);
    return NextResponse.json(
      { error: "Failed to submit order." },
      { status: 500 }
    );
  }
}