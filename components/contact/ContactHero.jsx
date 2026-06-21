import SectionHeading from "@/components/ui/SectionHeading";

export default function ContactHero() {
  return (
    <section className="bg-rose-50 px-6 py-20 text-center">
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          title="Contact Us"
          subtitle="Have a question about your order, sizing, shipping, or just want to say hello? Our team at Velora is always happy to hear from you."
        />
      </div>
    </section>
  );
}