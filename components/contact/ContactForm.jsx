"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";

const ADMIN_WHATSAPP = "9231539533"; // +92 315 1639533, no plus/spaces for wa.me

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    comment: "",
    save: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          comment: formData.comment,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Build a wa.me link pre-filled with the customer's message so they
      // can send it themselves from their own WhatsApp in one tap.
      const prefilled = `Hi, I'm ${formData.name}. ${formData.comment}`;
      const link = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(prefilled)}`;
      setWhatsappLink(link);

      setSuccess(true);
      setFormData({ name: "", email: "", whatsapp: "", comment: "", save: false });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {success && (
        <div className="rounded-lg bg-bg-secondary px-4 py-4 text-sm text-primary">
          <p className="mb-3">Thanks for reaching out — your message has been received.</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle size={16} />
            Continue on WhatsApp
          </a>
        </div>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <input
        type="text"
        name="name"
        placeholder="Name *"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full rounded-lg border border-rose-100 bg-white/60 px-4 py-3 text-sm placeholder-gray-500 focus:border-red-600 focus:outline-none"
      />
      <input
        type="email"
        name="email"
        placeholder="Email *"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full rounded-lg border border-rose-100 bg-white/60 px-4 py-3 text-sm placeholder-gray-500 focus:border-red-600 focus:outline-none"
      />
      <input
        type="tel"
        name="whatsapp"
        placeholder="WhatsApp Number * (e.g. +923001234567)"
        value={formData.whatsapp}
        onChange={handleChange}
        required
        className="w-full rounded-lg border border-rose-100 bg-white/60 px-4 py-3 text-sm placeholder-gray-500 focus:border-red-600 focus:outline-none"
      />
      <textarea
        name="comment"
        placeholder="Comment *"
        value={formData.comment}
        onChange={handleChange}
        required
        rows={5}
        className="w-full resize-none rounded-lg border border-rose-100 bg-white/60 px-4 py-3 text-sm placeholder-gray-500 focus:border-red-600 focus:outline-none"
      />
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="save"
          checked={formData.save}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
        />
        Save my name, email and website in this browser
      </label>
      <div>
        <Button type="submit" disabled={loading} className="uppercase tracking-wide">
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
}