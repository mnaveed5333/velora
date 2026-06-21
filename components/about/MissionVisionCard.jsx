export default function MissionVisionCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border-2 border-slate-600 p-10 text-center sm:p-12">
      <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="mb-5 text-2xl font-extrabold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-black">{description}</p>
    </div>
  );
}