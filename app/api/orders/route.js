import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to place an order." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      email,
      firstName,
      lastName,
      companyName,
      country,
      streetAddress,
      apartment,
      city,
      state,
      pinCode,
      phone,
      phoneCountryCode,
      phoneNumber,
      notes,
      items,
    } = body;

    const fullPhone =
      phone || (phoneCountryCode && phoneNumber ? `+${phoneCountryCode}${phoneNumber}` : "");

    if (
      !email ||
      !firstName ||
      !lastName ||
      !country ||
      !streetAddress ||
      !city ||
      !state ||
      !pinCode ||
      !fullPhone
    ) {
      return NextResponse.json(
        { error: "Please fill in all required billing details." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    await dbConnect();

    // Normalize the billing email the same way the User schema does
    // (lowercase/trim) so email-based fallback lookups stay reliable.
    const normalizedEmail = email.trim().toLowerCase();

    const order = await Order.create({
      userId: user._id,
      email: normalizedEmail,
      firstName,
      lastName,
      companyName,
      country,
      streetAddress,
      apartment,
      city,
      state,
      pinCode,
      phone: fullPhone,
      notes,
      items,
      subtotal,
      total: subtotal,
    });

    console.log(
      `[orders] created order ${order._id} for user ${user.email} (${user._id})`
    );

    return NextResponse.json(
      { order: { ...order.toObject(), _id: order._id.toString() } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}