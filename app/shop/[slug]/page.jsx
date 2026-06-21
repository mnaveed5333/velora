// app/shop/[slug]/page.jsx
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductOptions from "@/components/product/ProductOptions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const product = await Product.findOne({ slug }).lean();
  if (!product) return { title: "Product Not Found | Velora" };
  return {
    title: `${product.name} | Velora`,
    description: product.description || `${product.name} - ${product.category}`,
  };
}

async function getProduct(slug) {
  await dbConnect();
  const product = await Product.findOne({ slug }).lean();
  if (!product) return null;
  return { ...product, _id: product._id.toString() };
}

async function getRelatedProducts(category, excludeId) {
  await dbConnect();
  const related = await Product.find({
    category,
    _id: { $ne: excludeId },
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();
  return related.map((p) => ({ ...p, _id: p._id.toString() }));
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product._id);

  const hasDescription =
    product.description && product.description.trim().length > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <p className="mb-8 text-xs uppercase tracking-wider text-slate-400">
        Shop&nbsp;/&nbsp;<span className="text-slate-500">{product.category}</span>
      </p>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Image */}
        <div className="lg:sticky lg:top-10 lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-bg-secondary">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              style={{ aspectRatio: "600/698" }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-sm uppercase tracking-wide text-slate-400">
            {product.category}
          </p>

          <h1 className="mt-2 text-3xl font-bold leading-tight text-ink">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-primary">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.onSale && (
              <span className="rounded-full bg-bg-secondary px-2.5 py-1 text-xs font-medium text-primary">
                On Sale
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mt-5">
            <p
              className={`text-sm leading-relaxed ${
                hasDescription ? "text-slate-600" : "italic text-slate-400"
              }`}
            >
              {hasDescription
                ? product.description
                : "No description has been added for this product yet."}
            </p>
          </div>

          {/* Color / size selection + Add to Cart — interactive, client-side */}
          <ProductOptions
            productId={product._id}
            slug={product.slug}
            name={product.name}
            image={product.image}
            price={product.price}
            colors={product.colors || []}
            sizes={product.sizes || []}
          />
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} category={product.category} />
      )}
    </main>
  );
}