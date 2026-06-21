"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartTotals({ subtotal }) {
  const router = useRouter();
  const [coupon, setCoupon] = useState("");

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="bg-bg-secondary px-6 py-4">
        <h2 className="text-xl font-bold text-ink">Cart totals</h2>
      </div>

      <div className="space-y-4 px-6 py-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-medium text-ink">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between pb-2">
          <span className="text-base font-semibold text-ink">Total</span>
          <span className="text-lg font-bold text-primary">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-slate-500">
            Have a coupon?
          </label>
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon code"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="button"
          onClick={() => router.push("/checkout")}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}