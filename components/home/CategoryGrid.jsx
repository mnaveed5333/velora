import SectionHeading from "@/components/ui/SectionHeading";
import CategoryCard from "./CategoryCard";

// Placeholder category data — swap for real DB/CMS calls later.
// `categoryValue` must exactly match the `category` field saved on
// products (see CATEGORY_OPTIONS in ProductForm.jsx) — `name` is just
// the display label shown on the card.
const categories = [
  { name: "Mens Wear", categoryValue: "Men", slug: "mens", image: "category-01.jpg" },
  { name: "Womens Wear", categoryValue: "Women", slug: "womens", image: "category-02.jpg" },
  { name: "Kids Wear", categoryValue: "Kids", slug: "kids", image: "category-03.jpg" },
  { name: "Accessories", categoryValue: "Accessories", slug: "accessories", image: "category-04.jpg" },
];

export default function CategoryGrid() {
  return (
    <section className="bg-bg-secondary px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Our Categories"
          subtitle="Explore a wide range of styles, handpicked to suit every taste and need."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}