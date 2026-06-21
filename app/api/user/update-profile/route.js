import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req) {
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(currentUser._id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    user.name = name.trim();
    await user.save();

    return NextResponse.json(
      { message: "Profile updated.", user: { name: user.name, email: user.email } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}