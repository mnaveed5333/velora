"use client";

const OPTIONS = [
  { value: "cod", label: "Cash on Delivery" },
  { value: "transfer", label: "Bank Account Transfer" },
];

export default function PaymentSelector({ selected, onChange }) {
  return (
    <div className="mt-6 space-y-2">
      <p className="text-sm font-semibold text-ink">Payment method</p>
      <div className="space-y-2">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
              selected === opt.value
                ? "border-primary bg-primary/5"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-primary"
            />
            <span className="text-ink">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}