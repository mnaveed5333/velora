"use client";

import { useState } from "react";
import PaymentSelector from "./PaymentSelector";

export default function OrderSummary({ items, subtotal, onPlaceOrder, onGoToTransfer, placing }) {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleAction = () => {
    if (paymentMethod === "cod") {
      onPlaceOrder("cod");
    } else {
      onGoToTransfer();
    }
  };

  const buttonLabel = () => {
    if (placing) return "Placing order...";
    if (paymentMethod === "cod") return `Place Order $${subtotal.toFixed(2)}`;
    return "Proceed to Account Transfer";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="bg-bg-secondary px-6 py-4">
        <h2 className="text-xl font-bold text-ink">Your order</h2>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm font-semibold text-ink">
          <span>Product</span>
          <span>Subtotal</span>
        </div>

        <div className="divide-y divide-slate-100">
          {items.map((item) => {
            const variant = [item.size, item.color].filter(Boolean).join(", ");
            return (
              <div key={item.lineKey} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg bg-bg-secondary object-cover"
                  />
                  <div>
                    <p className="text-sm text-ink">
                      {item.name}
                      {variant && <span className="text-slate-400"> - {variant}</span>}
                      <span className="text-slate-400"> × {item.quantity}</span>
                    </p>
                  </div>
                </div>
                <span className="whitespace-nowrap text-sm font-medium text-ink">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium text-ink">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-ink">Total</span>
            <span className="text-lg font-bold text-primary">${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <PaymentSelector selected={paymentMethod} onChange={setPaymentMethod} />

        <button
          type="button"
          onClick={handleAction}
          disabled={placing || items.length === 0}
          className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buttonLabel()}
        </button>
      </div>
    </div>
  );
}