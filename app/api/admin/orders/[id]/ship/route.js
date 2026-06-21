import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params; // ✅ params is a Promise in Next.js 15+
    const body = await req.json();
    const { contactName, contactPhone } = body;

    if (!contactName || !contactPhone) {
      return NextResponse.json(
        { error: "Contact name and phone are required to mark as shipped." },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status: "shipped",
        shippedAt: new Date(),
        shippingContact: { name: contactName, phone: contactPhone },
      },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json(
      { order: { ...order, _id: order._id.toString() } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Mark shipped error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}