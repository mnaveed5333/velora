import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";

// Force this component to run fresh on every request instead of being
// statically generated at build time. Without this, if the DB connection
// at build time returned 0 products, that empty result gets baked into
// the deployed HTML and never refetches until the next deploy.
export const dynamic = "force-dynamic";

async function getNewArrivals() {
  await dbConnect();

  // Temporary diagnostic — check Vercel's runtime logs for this line.
  // If it doesn't appear at all, the component never ran on the server
  // in production (a routing/caching issue). If it appears but logs 0,
  // the DB connection succeeded but the query found nothing — check
  // env vars / which database you're actually connected to.
  const count = await Product.countDocuments({ isNewArrival: true });
  console.log("[NewArrivals] isNewArrival count:", count);

  const products = await Product.find({ isNewArrival: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  console.log("[NewArrivals] products fetched:", products.length);

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