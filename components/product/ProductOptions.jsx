"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";

export default function ProductOptions({
  productId,
  slug,
  name,
  image,
  price,
  colors = [],
  sizes = [],
}) {
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

  const needsColor = colors.length > 0;
  const needsSize = sizes.length > 0;
  const canProceed =
    (!needsColor || selectedColor) && (!needsSize || selectedSize);

  const handleAddToCart = () => {
    if (!canProceed) return;
    dispatch(
      addToCart({
        productId,
        slug,
        name,
        image,
        price,
        color: selectedColor,
        size: selectedSize,
        quantity: 1,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <>
      {needsColor && (
        <div className="mt-7 rounded-xl bg-bg-secondary/50 p-5">
          <p className="mb-3 text-sm font-medium text-slate-500">
            Color
            {selectedColor && (
              <span className="ml-2 text-xs font-normal text-slate-400">
                Selected
              </span>
            )}
          </p>
          <div className="flex gap-2.5">
            {colors.map((c) => {
              const isSelected = c === selectedColor;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`h-8 w-8 rounded-full border-2 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-white ring-1 ring-slate-200 hover:ring-2 hover:ring-primary/40"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                  aria-label={`Select color ${c}`}
                  aria-pressed={isSelected}
                />
              );
            })}
          </div>
        </div>
      )}

      {needsSize && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-medium text-slate-500">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const isSelected = s === selectedSize;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  aria-pressed={isSelected}
                  className={`min-w-[3rem] rounded-lg border px-3.5 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 text-ink hover:border-primary hover:text-primary"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!canProceed && (needsColor || needsSize) && (
        <p className="mt-3 text-xs text-slate-400">
          {needsColor && !selectedColor && needsSize && !selectedSize
            ? "Please select a color and size."
            : needsColor && !selectedColor
            ? "Please select a color."
            : "Please select a size."}
        </p>
      )}

      <div className="mt-9">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canProceed}
          className="w-full rounded-lg bg-primary py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-12"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </>
  );
}