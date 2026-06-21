"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

function formatDateTime(dateString) {
  const d = new Date(dateString);
  const datePart = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} · ${timePart}`;
}

export default function OrderRow({ order }) {
  const router = useRouter();
  const needsVerification =
    order.paymentMethod === "transfer" && order.paymentStatus === "pending";
  const isShipped = order.status === "shipped";

  return (
    <div className="relative">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          isShipped ? "bg-primary" : needsVerification ? "bg-primary-hover" : "bg-transparent"
        }`}
      />

      <button
        type="button"
        onClick={() => router.push(`/admin/dashboard/orders/${order._id}`)}
        className="grid w-full grid-cols-1 gap-2 px-6 py-4 pl-7 text-left text-sm transition hover:bg-bg-secondary sm:grid-cols-[2fr_1.5fr_1fr_1.2fr_auto] sm:items-center sm:gap-4"
      >
        <span className="flex flex-wrap items-center gap-2 font-semibold text-ink">
          {order.firstName} {order.lastName}
          {needsVerification && (
            <span className="rounded-full bg-bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              Needs Verification
            </span>
          )}
          {isShipped && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Shipped
            </span>
          )}
        </span>
        <span className="text-gray-600">
          {order.email}
          <br />
          <span className="text-xs text-gray-500">{order.phone}</span>
        </span>
        <span className="font-semibold text-ink">
          ${Number(order.total).toFixed(2)}
        </span>
        <span className="text-gray-500">{formatDateTime(order.createdAt)}</span>
        <span className="flex justify-end text-gray-400">
          <ChevronRight size={16} />
        </span>
      </button>
    </div>
  );
}