import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";

async function getNewArrivals() {
  await dbConnect();
  const products = await Product.find({ isNewArrival: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();
  return products.map((p) => ({ ...p, _id: p._id.toString() }));
}

export default async function NewArrivals() {
  const newArrivals = await getNewArrivals();

  if (newArrivals.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        title="New Arrivals"
        subtitle="Be the first to wear this season's latest looks. Handpicked and freshly styled."
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {newArrivals.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}