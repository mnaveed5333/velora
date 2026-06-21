"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ContactSubmissionsTable from "@/components/admin/ContactSubmissionsTable";

export default function AdminContactPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch("/api/admin/contact");

        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load submissions.");
          setLoading(false);
          return;
        }

        setSubmissions(data.submissions);
        setLoading(false);
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <>
      <AdminHeader />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-semibold text-gray-900">Contact Submissions</h1>
          <p className="text-sm text-gray-500">
            {submissions.length} total
            {unreadCount > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <ContactSubmissionsTable submissions={submissions} />
      </div>
    </>
  );
}