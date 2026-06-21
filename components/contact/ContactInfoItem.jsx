export default function ContactInfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-lg font-bold text-gray-900">{label}</p>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  );
}