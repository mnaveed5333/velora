import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/shop?category=${encodeURIComponent(category.categoryValue)}`}
      className="group relative block overflow-hidden rounded-3xl border-2 border-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="h-90 w-full overflow-hidden">
        <img
          src={`/${category.image}`}
          alt={category.name}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-x-6 bottom-4 rounded-2xl bg-white px-6 py-3 text-center shadow-md">
        <p className="text-base font-bold text-gray-900">{category.name}</p>
        <span className="text-sm font-semibold text-rose-600 group-hover:text-rose-700 transition-colors">
          Shop Now
        </span>
      </div>
    </Link>
  );
}