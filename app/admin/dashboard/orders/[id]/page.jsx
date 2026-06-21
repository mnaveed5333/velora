"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import OrderDetails from "@/components/admin/OrderDetails";

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [verifying, setVerifying] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        if (res.status === 401) {
          router.push("/admin/login");
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

  const handleVerify = async (orderId) => {
    setVerifying(true);
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
      // Update local state immediately — UI reflects the change with no delay.
      setOrder((prev) => ({ ...prev, ...data.order }));
      // Refresh the cached orders list in the background so it's correct
      // when the admin navigates back. Not awaited — doesn't block the UI.
      router.refresh();
    } catch {
      alert("Something went wrong verifying this order.");
    } finally {
      setVerifying(false);
    }
  };

  const handleShip = async (orderId) => {
    if (!contact.name.trim() || !contact.phone.trim()) {
      alert("Please enter a contact name and phone number.");
      return;
    }
    setShipping(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactName: contact.name, contactPhone: contact.phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to mark as shipped.");
      } else {
        setOrder((prev) => ({ ...prev, ...data.order }));
        setContact({ name: "", phone: "" });
        router.refresh();
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setShipping(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/delete`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete order.");
        return;
      }
      router.push("/admin/dashboard/orders");
    } catch {
      alert("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader />
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <AdminHeader />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <p className="mb-4 text-sm text-gray-500">{error || "Order not found."}</p>
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard/orders")}
            className="text-sm font-semibold text-primary hover:underline"
          >
            ← Back to orders
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/orders")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-primary"
        >
          <ArrowLeft size={15} />
          Back to orders
        </button>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <h1 className="mt-1 text-xl font-semibold text-ink">
            {order.firstName} {order.lastName}
          </h1>
          <p className="mt-0.5 text-sm text-gray-600">
            {order.email} · {order.phone}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <OrderDetails
            order={order}
            contact={contact}
            onContactChange={(field, value) =>
              setContact((prev) => ({ ...prev, [field]: value }))
            }
            onVerify={handleVerify}
            onShip={handleShip}
            verifying={verifying}
            shipping={shipping}
            onDelete={handleDelete}
            deleting={deleting}
          />
        </div>
      </div>
    </>
  );
}