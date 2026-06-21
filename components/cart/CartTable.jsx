"use client";

import { useDispatch } from "react-redux";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";

// Resolves both hex codes (#050d85) and color names ("navy") into a renderable hex
const COLOR_NAME_MAP = {
  red: "#EF4444", rose: "#F43F5E", pink: "#EC4899", orange: "#F97316",
  amber: "#F59E0B", yellow: "#EAB308", lime: "#84CC16", green: "#22C55E",
  emerald: "#10B981", teal: "#14B8A6", cyan: "#06B6D4", sky: "#0EA5E9",
  blue: "#3B82F6", indigo: "#6366F1", violet: "#8B5CF6", purple: "#A855F7",
  fuchsia: "#D946EF", white: "#F8FAFC", black: "#0F172A", gray: "#94A3B8",
  grey: "#94A3B8", slate: "#64748B", navy: "#1E3A5F", brown: "#92400E",
  beige: "#D4B896", cream: "#FDF6E3", gold: "#D97706", silver: "#CBD5E1",
  coral: "#FB7185", maroon: "#7F1D1D", olive: "#4D7C0F", mint: "#6EE7B7",
  lavender: "#C4B5FD", peach: "#FDBA74",
};

function resolveColor(color) {
  if (!color) return null;
  const trimmed = color.trim();
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) return trimmed;
  return COLOR_NAME_MAP[trimmed.toLowerCase()] ?? null;
}

function ColorSwatch({ color }) {
  if (!color) return null;
  const hex = resolveColor(color);

  return (
    <span className="inline-flex items-center gap-2">
      {hex && (
        <span
          className="inline-block h-4 w-4 flex-shrink-0 rounded-full border border-black/10 shadow-inner"
          style={{ backgroundColor: hex }}
          title={hex}
        />
      )}
    </span>
  );
}

export default function CartTable({ items }) {
  const dispatch = useDispatch();

  if (!items?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-bg-secondary py-20 text-center">
        <ShoppingBag size={36} className="mb-4 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header — only on sm+ */}
      <div className="hidden sm:grid grid-cols-[auto_2fr_1fr_1fr_1fr] gap-4 border-b border-slate-100 bg-bg-secondary px-6 py-4">
        <span />
        {["Product", "Price", "Quantity", "Subtotal"].map((h) => (
          <span key={h} className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const lineTotal = item.price * item.quantity;
          const hasSize = Boolean(item.size);
          const hasColor = Boolean(item.color);

          return (
            <div
              key={item.lineKey}
              className="group relative flex flex-col gap-4 px-4 py-5 transition-colors hover:bg-slate-50/50 sm:grid sm:grid-cols-[auto_2fr_1fr_1fr_1fr] sm:items-center sm:gap-4 sm:px-6"
            >
              {/* Remove */}
              <button
                type="button"
                onClick={() => dispatch(removeFromCart(item.lineKey))}
                className="absolute right-4 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-300 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-400 sm:static sm:right-auto sm:top-auto sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`Remove ${item.name}`}
              >
                <X size={12} strokeWidth={2.5} />
              </button>

              {/* Product */}
              <div className="flex items-center gap-4 pr-8 sm:pr-0">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:h-[68px] sm:w-[68px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink capitalize">{item.name}</p>

                  {(hasSize || hasColor) && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {hasSize && (
                        <span className="inline-flex h-5 items-center rounded-md bg-slate-100 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {item.size}
                        </span>
                      )}

                      {hasColor && (
                        <span className="inline-flex items-center">
                          <ColorSwatch color={item.color} />
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price shown inline on mobile */}
                  <p className="mt-1 text-sm text-slate-500 sm:hidden">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Price — desktop only column */}
              <span className="hidden text-sm text-slate-500 sm:block">
                ${Number(item.price).toFixed(2)}
              </span>

              {/* Bottom row on mobile: quantity + subtotal */}
              <div className="flex items-center justify-between sm:contents">
                {/* Quantity stepper */}
                <div className="flex h-9 w-[104px] items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(updateQuantity({ lineKey: item.lineKey, quantity: item.quantity - 1 }))
                    }
                    disabled={item.quantity <= 1}
                    className="flex h-full w-9 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="flex-1 select-none text-center text-sm font-semibold text-ink">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(updateQuantity({ lineKey: item.lineKey, quantity: item.quantity + 1 }))
                    }
                    className="flex h-full w-9 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-primary"
                    aria-label="Increase quantity"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="text-sm font-bold text-ink">
                  ${lineTotal.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}