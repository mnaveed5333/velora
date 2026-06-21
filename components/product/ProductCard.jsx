"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addToCart } from "@/store/slices/cartSlice";
import ColorSwatch from "./ColorSwatch";
import SizeSelector from "./SizeSelector";
import SaleBadge from "./SaleBadge";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    slug,
    name,
    category,
    image,
    price,
    originalPrice,
    rating,
    reviewCount,
    colors = [],
    sizes = [],
    onSale,
    isBestSeller,
  } = product;

  const hasDiscount = onSale && originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: product._id,
        slug,
        name,
        image,
        price,
        color: colors[0] ?? null,
        size: sizes[0] ?? null,
        quantity: 1,
      })
    );
    router.push("/cart");
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl">
      {/* Image */}
      <div
        className="group relative overflow-hidden bg-slate-100"
        style={{ aspectRatio: "4 / 5" }}
      >
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {onSale && <SaleBadge />}
          {isBestSeller && (
            <span className="rounded-full bg-ink/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              Bestseller
            </span>
          )}
        </div>

        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-widest text-slate-400">{category}</p>
        <h3 className="mt-0.5 truncate text-base font-semibold text-ink capitalize">{name}</h3>

        {typeof rating === "number" && (
          <div className="mt-1 mb-1.5 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-200 text-slate-200"
                  }
                />
              ))}
            </div>
            {typeof reviewCount === "number" && (
              <span className="text-xs text-slate-400">{reviewCount}</span>
            )}
          </div>
        )}

        <div className="mb-3 flex items-center gap-2">
          {hasDiscount && (
            <>
              <span className="text-sm text-slate-400 line-through">
                ${Number(originalPrice).toFixed(2)}
              </span>
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                -{discountPercent}%
              </span>
            </>
          )}
          <span className="text-2xl font-bold text-[#A02334]">${Number(price).toFixed(2)}</span>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <ColorSwatch colors={colors} />
          <SizeSelector sizes={sizes} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/shop/${slug}`}
            className="flex-1 rounded-full border border-slate-200 py-2 text-center text-xs font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}