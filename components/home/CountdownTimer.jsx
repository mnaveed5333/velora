"use client";

import { useEffect, useState } from "react";

function getTimeLeft(targetDate) {
  const diff = Math.max(0, targetDate - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ targetDate }) {
  const [time, setTime] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "DAY", value: time.days },
    { label: "HOURS", value: time.hours },
    { label: "MINS", value: time.minutes },
    { label: "SEC", value: time.seconds },
  ];

  return (
    <div className="flex justify-center gap-3">
      {units.map((unit) => (
        <div key={unit.label} className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-white text-ink">
          <span className="text-lg font-semibold">{String(unit.value).padStart(2, "0")}</span>
          <span className="text-[10px] text-slate-400">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}