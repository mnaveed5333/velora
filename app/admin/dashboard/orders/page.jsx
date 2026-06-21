"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function fetchOrders({ silent = false } = {}) {
    try {
      if (silent) {
        setRefreshing(true);
      }
      const res = await fetch("/api/admin/orders");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load orders.");
        return;
      }
      setError("");
      setOrders(data.orders || []);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  // Handles the order returned by /ship, merges it into state
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
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Customer Information
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {orders.length} {orders.length === 1 ? "order" : "orders"} submitted
            </p>
          </div>

          {/* Manual refresh — picks up customer-submitted reviews and any
              other changes made outside this tab (e.g. on /user/orders) */}
          <button
            type="button"
            onClick={() => fetchOrders({ silent: true })}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
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