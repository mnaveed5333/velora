"use client";

import { useDispatch } from "react-redux";
import { X, Minus, Plus } from "lucide-react";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";

export default function CartTable({ items }) {
  const dispatch = useDispatch();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      {/* Header */}
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 bg-bg-secondary px-6 py-4 text-sm font-semibold text-ink sm:grid">
        <span>Product</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Subtotal</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const lineTotal = item.price * item.quantity;
          const variantLabel = [item.size, item.color]
            .filter(Boolean)
            .join(", ");

          return (
            <div
              key={item.lineKey}
              className="grid grid-cols-[auto_2fr_1fr_1fr_1fr] items-center gap-4 px-6 py-5"
            >
              <button
                type="button"
                onClick={() => dispatch(removeFromCart(item.lineKey))}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-primary hover:text-primary"
                aria-label={`Remove ${item.name} from cart`}
              >
                <X size={13} />
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-lg bg-bg-secondary object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  {variantLabel && (
                    <p className="text-xs text-slate-400">{variantLabel}</p>
                  )}
                </div>
              </div>

              <span className="text-sm text-slate-600">
                ${Number(item.price).toFixed(2)}
              </span>

              <div className="flex h-9 w-fit items-center rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        lineKey: item.lineKey,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  disabled={item.quantity <= 1}
                  className="flex h-full w-8 items-center justify-center text-slate-500 transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center text-sm font-medium text-ink">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        lineKey: item.lineKey,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                  className="flex h-full w-8 items-center justify-center text-slate-500 transition hover:text-primary"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              <span className="text-sm font-semibold text-ink">
                ${lineTotal.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}