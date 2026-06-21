"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";

export default function ProcessingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const orderId = params.orderId;
  const [statusText, setStatusText] = useState("Confirming your payment…");

  useEffect(() => {
    if (!orderId) {
      router.replace("/checkout");
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    async function poll() {
      attempts += 1;
      try {
        const res = await fetch("/api/payments/safepay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = await res.json();

        if (data.status === "paid") {
          dispatch(clearCart());
          router.replace("/checkout/success");
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setStatusText(
            "Still confirming your payment — this can take a moment. You can check your order status shortly."
          );
        }
      } catch {
        setStatusText("Something went wrong confirming your payment.");
      }
    }

    poll();
  }, [orderId, router, dispatch]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-slate-500">{statusText}</p>
    </main>
  );
}