import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactSubmission from "@/lib/models/ContactSubmission";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (err) {
    console.error("Admin contact GET error:", err);
    return NextResponse.json(
      { error: "Failed to load submissions." },
      { status: 500 }
    );
  }
}