"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Package, Search, X } from "lucide-react";

const STATUS_LABEL = {
  pending: "Pending Verification",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

function getSpineColor(status) {
  switch (status) {
    case "shipped":
    case "completed":
      return "bg-primary";
    case "processing":
      return "bg-primary-hover";
    default:
      return "bg-bg-secondary";
  }
}

function formatDateTime(dateString) {
  const d = new Date(dateString);
  const datePart = d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timePart = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} at ${timePart}`;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/user/orders");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load orders.");
          setLoading(false);
          return;
        }
        setOrders(data.orders || []);
        setLoading(false);
      } catch {
        setError("Something went wrong.");
        setLoading(false);
      }
    }
    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-sm tracking-wide text-gray-500">Loading your orders…</p>
      </main>
    );
  }

  const query = search.trim().toLowerCase();
  const filteredOrders = query
    ? orders.filter((order) =>
        order.items.some((item) => item.name.toLowerCase().includes(query))
      )
    : orders;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Velora
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          My Orders
        </h1>
      </div>

      {orders.length > 0 && (
        <div className="relative mb-8">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders by product name…"
            className="w-full rounded-full border border-gray-300 bg-white py-3 pl-11 pr-11 text-sm text-ink placeholder:text-gray-400 focus:border-primary focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-primary"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mb-6 rounded-md bg-bg-secondary px-4 py-3 text-sm text-primary">
          {error}
        </p>
      )}

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 px-6 py-16 text-center">
          <Package className="mx-auto mb-3 text-gray-400" size={28} strokeWidth={1.5} />
          <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 px-6 py-16 text-center">
          <Search className="mx-auto mb-3 text-gray-400" size={28} strokeWidth={1.5} />
          <p className="text-sm text-gray-500">
            No orders match <span className="font-semibold text-ink">"{search}"</span>.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const paymentMethod = order.paymentMethod || "cod";
            const isTransfer = paymentMethod === "transfer";
            const firstItem = order.items[0];
            const extraCount = order.items.length - 1;

            return (
              <button
                key={order._id}
                type="button"
                onClick={() => router.push(`/user/orders/${order._id}`)}
                className="group relative flex w-full items-center gap-4 overflow-hidden rounded-lg border border-gray-200 bg-white px-6 py-5 pl-7 text-left transition hover:border-primary/40 hover:shadow-sm"
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${getSpineColor(order.status)}`}
                />

                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-bg-secondary">
                  {firstItem?.image && (
                    <img
                      src={firstItem.image}
                      alt={firstItem.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-xs tracking-wide text-gray-500">
                      ORDER #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink">
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-ink">
                    {firstItem?.name}
                    {extraCount > 0 && (
                      <span className="text-gray-400"> +{extraCount} more</span>
                    )}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-gray-500">{formatDateTime(order.createdAt)}</p>
                    <span className="text-sm font-semibold text-primary">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="flex-shrink-0 text-gray-300 transition group-hover:text-primary"
                />
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}