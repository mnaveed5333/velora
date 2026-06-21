"use client";

import { useState } from "react";
import { Trash2, Mail, MailOpen, MessageCircle } from "lucide-react";

export default function ContactSubmissionsTable({ submissions: initial }) {
  const [submissions, setSubmissions] = useState(initial);
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleExpand = async (sub) => {
    const opening = expandedId !== sub._id;
    setExpandedId(opening ? sub._id : null);

    if (opening && !sub.read) {
      try {
        const res = await fetch(`/api/admin/contact/${sub._id}`, { method: "PUT" });
        if (res.ok) {
          setSubmissions((prev) =>
            prev.map((s) => (s._id === sub._id ? { ...s, read: true } : s))
          );
        }
      } catch (err) {
        // non-critical — read status failing to update doesn't block viewing
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this submission?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert("Failed to delete submission.");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  };

  // Strips everything but digits so the wa.me link works regardless of
  // how the customer typed their number (+92 315..., 0092315..., spaces, dashes).
  const toWaLink = (rawNumber) => {
    const digits = rawNumber.replace(/[^0-9]/g, "");
    return `https://wa.me/${digits}`;
  };

  if (submissions.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 bg-white py-16 text-center">
        <p className="text-sm text-gray-500">No contact submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <ul className="divide-y divide-gray-100">
        {submissions.map((sub) => {
          const expanded = expandedId === sub._id;
          return (
            <li key={sub._id}>
              <button
                onClick={() => handleExpand(sub)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {sub.read ? (
                    <MailOpen size={15} className="flex-shrink-0 text-gray-400" />
                  ) : (
                    <Mail size={15} className="flex-shrink-0 text-primary" />
                  )}
                  <div className="overflow-hidden">
                    <p
                      className={`truncate text-sm ${
                        sub.read ? "font-medium text-gray-700" : "font-semibold text-gray-900"
                      }`}
                    >
                      {sub.name}{" "}
                      <span className="font-normal text-gray-400">— {sub.email}</span>
                    </p>
                    {!expanded && (
                      <p className="truncate text-xs text-gray-400">{sub.comment}</p>
                    )}
                  </div>
                </div>
                <span className="flex-shrink-0 text-xs text-gray-400">
                  {new Date(sub.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </button>

              {expanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="whitespace-pre-wrap text-sm text-gray-700">{sub.comment}</p>

                  {sub.whatsapp && (
                    <p className="mt-2 text-xs text-gray-500">
                      WhatsApp: <span className="font-medium text-gray-700">{sub.whatsapp}</span>
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a
                      href={`mailto:${sub.email}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Reply via email
                    </a>

                    {sub.whatsapp && (
                      <a
                        href={toWaLink(sub.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-[#25D366] hover:underline"
                      >
                        <MessageCircle size={12} />
                        Message on WhatsApp
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(sub._id)}
                      disabled={deletingId === sub._id}
                      className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}