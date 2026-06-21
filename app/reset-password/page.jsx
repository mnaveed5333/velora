"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Missing or invalid reset token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setMessage(data.message);
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-md bg-gray-100 p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          Set a new password
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Choose a new password for your Velora account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-gray-900">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-red-500 focus:outline-none"
            />
          </div>

          {message && <p className="text-sm text-green-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Resetting..." : "RESET PASSWORD"}
          </Button>
        </form>
      </div>
    </div>
  );
}