"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ColorSwatch from "./ColorSwatch";
import SizeSelector from "./SizeSelector";
import SaleBadge from "./SaleBadge";

export default function ProductCard({ product }) {
  const {
    slug,
    name,
    category,
    image,
    price,
    colors = [],
    sizes = [],
    onSale,
    isBestSeller,
  } = product;

  return (
    <div className="group relative">
      <Link href={`/shop/${slug}`} className="block">
        <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100">
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
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
              No image
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      <button
        aria-label="Wishlist"
        onClick={(e) => e.preventDefault()}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-all hover:scale-105 hover:text-primary"
      >
        <Heart size={15} />
      </button>

      <Link href={`/shop/${slug}`} className="block">
        <p className="text-xs uppercase tracking-wide text-slate-400">{category}</p>
        <h3 className="mb-1 truncate text-sm font-medium text-ink transition-colors group-hover:text-primary">
          {name}
        </h3>
        <p className="text-sm font-semibold text-ink">${Number(price).toFixed(2)}</p>
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <ColorSwatch colors={colors} />
        <SizeSelector sizes={sizes} />
      </div>
    </div>
  );
}