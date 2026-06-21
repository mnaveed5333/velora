"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";

export default function Bestsellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBestsellers() {
      try {
        const res = await fetch("/api/products?bestseller=true&limit=3");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to load bestsellers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBestsellers();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        title="Bestsellers"
        subtitle="From cult-favorite jackets to must-have dresses — these are our customer faves."
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="mb-3 aspect-[3/4] rounded-2xl bg-slate-100" />
                <div className="mb-1 h-3 w-16 rounded bg-slate-100" />
                <div className="mb-1 h-4 w-32 rounded bg-slate-100" />
                <div className="h-4 w-20 rounded bg-slate-100" />
              </div>
            ))
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
    </section>
  );
}