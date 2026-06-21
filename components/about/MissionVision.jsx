import { Eye, Target } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import MissionVisionCard from "./MissionVisionCard";

const items = [
    {
        icon: Eye,
        title: "Our Mission",
        description:
            "To create timeless, high-quality fashion that blends comfort with confidence. We're here to empower individuals of all ages and body types with clothing that fits seamlessly into real life — versatile, inclusive, and made to be lived in. We design with purpose, craft with care, and always put people first.",
    },
    {
        icon: Target,
        title: "Our Vision",
        description:
            "To become a trusted, global fashion destination that redefines modern essentials. We envision a world where style is accessible, self-expression is celebrated, and fashion feels effortless for everyone — from city streets to family weekends. At Velora, we aim to lead with creativity, integrity, and a deep understanding.",
    },
];

export default function MissionVision() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading
                title="Our Purpose, Your Style"
                subtitle="At Velora, everything we create starts with you — your lifestyle, your confidence, and your need for fashion that truly fits."
            />
            <div className="grid grid-cols-1 gap-20 sm:grid-cols-2">
                {items.map((item, index) => (
                    <div key={item.title} className={`mx-5 ${index === 1 ? "sm:translate-y-11" : ""}`}>
                        <MissionVisionCard {...item} />
                    </div>
                ))}
            </div>
        </section>
    );
}