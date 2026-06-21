export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-400 p-7 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center">
        <Icon size={48} strokeWidth={1.5} className="text-primary" />
      </div>
      <h3 className="mb-2.5 text-lg font-bold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}