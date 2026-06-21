export default function ColorSwatch({ colors = [] }) {
  return (
    <div className="flex gap-1.5">
      {colors.map((color) => (
        <span
          key={color}
          className="h-3.5 w-3.5 rounded-full border border-black/10"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}