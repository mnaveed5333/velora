import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();

    // Primary match: by userId (correct, normal case)
    let orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Fallback: if nothing found by userId, check if there are orders
    // under this user's email but with a different/missing userId
    // (covers legacy data or duplicate-account edge cases).
    if (orders.length === 0 && user.email) {
      const emailMatches = await Order.find({ email: user.email })
        .sort({ createdAt: -1 })
        .lean();

      if (emailMatches.length > 0) {
        console.warn(
          `[user/orders] userId mismatch for ${user.email}: found ${emailMatches.length} order(s) by email but 0 by userId (${user._id}). Backfilling userId.`
        );

        // Self-heal: attach the correct userId so future lookups work normally
        const ids = emailMatches.map((o) => o._id);
        await Order.updateMany(
          { _id: { $in: ids } },
          { $set: { userId: user._id } }
        );

        orders = emailMatches;
      }
    }

    console.log(
      `[user/orders] user=${user.email} (${user._id}) -> ${orders.length} order(s)`
    );

    const serialized = orders.map((o) => ({ ...o, _id: o._id.toString() }));

    return NextResponse.json({ orders: serialized }, { status: 200 });
  } catch (err) {
    console.error("User orders fetch error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}