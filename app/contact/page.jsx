import ContactHero from "@/components/contact/ContactHero";
import ContactFormCard from "@/components/contact/ContactFormCard";
import ContactInfoCard from "@/components/contact/ContactInfoCard";
import SupportTopics from "@/components/contact/SupportTopics";

export const metadata = {
  title: "Contact Us | Velora",
  description:
    "Have a question about your order, sizing, shipping, or just want to say hello? Get in touch with the Velora team.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />

      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <ContactFormCard />
          <ContactInfoCard />
        </div>
      </section>

      <SupportTopics />
    </main>
  );
}