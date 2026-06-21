"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { login, setAuthView } from "@/store/slices/authSlice";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await dispatch(login({ email, password }));
      if (login.rejected.match(result)) {
        throw new Error(result.payload || "Login failed.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block font-medium text-gray-900">
          Username or Email Address
        </label>
        <input
          type="text"
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
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 focus:border-red-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 accent-red-600"
          id="rememberMe"
        />
        <label htmlFor="rememberMe" className="text-gray-800">
          Remember Me
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Logging in..." : "LOG IN"}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => dispatch(setAuthView("forgot"))}
          className="text-gray-700 underline hover:text-red-600"
        >
          Lost your password?
        </button>
        <button
          type="button"
          onClick={() => dispatch(setAuthView("signup"))}
          className="text-gray-700 underline hover:text-red-600"
        >
          Create an account
        </button>
      </div>
    </form>
  );
}