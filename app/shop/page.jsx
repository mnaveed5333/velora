import ShopGrid from "@/components/product/ShopGrid";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";

export const metadata = {
  title: "Shop | Velora",
  description: "Browse our latest collection",
};

async function getProducts() {
  await dbConnect();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return products.map((p) => ({ ...p, _id: p._id.toString() }));
}

export default async function ShopPage({ searchParams }) {
  const products = await getProducts();
  const params = await searchParams;
  const initialCategory = params?.category || "All";

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Shop</h1>
      </div>

      <ShopGrid products={products} initialCategory={initialCategory} />
    </main>
  );
}