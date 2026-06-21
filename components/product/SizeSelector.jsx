export default function SizeSelector({ sizes = [] }) {
  return (
    <div className="flex gap-1.5 text-xs text-slate-500">
      {sizes.map((size, i) => (
        <span key={size}>
          {size}
          {i < sizes.length - 1 && <span className="mx-1 text-slate-300">|</span>}
        </span>
      ))}
    </div>
  );
}