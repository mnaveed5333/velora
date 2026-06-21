import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();

    // passwordHash has no select:false, so it's included by default here
    const user = await User.findById(currentUser._id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}