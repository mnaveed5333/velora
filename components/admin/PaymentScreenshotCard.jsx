"use client";

import { useState } from "react";
import { ImageOff, Download } from "lucide-react";

export default function PaymentScreenshotCard({ orderId, screenshotUrl }) {
  const [downloading, setDownloading] = useState(false);

  // Cloudinary URLs are cross-origin, so a plain <a download> just opens
  // the image instead of saving it. Fetching as a blob first forces a
  // real download regardless of origin.
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(screenshotUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `payment-screenshot-${orderId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch {
      alert("Couldn't download the screenshot. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (!screenshotUrl) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-500">
        <ImageOff size={15} />
        No screenshot uploaded.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] text-gray-500">Click image to download</span>
      </div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="group relative block w-full overflow-hidden rounded-md border border-gray-200 bg-white disabled:cursor-wait"
      >
        <img
          src={screenshotUrl}
          alt="Payment proof — click to download"
          className="max-h-80 w-full object-contain transition group-hover:opacity-80"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink">
            <Download size={14} />
            {downloading ? "Downloading…" : "Download"}
          </span>
        </span>
      </button>
    </div>
  );
}