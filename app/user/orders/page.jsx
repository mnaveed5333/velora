"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Truck, Package, Search, X, Star } from "lucide-react";

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

const isHex = (v) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v?.trim());

function OrderReviewForm({ order, onSubmitted }) {
  const [received, setReceived] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [issue, setIssue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!order?._id) {
      setError("Something went wrong identifying this order. Please refresh the page.");
      return;
    }

    if (!rating) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${order._id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ received, rating, issue }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error("Server returned an unexpected response.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit.");
      }

      // Close the form immediately on success — the parent's hasReview
      // check will take over and show its own "thanks" confirmation.
      setJustSubmitted(true);
      onSubmitted(data.order);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Hide instantly on success so the form never lingers after submit.
  if (justSubmitted) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 space-y-3 rounded-md border border-dashed border-gray-300 bg-bg-secondary px-4 py-4"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
          How was your order?
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Please only fill this out once your order has actually been received.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={received}
          onChange={(e) => setReceived(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        I received my order
      </label>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className="p-0.5"
          >
            <Star
              size={20}
              className={
                star <= (hoverRating || rating)
                  ? "fill-primary text-primary"
                  : "fill-transparent text-gray-300"
              }
            />
          </button>
        ))}
      </div>

      <textarea
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        rows={2}
        placeholder="Any issue with your order? (optional)"
        className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-ink placeholder:text-gray-400 focus:border-primary focus:outline-none"
      />

      {error && <p className="text-xs text-primary">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Feedback"}
      </button>
    </form>
  );
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

  const handleReviewSubmitted = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o))
    );
  };

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
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const paymentMethod = order.paymentMethod || "cod";
            const isTransfer = paymentMethod === "transfer";
            const isPendingVerification = isTransfer && order.paymentStatus === "pending";
            const isVerified = isTransfer && order.paymentStatus === "paid";
            const isShipped = order.status === "shipped";
            const hasReview = !!order.review?.submittedAt;

            return (
              <div
                key={order._id}
                className="relative overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${getSpineColor(order.status)}`}
                />

                <div className="px-6 py-5 pl-7">
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

                  {/* Completion form / confirmation */}
                  {isShipped && (
                    hasReview ? (
                      <div className="mb-4 flex items-start gap-2.5 rounded-md bg-bg-secondary px-4 py-3 text-sm text-ink">
                        <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
                        <span>
                          Thanks for your feedback — you rated this order{" "}
                          {order.review.rating}/5
                          {order.review.received === false &&
                            " and noted you hadn't received it"}
                          .
                        </span>
                      </div>
                    ) : (
                      <OrderReviewForm order={order} onSubmitted={handleReviewSubmitted} />
                    )
                  )}

                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                    Order Details
                  </div>

                  <div className="divide-y divide-gray-100">
                    {order.items.map((item, i) => {
                      const matches = query && item.name.toLowerCase().includes(query);
                      return (
                        <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                          <span className={`flex flex-wrap items-center gap-1.5 ${matches ? "font-semibold text-primary" : "text-ink"}`}>
                            {item.name}
                            {item.size && (
                              <span className="inline-flex items-center rounded border border-gray-200 bg-bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
                                {item.size}
                              </span>
                            )}
                            {item.color && (
                              isHex(item.color) ? (
                                <span
                                  className="inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full border border-black/10 shadow-sm"
                                  style={{ backgroundColor: item.color.trim() }}
                                  title={item.color}
                                />
                              ) : (
                                <span className="text-[11px] text-gray-500">{item.color}</span>
                              )
                            )}
                            <span className="text-gray-500"> × {item.quantity}</span>
                          </span>
                          <span className="font-medium text-ink">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

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