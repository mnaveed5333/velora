import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    name: "Jessica M., San Diego",
    avatar: "/testimonial-01.png",
    quote: "Velora has completely transformed how I shop for clothes. Every piece feels thoughtfully designed and incredibly comfortable — from their polos to their jackets, it's the style, and quality right every single time.",
  },
  {
    name: "Darren L., New York",
    avatar: "/testimonial-02.png",
    quote: "I'm always looking for clean, versatile styles I can wear to work or on weekends — and Velora delivers. I picked up a few items from their collection and was blown away by the craftsmanship. The trousers, especially, have become my go-to.",
  },
  {
    name: "Michelle T., Chicago",
    avatar: "/testimonial-03.png",
    quote: "Shopping for myself and my daughter usually means bouncing between stores, but Velora made it easy. I loved the quality of the dresses I ordered, and my daughter adored her Mini Jackets. Comfortable, well built — both fans for life!",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="What Our Shoppers Say" subtitle="Stores that nails fashion and comfort." />
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={t.name} className={i === 1 ? "sm:mt-8 sm:pb-8" : ""}>
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}