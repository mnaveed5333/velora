"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard";

const SORT_OPTIONS = [
  { value: "latest", label: "Sort by latest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const PAGE_SIZE = 9;

function getPrice(product) {
  return product.price ?? product.minPrice ?? 0;
}

export default function ShopGrid({ products, initialCategory = "All" }) {
  const [sort, setSort] = useState("latest");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    ).sort();
    return ["All", ...unique];
  }, [products]);

  // If the initialCategory passed in (e.g. from a category card link)
  // doesn't actually exist in the product data, fall back to "All"
  // instead of silently showing zero results.
  useEffect(() => {
    if (initialCategory !== "All" && !categories.includes(initialCategory)) {
      setActiveCategory("All");
    } else {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory, categories]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sort === "price-asc") {
      list.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sort === "price-desc") {
      list.sort((a, b) => getPrice(b) - getPrice(a));
    }
    return list;
  }, [filteredProducts, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, sort]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedProducts.slice(start, start + PAGE_SIZE);
  }, [sortedProducts, currentPage]);

  const startIndex = sortedProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, sortedProducts.length);

  const goToPage = (page) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-6">
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-ink outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-600 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      <p className="mb-6 text-sm text-slate-500">
        Showing {startIndex}–{endIndex} of {sortedProducts.length} results
        {activeCategory !== "All" && (
          <>
            {" "}
            in <span className="font-medium text-ink">{activeCategory}</span>
          </>
        )}
      </p>

      {paginatedProducts.length === 0 ? (
        <p className="py-20 text-center text-slate-400">
          {activeCategory === "All"
            ? "No products yet. Check back soon!"
            : `No products found in ${activeCategory} yet.`}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-3">
          {paginatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            ←
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                page === currentPage
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-slate-200 text-ink hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}