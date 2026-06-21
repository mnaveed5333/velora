"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { signup, setAuthView } from "@/store/slices/authSlice";
import Button from "@/components/ui/Button";

export default function SignupForm() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await dispatch(signup({ name, email, password }));
      if (signup.rejected.match(result)) {
        throw new Error(result.payload || "Signup failed.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>

      <div>
        <label className="mb-2 block font-medium text-gray-900">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 focus:border-red-500 focus:outline-none"
        />
      </div>

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

      <div>
        <label className="mb-2 block font-medium text-gray-900">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 focus:border-red-500 focus:outline-none"
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
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 focus:border-red-500 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating account..." : "SIGN UP"}
      </Button>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={() => dispatch(setAuthView("login"))}
          className="text-gray-700 underline hover:text-red-600"
        >
          Already have an account? Log in
        </button>
      </div>
    </form>
  );
}