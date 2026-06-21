import { Shirt, Sparkles, Scissors, Users } from "lucide-react";
import FeatureCard from "./FeatureCard";
import SectionHeading from "@/components/ui/SectionHeading";

const features = [
  {
    icon: Shirt,
    title: "Premium Quality",
    description: "Crafted with care using soft, durable fabrics designed to last and feel amazing.",
  },
  {
    icon: Sparkles,
    title: "Timeless Style",
    description: "Clean silhouettes and versatile pieces you can wear season after season.",
  },
  {
    icon: Scissors,
    title: "In-House Design",
    description: "Every detail is imagined by our in-house design team to bring you standout staples.",
  },
  {
    icon: Users,
    title: "For Every Body",
    description: "Inclusive fits and sizes designed to flatter all shapes, ages, and styles.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        title="What Makes Velora Stand Out"
        subtitle="Style, Comfort & More – Here's Why You'll Love Us"
      />
      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={
              index % 2 === 0
                ? "lg:-translate-y-4"
                : "lg:translate-y-4"
            }
          >
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </section>
  );
}