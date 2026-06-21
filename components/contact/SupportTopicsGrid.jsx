import SupportTopicCard from "./SupportTopicCard";

const topics = [
  {
    title: "Returns & Exchanges",
    links: [
      { label: "Returns & Exchanges", href: "/faqs#returns" },
      { label: "How to Start a Return", href: "/faqs#start-return" },
      { label: "Check Return Status", href: "/faqs#return-status" },
    ],
  },
  {
    title: "Ordering & Payment",
    links: [
      { label: "Modify or Cancel an Order", href: "/faqs#modify-order" },
      { label: "Pre-order Items", href: "/faqs#pre-order" },
      { label: "Payment Methods", href: "/faqs#payment-methods" },
    ],
  },
  {
    title: "Shipping & Delivery",
    links: [
      { label: "Shipping Options & Costs", href: "/faqs#shipping-options" },
      { label: "Estimated Delivery Times", href: "/faqs#delivery-times" },
      { label: "Track Your Order", href: "/faqs#track-order" },
    ],
  },
  {
    title: "Product Information",
    links: [
      { label: "Materials & Fabrics", href: "/faqs#materials" },
      { label: "Care Instructions", href: "/faqs#care-instructions" },
      { label: "Availability & Restocks", href: "/faqs#availability" },
    ],
  },
  {
    title: "Account & Privacy",
    links: [
      { label: "Create or Manage Your Account", href: "/faqs#account" },
      { label: "Password Reset Help", href: "/faqs#password-reset" },
      { label: "Privacy Policy", href: "/faqs#privacy-policy" },
    ],
  },
  {
    title: "Sizing & Fit",
    links: [
      { label: "Size Guide", href: "/faqs#size-guide" },
      { label: "Fit Tips & Recommendations", href: "/faqs#fit-tips" },
      { label: "Product Measurements", href: "/faqs#measurements" },
    ],
  },
];

export default function SupportTopicsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {topics.map((topic) => (
        <SupportTopicCard key={topic.title} title={topic.title} links={topic.links} />
      ))}
    </div>
  );
}