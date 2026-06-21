"use client";

import OrderRow from "./OrderRow";

export default function OrdersTable({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
        <p className="text-sm text-gray-500">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {orders.map((order) => (
        <div
          key={order._id}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white"
        >
          <OrderRow order={order} />
        </div>
      ))}
    </div>
  );
}