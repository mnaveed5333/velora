// app/api/payments/transfer/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { getCurrentUser } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

const MAX_IMAGE_SIZE_MB = 4;

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to place an order." },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();

    const {
      email, firstName, lastName, companyName, country,
      streetAddress, apartment, city, state, pinCode, phone, notes,
      items, subtotal, screenshot,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!screenshot || typeof screenshot !== "string" || !screenshot.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Please upload a valid payment screenshot." },
        { status: 400 }
      );
    }

    // Rough size check: base64 is ~33% larger than raw bytes.
    const approxBytes = (screenshot.length * 3) / 4;
    if (approxBytes > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Screenshot is too large. Please keep it under ${MAX_IMAGE_SIZE_MB}MB.` },
        { status: 400 }
      );
    }

    // Upload Base64 to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(screenshot, {
      resource_type: "image",
      folder: "payment_screenshots",
    });
    const screenshotUrl = uploadResult.secure_url;

    // Save order with the Cloudinary URL under the field name
    // the admin table / schema actually reads: paymentScreenshot
    const order = await Order.create({
      userId: user._id,
      email, firstName, lastName, companyName, country,
      streetAddress, apartment, city, state, pinCode, phone, notes,
      items,
      subtotal,
      total: subtotal,
      paymentMethod: "transfer",
      paymentStatus: "pending",
      status: "pending",
      paymentScreenshot: screenshotUrl, // ✅ matches OrdersTable.jsx / admin route
    });

    return NextResponse.json(
      { order: { _id: order._id.toString(), paymentScreenshot: screenshotUrl } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Transfer order error:", err);
    return NextResponse.json(
      { error: "Failed to submit order. Please try again." },
      { status: 500 }
    );
  }
}