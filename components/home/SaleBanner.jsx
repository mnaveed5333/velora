"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import CountdownTimer from "./CountdownTimer";

export default function SaleBanner() {
  const [targetDate, setTargetDate] = useState(null);

  useEffect(() => {
    // This will only run on the client side after mounting
    const saleEndsAt = new Date();
    saleEndsAt.setDate(saleEndsAt.getDate() + 1);
    saleEndsAt.setHours(5, 24, 19, 0);

    setTargetDate(saleEndsAt);
  }, []);

  return (
    <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-ink text-center text-white sm:min-h-[420px] lg:min-h-[480px]">
      {/* Mobile image */}
      <img
        src="/salebanner.png"
        alt="Summer Sale"
        className="absolute inset-0 h-full w-full object-cover opacity-50 sm:hidden"
      />
      {/* Desktop image */}
      <img
        src="/salebannerd.png"
        alt="Summer Sale"
        className="absolute min-h-[700px] inset-0 hidden h-full w-full object-cover opacity-50 sm:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-md px-4 sm:max-w-lg sm:px-6 lg:max-w-xl">
        <h2 className="mb-2 text-2xl font-semibold sm:mb-3 sm:text-3xl lg:text-4xl">
          Hurry Up! Get Up to 50% Off
        </h2>
        <p className="mb-4 text-sm text-slate-200 sm:mb-6 sm:text-base">
          Step into summer with sun-ready styles at can't-miss prices.
        </p>

        <div className="mb-4 min-h-[50px] sm:mb-6">
          {/* Only render the timer once the targetDate is safely set on the client */}
          {targetDate && <CountdownTimer targetDate={targetDate} />}
        </div>

        <Button href="/shop">Shop the Summer Sale</Button>
      </div>
    </section>
  );
}