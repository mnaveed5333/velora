import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactSubmission from "@/lib/models/ContactSubmission";
import { getCurrentAdmin } from "@/lib/auth";

// Mark a submission as read
export async function PUT(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!submission) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    return NextResponse.json({ submission }, { status: 200 });
  } catch (err) {
    console.error("Admin contact PUT error:", err);
    return NextResponse.json({ error: "Failed to update submission." }, { status: 500 });
  }
}

// Delete a submission
export async function DELETE(req, { params }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const submission = await ContactSubmission.findByIdAndDelete(id);
    if (!submission) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Admin contact DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete submission." }, { status: 500 });
  }
}