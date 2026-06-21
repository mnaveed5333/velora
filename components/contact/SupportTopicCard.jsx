import SupportLinkItem from "./SupportLinkItem";

export default function SupportTopicCard({ title, links }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h3 className="mb-4 text-xl font-bold text-gray-900">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <SupportLinkItem key={link.label} href={link.href} label={link.label} />
        ))}
      </ul>
    </div>
  );
}