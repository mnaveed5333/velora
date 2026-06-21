"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthView } from "@/store/slices/authSlice";
import Button from "@/components/ui/Button";

export default function ForgotPasswordForm() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-900">
        Reset your password
      </h2>
      <p className="text-sm text-gray-600">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <div>
        <label className="mb-2 block font-medium text-gray-900">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 focus:border-red-500 focus:outline-none"
        />
      </div>

      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending..." : "SEND RESET LINK"}
      </Button>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={() => dispatch(setAuthView("login"))}
          className="text-gray-700 underline hover:text-red-600"
        >
          Back to login
        </button>
      </div>
    </form>
  );
}