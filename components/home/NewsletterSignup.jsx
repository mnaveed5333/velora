"use client";
import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    // TODO: wire to your actual newsletter API endpoint
  }

  return (
    <section className="px-6 py-12 text-center sm:px-8 sm:py-16 md:px-12 md:py-20">
      <h2 className="mb-3 text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
        Get 10% Off on Your First Order
      </h2>
      <p className="mb-6 text-sm text-gray-500 sm:mb-8 sm:text-base">
        Plus exclusive access to product drops, style tips, and insider deals.
      </p>

      {submitted ? (
        <p className="text-base font-medium text-red-600">
          Thanks — check your inbox for your code!
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER YOUR EMAIL *"
            className="flex-1 border border-gray-300 bg-gray-50 px-4 py-3.5 text-sm uppercase tracking-wide text-gray-500 placeholder-gray-400 outline-none focus:border-gray-400 sm:px-5 sm:py-4"
          />
          <button
            type="submit"
            className="bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-red-700 sm:px-8 sm:py-4"
          >
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}