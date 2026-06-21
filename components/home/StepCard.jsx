export default function StepCard({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4 text-left">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="mb-2 text-base font-bold text-ink">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}