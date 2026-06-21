export default function PriceRange({ min, max, currency = "₹" }) {
  return (
    <p className="text-sm font-medium text-ink">
      {currency}{min.toFixed(2)} – {currency}{max.toFixed(2)}
    </p>
  );
}