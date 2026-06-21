import { ShoppingBag, Clock, ClipboardCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import StepCard from "./StepCard";

const steps = [
  { icon: ShoppingBag, title: "Shop Styles", description: "Browse our curated collections for Men, Women, Kids & Accessories." },
  { icon: Clock, title: "Pick Your Fit", description: "Find your perfect size with our detailed fit guides and style notes for every piece." },
  { icon: ClipboardCheck, title: "Checkout Fast", description: "Enjoy a quick and secure checkout experience with flexible payment options." },
];

export default function HowItWorks() {
  return (
    <section className="bg-bg-secondary px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Just Pick, Pack and Shop" title="How It Works" />
        <div className="rounded-3xl bg-white p-10 shadow-sm">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-0">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={
                  i === 0
                    ? "sm:pr-8"
                    : i === steps.length - 1
                      ? "sm:border-l sm:border-slate-200 sm:pl-8"
                      : "sm:border-l sm:border-slate-200 sm:px-8"
                }
              >
                <StepCard {...step} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}