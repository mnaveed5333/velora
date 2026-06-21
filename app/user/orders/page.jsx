"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Truck, Package, Search, X } from "lucide-react";

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

  // Match orders where ANY item's name contains the search term
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

      {/* Search by product name */}
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
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const paymentMethod = order.paymentMethod || "cod";
            const isTransfer = paymentMethod === "transfer";
            const isPendingVerification = isTransfer && order.paymentStatus === "pending";
            const isVerified = isTransfer && order.paymentStatus === "paid";
            const isShipped = order.status === "shipped";

            return (
              <div
                key={order._id}
                className="relative overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                {/* Status spine — the signature element. Quiet at rest,
                    full wine once shipped. Replaces the generic badge pill. */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${getSpineColor(order.status)}`}
                />

                <div className="px-6 py-5 pl-7">
                  {/* Header */}
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-dashed border-gray-200 pb-4">
                    <div>
                      <p className="font-mono text-xs tracking-wide text-gray-500">
                        ORDER #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink">
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                  </div>

                  {/* Status messages */}
                  {isPendingVerification && (
                    <div className="mb-4 flex items-start gap-2.5 rounded-md bg-bg-secondary px-4 py-3 text-sm text-ink">
                      <Clock size={15} className="mt-0.5 shrink-0 text-primary" />
                      <span>
                        Your payment screenshot has been received. We're verifying
                        it — this usually takes a few hours.
                      </span>
                    </div>
                  )}

                  {isVerified && (
                    <div className="mb-4 flex items-start gap-2.5 rounded-md bg-bg-secondary px-4 py-3 text-sm text-ink">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
                      <span>
                        Payment verified
                        {order.verifiedAt && ` on ${formatDateTime(order.verifiedAt)}`}.
                        Your order is now being processed.
                      </span>
                    </div>
                  )}

                  {isShipped && (
                    <div className="mb-4 flex items-start gap-2.5 rounded-md bg-bg-secondary px-4 py-3 text-sm text-ink">
                      <Truck size={15} className="mt-0.5 shrink-0 text-primary" />
                      <div>
                        <p>
                          Your order has been shipped
                          {order.shippedAt && ` on ${formatDateTime(order.shippedAt)}`}.
                        </p>
                        {order.shippingContact?.name && (
                          <p className="mt-1.5 font-medium text-ink">
                            Contact for tracking — {order.shippingContact.name} ·{" "}
                            {order.shippingContact.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                    Order Details
                  </div>

                  <div className="divide-y divide-gray-100">
                    {order.items.map((item, i) => {
                      const variant = [item.size, item.color].filter(Boolean).join(", ");
                      const matches = query && item.name.toLowerCase().includes(query);
                      return (
                        <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                          <span className={matches ? "font-semibold text-primary" : "text-ink"}>
                            {item.name}
                            {variant && <span className="text-gray-500"> ({variant})</span>}
                            <span className="text-gray-500"> × {item.quantity}</span>
                          </span>
                          <span className="font-medium text-ink">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-dashed border-gray-200 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink">
                      {isTransfer ? "Bank Transfer" : paymentMethod.toUpperCase()}
                    </span>
                    <span className="text-xl font-semibold text-primary">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}