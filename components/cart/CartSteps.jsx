export default function CartSteps({ currentStep = 1 }) {
  const steps = [
    { number: 1, label: "Shopping Cart" },
    { number: 2, label: "Checkout details" },
    { number: 3, label: "Order Complete" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {steps.map((step, i) => {
        const isActive = step.number === currentStep;
        return (
          <div key={step.number} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step.number}
              </span>
              <span
                className={`text-lg font-semibold ${
                  isActive ? "text-primary" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-slate-300">{">"}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}