import ContactForm from "./ContactForm";

export default function ContactFormCard() {
  return (
    <div className="rounded-3xl bg-rose-50 p-8 md:p-10">
      <p className="text-lg font-bold text-gray-900">Send Us Message</p>
      <h3 className="mb-6 text-3xl font-extrabold text-gray-900">
        Contact Form
      </h3>
      <ContactForm />
    </div>
  );
}