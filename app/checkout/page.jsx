"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import CartSteps from "@/components/cart/CartSteps";
import BillingForm from "@/components/checkout/BillingForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { clearCart } from "@/store/slices/cartSlice";

const initialForm = {
  email: "",
  firstName: "",
  lastName: "",
  companyName: "",
  country: "",
  streetAddress: "",
  apartment: "",
  city: "",
  state: "",
  pinCode: "",
  phoneCountryCode: "92",
  phoneNumber: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const [form, setForm] = useState(initialForm);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Auto-fill email from logged-in user's account, locked in BillingForm
  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const validate = () => {
    const required = ["email", "firstName", "lastName", "country", "streetAddress", "city"];
    if (required.some((f) => !form[f]?.trim())) {
      setError("Please fill in all required billing details.");
      return false;
    }
    if ((form.phoneNumber || "").replace(/\D/g, "").length < 6) {
      setError("Please enter a valid phone number.");
      return false;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (method = "cod") => {
    setSubmitAttempted(true);
    setError("");
    if (!validate()) return;

    const fullPhone = `+${form.phoneCountryCode}${form.phoneNumber}`;
    setPlacing(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: fullPhone,
          items,
          subtotal,
          paymentMethod: method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order.");

      dispatch(clearCart());
      router.push("/user/orders");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setPlacing(false);
    }
  };

  const handleGoToTransfer = () => {
    setSubmitAttempted(true);
    setError("");
    if (!validate()) return;

    const fullPhone = `+${form.phoneCountryCode}${form.phoneNumber}`;
    sessionStorage.setItem(
      "pendingTransferOrder",
      JSON.stringify({
        items,
        subtotal,
        billingData: { ...form, phone: fullPhone },
      })
    );
    router.push("/checkout/transfer");
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 lg:px-8">
        <p className="text-slate-500">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-ink">Checkout</h1>
        <CartSteps currentStep={2} />
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <BillingForm
          form={form}
          onChange={setForm}
          submitAttempted={submitAttempted}
          isLoggedIn={isLoggedIn}
        />
        <OrderSummary
          items={items}
          subtotal={subtotal}
          onPlaceOrder={handlePlaceOrder}
          onGoToTransfer={handleGoToTransfer}
          placing={placing}
        />
      </div>
    </main>
  );
}