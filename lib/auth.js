import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/lib/models/User";
import dbConnect from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "velora_token";
const ADMIN_COOKIE_NAME = "velora_admin_token";

// Sign a JWT for a given user id
export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

// Sign a JWT specifically for an admin session (no userId needed —
// admin isn't a User document anymore, just env-based credentials)
export function signAdminToken() {
  return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "1d" });
}

// Verify a JWT, returns decoded payload or null
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Set the auth cookie (httpOnly, secure in prod)
export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Clear the auth cookie (logout)
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// Set the admin auth cookie (shorter-lived, separate from customer cookie)
export async function setAdminAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
}

// Clear the admin auth cookie (admin logout)
export async function clearAdminAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// Get the currently logged-in user (or null) from the cookie
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded?.userId) {
    console.warn("[auth] velora_token present but invalid/expired or missing userId claim");
    return null;
  }

  await dbConnect();
  const user = await User.findById(decoded.userId).select(
    "name email createdAt avatarUrl"
  );

  if (!user) {
    // Token decodes fine but points at a user that no longer exists
    // (deleted account, DB reset, stale token from another environment, etc.)
    console.warn(
      `[auth] token userId ${decoded.userId} did not resolve to a User document`
    );
  }

  return user;
}

// Check if the current request has a valid admin session.
// Admin credentials live in env vars, not the database —
// this just verifies the signed token, nothing more.
export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded?.admin) return null;

  return { email: process.env.ADMIN_EMAIL };
}