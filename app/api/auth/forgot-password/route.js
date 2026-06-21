import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { sendResetEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with success, even if user doesn't exist.
    // This prevents leaking which emails are registered.
    if (!user) {
      return NextResponse.json(
        { message: "If that account exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 30); // 30 mins

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, resetLink);

    return NextResponse.json(
      { message: "If that account exists, a reset link has been sent." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}