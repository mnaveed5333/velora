"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-16">
      <div
        className={`w-full max-w-md text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Checkmark */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-ink">Order Placed!</h1>
        <p className="mt-3 text-slate-500">
          Thank you for your order. We've received it and will process it shortly.
          You'll receive a confirmation once it's on its way.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-5 text-left space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Order confirmed
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              </svg>
            </span>
            Payment processing
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
              </svg>
            </span>
            Shipping soon
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-bg-secondary"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}