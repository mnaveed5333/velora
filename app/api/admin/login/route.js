import { NextResponse } from "next/server";
import { signAdminToken, setAdminAuthCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
      email.toLowerCase() !== adminEmail?.toLowerCase() ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = signAdminToken();
    await setAdminAuthCookie(token);

    return NextResponse.json({ admin: { email: adminEmail } }, { status: 200 });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}