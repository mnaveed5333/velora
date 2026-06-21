import Link from "next/link";

export default function RecommendedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
      <div className="bg-bg-secondary px-6 py-4">
        <h3 className="text-sm font-semibold text-ink">
          You may be interested in...
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/shop/${product.slug}`}
            className="flex items-center gap-4 px-6 py-4 transition hover:bg-bg-secondary/40"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.onSale && (
                <span className="absolute left-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
                  Sale!
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-primary">{product.name}</p>
              <p className="text-xs text-slate-400">{product.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}