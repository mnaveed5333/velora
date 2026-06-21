"use client";

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

export default function OrderDetails({
  order,
  contact,
  onContactChange,
  onVerify,
  onShip,
  verifying,
  shipping,
}) {
  const isPaid = order.paymentStatus === "paid";
  const isCod = order.paymentMethod === "cod";
  const canShip = isPaid || isCod;
  const isShipped = order.status === "shipped";

  return (
    <div className="border-t border-dashed border-gray-200 bg-bg-secondary px-6 py-6 pl-7">
      <div className="grid gap-6 sm:grid-cols-2">
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

        <div>
          <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
            Items
          </h4>
          <div className="divide-y divide-gray-200">
            {order.items.map((item, i) => {
              const variant = [item.size, item.color].filter(Boolean).join(", ");
              return (
                <div key={i} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-ink">
                    {item.name}
                    {variant && <span className="text-gray-500"> ({variant})</span>}
                    <span className="text-gray-500"> × {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-ink">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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

      {/* Shipping Section */}
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
    </div>
  );
}