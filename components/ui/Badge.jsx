export default function Badge({ children, color = "primary" }) {
  const colors = {
    primary: "bg-primary text-white",
    light: "bg-white text-ink",
  };

  return (
    <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}