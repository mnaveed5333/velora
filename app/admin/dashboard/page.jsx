"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");

        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load users.");
          setLoading(false);
          return;
        }

        setUsers(data.users);
        setLoading(false);
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

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
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">
            {users.length} registered {users.length === 1 ? "user" : "users"}
          </p>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {users.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-sm text-gray-500">No registered users yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-4 py-3 text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-700">{u.email}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {u.isAdmin ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          Admin
                        </span>
                      ) : (
                        <span className="text-gray-400">Customer</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}