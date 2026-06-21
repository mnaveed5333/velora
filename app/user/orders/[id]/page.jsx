"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, Clock, Truck, Package,
  Star, MapPin, CreditCard,
} from "lucide-react";

const isHex = (v) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v?.trim());

const NAMED_COLORS = [
  ["Black", "#000000"], ["White", "#FFFFFF"], ["Slate Grey", "#6B7280"],
  ["Light Grey", "#BEBEBE"], ["Charcoal", "#2F2F2F"], ["Almost Black", "#1C1C1C"],
  ["Oatmeal", "#D9C7A8"], ["Camel", "#C9A66B"], ["Taupe", "#8B7E66"],
  ["Cognac Brown", "#6B4226"], ["Dark Brown", "#3B2417"],
  ["Navy Blue", "#1E3A5F"], ["Dark Slate Blue", "#1E2A38"], ["Steel Blue", "#4A6B8A"],
  ["Deep Indigo", "#050D85"],
  ["Dark Green", "#006400"], ["Sage Green", "#8C9A8C"],
  ["Red", "#DB0A0A"], ["Brick Red", "#B4282D"], ["Maroon", "#8B0000"],
  ["Wine", "#6E1423"], ["Burgundy", "#9C2B3C"], ["Deep Rose", "#8B2942"],
  ["Silver", "#C0C0C0"],
];

function closestColorName(hex) {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return null;
  let closest = null;
  let bestDist = Infinity;
  for (const [name, candidateHex] of NAMED_COLORS) {
    const c = candidateHex.replace("#", "");
    const cr = parseInt(c.slice(0, 2), 16);
    const cg = parseInt(c.slice(2, 4), 16);
    const cb = parseInt(c.slice(4, 6), 16);
    const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      closest = name;
    }
  }
  return closest;
}

const STATUS_LABEL = {
  pending: "Pending Verification",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STEPS = ["processing", "shipped", "completed"];

function formatDateTime(dateString) {
  const d = new Date(dateString);
  const datePart = d.toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "short", day: "numeric",
  });
  const timePart = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${datePart} at ${timePart}`;
}

function StatusTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-500">
        <Package size={15} />
        This order was cancelled.
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(status === "pending" ? "processing" : status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = currentIdx >= i;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                  done ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide ${
                  done ? "text-ink" : "text-gray-400"
                }`}
              >
                {STATUS_LABEL[step]}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-2 h-0.5 flex-1 ${currentIdx > i ? "bg-primary" : "bg-gray-100"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

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
      } catch {
        throw new Error("Server returned an unexpected response.");
      }
      if (!res.ok) throw new Error(data.error || "Failed to submit.");
      setJustSubmitted(true);
      onSubmitted(data.order);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (justSubmitted) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-dashed border-gray-300 bg-bg-secondary px-5 py-5"
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
              size={22}
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
        rows={3}
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

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/user/orders/${id}`);
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.status === 404) {
          setError("Order not found.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load order.");
          setLoading(false);
          return;
        }
        setOrder(data.order);
        setLoading(false);
      } catch {
        setError("Something went wrong.");
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-sm tracking-wide text-gray-500">Loading order…</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <Package className="mx-auto mb-3 text-gray-400" size={28} strokeWidth={1.5} />
        <p className="mb-4 text-sm text-gray-500">{error || "Order not found."}</p>
        <button
          type="button"
          onClick={() => router.push("/user/orders")}
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Back to orders
        </button>
      </main>
    );
  }

  const paymentMethod = order.paymentMethod || "cod";
  const isTransfer = paymentMethod === "transfer";
  const isPendingVerification = isTransfer && order.paymentStatus === "pending";
  const isVerified = isTransfer && order.paymentStatus === "paid";
  const isShipped = order.status === "shipped";
  const hasReview = !!order.review?.submittedAt;

  const handleReviewSubmitted = (updatedOrder) => {
    setOrder((prev) => ({ ...prev, ...updatedOrder }));
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => router.push("/user/orders")}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-primary"
      >
        <ArrowLeft size={15} />
        Back to orders
      </button>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-wide text-gray-500">
            ORDER #{order._id.slice(-8).toUpperCase()}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            {formatDateTime(order.createdAt)}
          </h1>
        </div>
        <span className="rounded-full bg-bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink">
          {STATUS_LABEL[order.status] || order.status}
        </span>
      </div>

      <div className="mb-8 rounded-lg border border-gray-200 bg-white px-6 py-6">
        <StatusTimeline status={order.status} />
      </div>

      <div className="mb-8 space-y-3">
        {isPendingVerification && (
          <div className="flex items-start gap-2.5 rounded-md bg-bg-secondary px-4 py-3 text-sm text-ink">
            <Clock size={15} className="mt-0.5 shrink-0 text-primary" />
            <span>
              Your payment screenshot has been received. We're verifying it — this
              usually takes a few hours.
            </span>
          </div>
        )}
        {isVerified && (
          <div className="flex items-start gap-2.5 rounded-md bg-bg-secondary px-4 py-3 text-sm text-ink">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
            <span>
              Payment verified{order.verifiedAt && ` on ${formatDateTime(order.verifiedAt)}`}.
              Your order is now being processed.
            </span>
          </div>
        )}
        {isShipped && (
          <div className="flex items-start gap-2.5 rounded-md bg-bg-secondary px-4 py-3 text-sm text-ink">
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
      </div>

      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">
            Items
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-bg-secondary">
                {item.image && (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {item.size && (
                    <span className="inline-flex items-center rounded border border-gray-200 bg-bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
                      {item.size}
                    </span>
                  )}
                  {item.color && (
                    isHex(item.color) ? (
                      <span className="inline-flex items-center gap-1">
                        <span
                          className="inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: item.color.trim() }}
                          title={item.color}
                        />
                        <span className="text-[11px] text-gray-500">
                          {closestColorName(item.color) || item.color}
                        </span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500">{item.color}</span>
                    )
                  )}
                  <span className="text-[11px] text-gray-400">× {item.quantity}</span>
                </div>
              </div>
              <span className="flex-shrink-0 text-sm font-semibold text-ink">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-gray-100 bg-bg-secondary px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-ink">${Number(order.subtotal ?? order.total).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2">
            <span className="text-sm font-semibold text-ink">Total</span>
            <span className="text-xl font-bold text-primary">
              ${Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white px-5 py-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <MapPin size={14} />
            Shipping to
          </div>
          <p className="text-sm font-medium text-ink">
            {order.firstName} {order.lastName}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {order.streetAddress}
            {order.apartment ? `, ${order.apartment}` : ""}
          </p>
          <p className="text-sm text-gray-500">
            {order.city}{order.state ? `, ${order.state}` : ""} {order.pinCode}
          </p>
          <p className="text-sm text-gray-500">{order.country}</p>
          {order.phone && <p className="mt-2 text-sm text-gray-500">{order.phone}</p>}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white px-5 py-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <CreditCard size={14} />
            Payment
          </div>
          <p className="text-sm font-medium text-ink">
            {isTransfer ? "Bank Transfer" : paymentMethod.toUpperCase()}
          </p>
          {isTransfer && (
            <p className="mt-1 text-sm text-gray-500">
              Status: {order.paymentStatus === "paid" ? "Verified" : "Pending verification"}
            </p>
          )}
          {order.notes && (
            <p className="mt-3 border-t border-dashed border-gray-200 pt-3 text-sm text-gray-500">
              <span className="font-medium text-ink">Note: </span>
              {order.notes}
            </p>
          )}
        </div>
      </div>

      {isShipped && (
        <div className="mb-4">
          {hasReview ? (
            <div className="flex items-start gap-2.5 rounded-md bg-bg-secondary px-4 py-3 text-sm text-ink">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary" />
              <span>
                Thanks for your feedback — you rated this order {order.review.rating}/5
                {order.review.received === false && " and noted you hadn't received it"}.
              </span>
            </div>
          ) : showReviewForm ? (
            <OrderReviewForm order={order} onSubmitted={handleReviewSubmitted} />
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-gray-300 bg-bg-secondary px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink">
                Once your order has arrived, let us know how it went.
              </p>
              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="shrink-0 rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover"
              >
                Order Completed — Leave Feedback
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}