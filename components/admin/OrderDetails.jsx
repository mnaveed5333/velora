"use client";

import { Star } from "lucide-react";
import PaymentScreenshotCard from "./PaymentScreenshotCard";

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

const isHex = (v) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v?.trim());

export default function OrderDetails({
  order,
  contact,
  onContactChange,
  onVerify,
  onShip,
  verifying,
  shipping,
  onDelete,
  deleting,
}) {
  const isPaid = order.paymentStatus === "paid";
  const isCod = order.paymentMethod === "cod";
  const canShip = isPaid || isCod;
  const isShipped = order.status === "shipped";
  const hasReview = !!order.review?.submittedAt;

  return (
    <div className="border-t border-dashed border-gray-200 bg-bg-secondary px-6 py-6 pl-7">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Billing */}
        <div>
          <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
            Billing Address
          </h4>
          <p className="text-sm leading-relaxed text-ink">
            {order.firstName} {order.lastName}
            {order.companyName && <><br />{order.companyName}</>}
            <br />
            {order.streetAddress}
            {order.apartment && <>, {order.apartment}</>}
            <br />
            {order.city}, {order.state} {order.pinCode}
            <br />
            {order.country}
            <br />
            {order.phone}
          </p>
          {order.notes && (
            <>
              <h4 className="mb-1 mt-4 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                Notes
              </h4>
              <p className="text-sm text-ink">{order.notes}</p>
            </>
          )}
        </div>

        {/* Items */}
        <div>
          <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
            Items
          </h4>
          <div className="divide-y divide-gray-200">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="flex flex-wrap items-center gap-1.5 text-ink">
                  {item.name}
                  {item.size && (
                    <span className="inline-flex items-center rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-gray-500">
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
                  <span className="text-gray-400">× {item.quantity}</span>
                </span>
                <span className="whitespace-nowrap font-semibold text-ink">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Screenshot */}
      {order.paymentMethod === "transfer" && (
        <div className="mt-6 border-t border-dashed border-gray-200 pt-5">
          <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
            Payment Screenshot
          </h4>
          <PaymentScreenshotCard
            orderId={order._id}
            screenshotUrl={order.paymentScreenshot}
          />
          <div className="mt-4">
            {order.paymentStatus === "paid" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                Verified
                {order.verifiedAt && (
                  <span className="font-medium normal-case tracking-normal">
                    · {formatDateTime(order.verifiedAt)}
                  </span>
                )}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onVerify(order._id)}
                disabled={verifying}
                className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {verifying ? "Verifying…" : "Verify Payment"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Shipping */}
      <div className="mt-6 border-t border-dashed border-gray-200 pt-5">
        <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
          Shipping
        </h4>
        {isShipped ? (
          <div className="rounded-md border border-primary bg-white px-4 py-3.5 text-sm">
            <p className="font-semibold text-ink">
              Shipped
              {order.shippedAt && ` ${formatDateTime(order.shippedAt)}`}
            </p>
            {order.shippingContact?.name && (
              <p className="mt-1.5 text-ink">
                Contact for tracking — {order.shippingContact.name} ·{" "}
                {order.shippingContact.phone}
              </p>
            )}
          </div>
        ) : canShip ? (
          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Contact person name"
                value={contact.name}
                onChange={(e) => onContactChange("name", e.target.value)}
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-gray-400 focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Contact phone number"
                value={contact.phone}
                onChange={(e) => onContactChange("phone", e.target.value)}
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-gray-400 focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => onShip(order._id)}
              disabled={shipping}
              className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {shipping ? "Marking…" : "Mark as Shipped"}
            </button>
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-600">
            Waiting on payment verification before this order can ship.
          </p>
        )}
      </div>

      {/* Customer Feedback */}
      {hasReview && (
        <div className="mt-6 border-t border-dashed border-gray-200 pt-5">
          <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
            Customer Feedback
          </h4>
          <div className="rounded-md border border-gray-200 bg-white px-4 py-3.5 text-sm">
            <p className="mb-1.5 font-semibold text-ink">
              {order.review.received
                ? "Customer confirmed receipt"
                : "Customer did not confirm receipt"}
            </p>
            <div className="mb-1.5 flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  className={
                    star <= order.review.rating
                      ? "fill-primary text-primary"
                      : "fill-transparent text-gray-300"
                  }
                />
              ))}
            </div>
            {order.review.issue && (
              <p className="mt-2 text-ink">{order.review.issue}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              Submitted {formatDateTime(order.review.submittedAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDelete(order._id)}
            disabled={deleting}
            className="mt-4 rounded-full border border-red-300 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete Order"}
          </button>
        </div>
      )}
    </div>
  );
}