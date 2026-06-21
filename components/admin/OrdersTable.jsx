"use client";

import { useState } from "react";
import OrderRow from "./OrderRow";
import OrderDetails from "./OrderDetails";

export default function OrdersTable({ orders, onVerify, onShipped }) {
  const [expandedId, setExpandedId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [shippingId, setShippingId] = useState(null);
  const [contactInputs, setContactInputs] = useState({});

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
        <p className="text-sm text-gray-500">No orders yet.</p>
      </div>
    );
  }

  const handleVerify = async (orderId) => {
    setVerifyingId(orderId);
    await onVerify(orderId);
    setVerifyingId(null);
  };

  const getContact = (orderId) =>
    contactInputs[orderId] || { name: "", phone: "" };

  const setContactField = (orderId, field, value) => {
    setContactInputs((prev) => ({
      ...prev,
      [orderId]: {
        ...getContact(orderId),
        [field]: value,
      },
    }));
  };

  const handleShip = async (orderId) => {
    const { name, phone } = getContact(orderId);
    if (!name.trim() || !phone.trim()) {
      alert("Please enter a contact name and phone number.");
      return;
    }
    setShippingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactName: name, contactPhone: phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to mark as shipped.");
      } else {
        onShipped && onShipped(orderId, data.order);
        setContactInputs((prev) => {
          const next = { ...prev };
          delete next[orderId];
          return next;
        });
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setShippingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* gap-5 = 20px between order cards */}
      {orders.map((order) => {
        const isExpanded = expandedId === order._id;
        const contact = getContact(order._id);

        return (
          <div
            key={order._id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <OrderRow
              order={order}
              isExpanded={isExpanded}
              onToggle={() => setExpandedId(isExpanded ? null : order._id)}
            />
            {isExpanded && (
              <OrderDetails
                order={order}
                contact={contact}
                onContactChange={(field, value) =>
                  setContactField(order._id, field, value)
                }
                onVerify={handleVerify}
                onShip={handleShip}
                verifying={verifyingId === order._id}
                shipping={shippingId === order._id}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}