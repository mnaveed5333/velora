export default function SizeSelector({ sizes = [] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {sizes.map((size) => (
        <span
          key={size}
          className="inline-flex items-center justify-center rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500"
        >
          {size}
        </span>
      ))}
    </div>
  );
}