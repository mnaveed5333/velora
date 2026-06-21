"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.status === 401) {
        router.push("/admin/login");
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
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [router]);

  const handleVerify = async (orderId) => {
    try {
      const res = await fetch("/api/admin/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to verify order.");
        return;
      }
      await fetchOrders();
    } catch {
      alert("Something went wrong verifying this order.");
    }
  };

  // ✅ NEW: handles the order returned by /ship, merges it into state
  const handleOrderUpdated = (orderId, updatedOrder) => {
    if (!updatedOrder) {
      fetchOrders();
      return;
    }
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, ...updatedOrder } : o))
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Customer Information
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {orders.length} {orders.length === 1 ? "order" : "orders"} submitted
          </p>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <OrdersTable
          orders={orders}
          onVerify={handleVerify}
          onShipped={handleOrderUpdated}
        />
      </div>
    </>
  );
}