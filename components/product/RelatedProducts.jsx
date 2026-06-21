// components/product/RelatedProducts.jsx
import ProductCard from "./ProductCard";

export default function RelatedProducts({ products, category }) {
  return (
    <section className="mt-20">
      <div className="mb-7">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          You May Also Like
        </p>
        <h2 className="mt-1 text-2xl font-bold text-ink">
          More from {category}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}