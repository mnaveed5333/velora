"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";
import { UploadCloud, X, ImageIcon } from "lucide-react";

const BANK_DETAILS = {
  accountTitle: "Your Name / Business Name",
  accountNumber: "0000000000000",
  bankName: "Bank Name Here",
  iban: "PK00BANK0000000000000000",
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function TransferPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [pendingOrder, setPendingOrder] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("pendingTransferOrder");
    if (!stored) {
      router.replace("/checkout");
      return;
    }
    setPendingOrder(JSON.parse(stored));
  }, [router]);

  // Avoid leaking object URLs across re-renders/unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      e.target.value = "";
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image is too large. Please keep it under 4MB.");
      e.target.value = "";
      return;
    }

    setError("");
    try {
      const base64 = await fileToBase64(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setScreenshot(base64);
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    } catch {
      setError("Couldn't read that file. Please try again.");
    }
  };

  const handleRemoveScreenshot = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setScreenshot(null);
    setFileName("");
    setPreviewUrl("");
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      setError("Please upload a screenshot of your payment first.");
      return;
    }
    if (!pendingOrder) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/payments/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pendingOrder.billingData,
          items: pendingOrder.items,
          subtotal: pendingOrder.subtotal,
          screenshot,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit order.");

      sessionStorage.removeItem("pendingTransferOrder");
      dispatch(clearCart());
      router.push("/user/orders");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!pendingOrder) return null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-ink">Bank Account Transfer</h1>

      <div className="mb-8 rounded-xl border border-slate-200 bg-bg-secondary p-6">
        <h2 className="mb-4 text-lg font-semibold text-ink">Transfer to this account</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Account Title</dt>
            <dd className="font-medium text-ink">{BANK_DETAILS.accountTitle}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Account Number</dt>
            <dd className="font-medium text-ink">{BANK_DETAILS.accountNumber}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Bank Name</dt>
            <dd className="font-medium text-ink">{BANK_DETAILS.bankName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">IBAN</dt>
            <dd className="font-medium text-ink">{BANK_DETAILS.iban}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2">
            <dt className="font-semibold text-ink">Amount to transfer</dt>
            <dd className="font-bold text-primary">${pendingOrder.subtotal.toFixed(2)}</dd>
          </div>
        </dl>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-ink">
          Upload payment screenshot *
        </label>

        {!previewUrl ? (
          <label
            htmlFor="screenshot-upload"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-center transition hover:border-primary hover:bg-bg-secondary"
          >
            <UploadCloud size={28} className="text-slate-400" />
            <span className="text-sm font-medium text-ink">
              Click to upload, or drag and drop
            </span>
            <span className="text-xs text-slate-400">PNG or JPG, up to 4MB</span>
            <input
              id="screenshot-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-bg-secondary px-4 py-2 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-ink">
                <ImageIcon size={16} className="shrink-0 text-slate-400" />
                <span className="truncate">{fileName}</span>
              </span>
              <button
                type="button"
                onClick={handleRemoveScreenshot}
                className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50"
              >
                <X size={14} /> Remove
              </button>
            </div>
            <img
              src={previewUrl}
              alt="Payment screenshot preview"
              className="max-h-64 w-full object-contain bg-white"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !screenshot}
        className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Order for Verification"}
      </button>
    </main>
  );
}