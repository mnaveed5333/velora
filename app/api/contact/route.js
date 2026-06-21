import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactSubmission from "@/lib/models/ContactSubmission";

export async function POST(req) {
  try {
    const body = await req.json();
    const name = body?.name?.toString().trim();
    const email = body?.email?.toString().trim();
    const whatsapp = body?.whatsapp?.toString().trim();
    const comment = body?.comment?.toString().trim();

    if (!name || !email || !whatsapp || !comment) {
      return NextResponse.json(
        { error: "Name, email, WhatsApp number, and comment are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const submission = await ContactSubmission.create({ name, email, whatsapp, comment });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (err) {
    console.error("Contact POST error:", err);
    return NextResponse.json(
      { error: "Failed to send your message. Please try again." },
      { status: 500 }
    );
  }
}