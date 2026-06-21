"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import CartSteps from "@/components/cart/CartSteps";
import CartTable from "@/components/cart/CartTable";
import CartTotals from "@/components/cart/CartTotals";
import RecommendedProducts from "@/components/cart/RecommendedProducts";

export default function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const [recommended, setRecommended] = useState([]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    async function loadRecommendations() {
      if (items.length === 0) return;
      try {
        const res = await fetch("/api/products?limit=4");
        const data = await res.json();
        // Exclude products already in the cart
        const cartProductIds = new Set(items.map((i) => i.productId));
        const filtered = (data.products || []).filter(
          (p) => !cartProductIds.has(p._id)
        );
        setRecommended(filtered.slice(0, 1));
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      }
    }
    loadRecommendations();
  }, [items]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-ink">Cart</h1>
        <CartSteps currentStep={1} />
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-20 text-center">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-3 inline-block text-sm font-medium text-primary hover:text-primary-hover"
          >
            Continue shopping →
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <CartTable items={items} />
            <RecommendedProducts products={recommended} />
          </div>
          <CartTotals subtotal={subtotal} />
        </div>
      )}
    </main>
  );
}