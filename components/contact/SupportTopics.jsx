import SectionHeading from "@/components/ui/SectionHeading";
import SupportTopicsGrid from "./SupportTopicsGrid";

export default function SupportTopics() {
  return (
    <section className="bg-rose-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Explore Our Support Topics"
          subtitle="From returns and shipping to sizing and payments, we've got answers to all your most common questions."
        />
        <div className="mt-12">
          <SupportTopicsGrid />
        </div>
      </div>
    </section>
  );
}