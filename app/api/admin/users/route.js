import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();

    const users = await User.find({})
      .select("name email createdAt isAdmin")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { count: users.length, users },
      { status: 200 }
    );
  } catch (err) {
    console.error("Admin users fetch error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}