"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openAuthModal } from "@/store/slices/authSlice";
import PaymentSelector from "./PaymentSelector";

const isHex = (v) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v?.trim());

// A compact reference palette for approximate naming. Not exhaustive —
// finds the closest match by distance in RGB space, which is good enough
// for a human-readable label next to a swatch (not a precise color ID).
const NAMED_COLORS = [
  ["Black", "#000000"], ["White", "#FFFFFF"], ["Slate Grey", "#6B7280"],
  ["Light Grey", "#BEBEBE"], ["Charcoal", "#2F2F2F"], ["Almost Black", "#1C1C1C"],
  ["Oatmeal", "#D9C7A8"], ["Camel", "#C9A66B"], ["Taupe", "#8B7E66"],
  ["Cognac Brown", "#6B4226"], ["Dark Brown", "#3B2417"],
  ["Navy Blue", "#1E3A5F"], ["Dark Slate Blue", "#1E2A38"], ["Steel Blue", "#4A6B8A"],
  ["Deep Indigo", "#050D85"],
  ["Dark Green", "#006400"], ["Sage Green", "#8C9A8C"],
  ["Red", "#DB0A0A"], ["Brick Red", "#B4282D"], ["Maroon", "#8B0000"],
  ["Wine", "#6E1423"], ["Burgundy", "#9C2B3C"], ["Deep Rose", "#8B2942"],
  ["Silver", "#C0C0C0"],
];

function closestColorName(hex) {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return null;

  let closest = null;
  let bestDist = Infinity;
  for (const [name, candidateHex] of NAMED_COLORS) {
    const c = candidateHex.replace("#", "");
    const cr = parseInt(c.slice(0, 2), 16);
    const cg = parseInt(c.slice(2, 4), 16);
    const cb = parseInt(c.slice(4, 6), 16);
    const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      closest = name;
    }
  }
  return closest;
}

export default function OrderSummary({ items, subtotal, onPlaceOrder, onGoToTransfer, placing }) {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const dispatch = useDispatch();

  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(user);

  const handleAction = () => {
    if (!isLoggedIn) {
      dispatch(openAuthModal("login"));
      return;
    }
    if (paymentMethod === "cod") {
      onPlaceOrder("cod");
    } else {
      onGoToTransfer();
    }
  };

  const buttonLabel = () => {
    if (!isLoggedIn) return "Login to Checkout";
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
            return (
              <div key={item.lineKey} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg bg-bg-secondary object-cover"
                  />
                  <div>
                    <p className="flex flex-wrap items-center gap-1.5 text-sm text-ink">
                      {item.name}
                      {item.size && (
                        <span className="inline-flex items-center rounded border border-slate-200 bg-bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                          {item.size}
                        </span>
                      )}
                      {item.color && (
                        isHex(item.color) ? (
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full border border-black/10 shadow-sm"
                              style={{ backgroundColor: item.color.trim() }}
                              title={item.color}
                            />
                            <span className="text-[11px] text-slate-400">
                              {closestColorName(item.color) || item.color}
                            </span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">{item.color}</span>
                        )
                      )}
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

        {!authLoading && !isLoggedIn && (
          <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
            You need to{" "}
            <button
              type="button"
              onClick={() => dispatch(openAuthModal("login"))}
              className="font-semibold underline underline-offset-2 hover:text-amber-800"
            >
              log in
            </button>{" "}
            before you can complete your order.
          </p>
        )}

        <button
          type="button"
          onClick={handleAction}
          disabled={placing || items.length === 0 || authLoading}
          className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buttonLabel()}
        </button>
      </div>
    </div>
  );
}