import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { received, rating, issue } = body;

    console.log("[review] === START ===");
    console.log("[review] order id from params:", id);
    console.log("[review] body received:", { received, rating, issue });
    console.log("[review] user._id:", user?._id?.toString());

    if (typeof received !== "boolean") {
      return NextResponse.json(
        { error: "Please confirm whether you received your order." },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Please select a star rating." },
        { status: 400 }
      );
    }

    await dbConnect();
    console.log("[review] DB connected");

    const order = await Order.findById(id);
    if (!order) {
      console.log("[review] ORDER NOT FOUND for id:", id);
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    console.log("[review] found order, current order.review BEFORE assign:", order.review);
    console.log("[review] order._id from DB doc:", order._id.toString());
    console.log("[review] order.userId from DB doc:", order.userId.toString());

    const userId = user?._id?.toString();
    if (order.userId.toString() !== userId) {
      console.log("[review] USER MISMATCH — order.userId:", order.userId.toString(), "vs userId:", userId);
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    if (order.status !== "shipped") {
      console.log("[review] STATUS MISMATCH — order.status:", order.status);
      return NextResponse.json(
        { error: "This order hasn't shipped yet." },
        { status: 400 }
      );
    }

    order.review = {
      received,
      rating,
      issue: issue?.trim() || "",
      submittedAt: new Date(),
    };

    // Submitting feedback marks the order as completed
    order.status = "completed";

    console.log("[review] order.review AFTER assign (in memory):", order.review);
    console.log("[review] order.status AFTER assign (in memory):", order.status);
    console.log("[review] is order.isModified('review')?", order.isModified("review"));

    const savedDoc = await order.save();
    console.log("[review] SAVE COMPLETED");
    console.log("[review] savedDoc.review (returned from .save()):", savedDoc.review);
    console.log("[review] savedDoc.status (returned from .save()):", savedDoc.status);

    const refetched = await Order.findById(id).lean();
    console.log("[review] RE-FETCHED FROM DB:", JSON.stringify(refetched.review));
    console.log("[review] RE-FETCHED status:", refetched.status);
    console.log("[review] === END ===");

    const plain = order.toObject();
    return NextResponse.json(
      { order: { ...plain, _id: plain._id.toString() } },
      { status: 200 }
    );
  } catch (err) {
    console.error("[review] THREW ERROR:", err);
    console.error("[review] ERROR NAME:", err?.name);
    console.error("[review] ERROR MESSAGE:", err?.message);
    if (err?.errors) {
      console.error("[review] VALIDATION ERRORS:", JSON.stringify(err.errors, null, 2));
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}