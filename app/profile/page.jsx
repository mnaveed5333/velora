"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { updateUser } from "@/store/slices/authSlice";

export default function ProfilePage() {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState("");
  const [nameStatus, setNameStatus] = useState({ loading: false, error: "", success: "" });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: "", success: "" });

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarStatus, setAvatarStatus] = useState({ loading: false, error: "" });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.avatarUrl) setAvatarUrl(user.avatarUrl);
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  const handleNameSave = async () => {
    setNameStatus({ loading: true, error: "", success: "" });

    if (!name.trim()) {
      setNameStatus({ loading: false, error: "Name cannot be empty.", success: "" });
      return;
    }

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setNameStatus({ loading: false, error: data.error || "Failed to update name.", success: "" });
        return;
      }

      setNameStatus({ loading: false, error: "", success: "Name updated." });
      setIsEditingName(false);
      dispatch(updateUser({ name: name.trim() }));
    } catch (err) {
      setNameStatus({ loading: false, error: "Something went wrong. Please try again.", success: "" });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, error: "", success: "" });

    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ loading: false, error: "All fields are required.", success: "" });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({
        loading: false,
        error: "New password must be at least 8 characters.",
        success: "",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ loading: false, error: "New passwords do not match.", success: "" });
      return;
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordStatus({ loading: false, error: data.error || "Failed to update password.", success: "" });
        return;
      }

      setPasswordStatus({ loading: false, error: "", success: "Password updated successfully." });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setShowPasswordForm(false), 1500);
    } catch (err) {
      setPasswordStatus({ loading: false, error: "Something went wrong. Please try again.", success: "" });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarStatus({ loading: true, error: "" });

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setAvatarStatus({ loading: false, error: data.error || "Failed to upload avatar." });
        return;
      }

      setAvatarUrl(data.avatarUrl);
      dispatch(updateUser({ avatarUrl: data.avatarUrl }));
      setAvatarStatus({ loading: false, error: "" });
    } catch (err) {
      setAvatarStatus({ loading: false, error: "Something went wrong. Please try again." });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Velora
        </p>
        <h1 className="text-2xl font-semibold text-ink">My Account</h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Identity header */}
        <div className="flex items-center gap-4 bg-bg-secondary px-6 py-6">
          <div className="relative">
            <button
              onClick={handleAvatarClick}
              disabled={avatarStatus.loading}
              className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary text-2xl font-semibold text-white"
              title="Change profile picture"
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={user.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 text-xs font-semibold uppercase tracking-wide text-white opacity-0 transition group-hover:bg-ink/50 group-hover:opacity-100">
                {avatarStatus.loading ? "…" : "Edit"}
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-ink">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            {avatarStatus.error && (
              <p className="mt-1 text-xs font-medium text-primary">{avatarStatus.error}</p>
            )}
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-5">
            {/* Full Name - editable */}
            <div className="border-b border-dashed border-gray-200 pb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                Full Name
              </p>
              {isEditingName ? (
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleNameSave}
                      disabled={nameStatus.loading}
                      className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {nameStatus.loading ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setName(user.name);
                        setNameStatus({ loading: false, error: "", success: "" });
                      }}
                      className="rounded-full border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm text-ink">{user.name}</p>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs font-bold uppercase tracking-wide text-primary hover:text-primary-hover"
                  >
                    Edit
                  </button>
                </div>
              )}
              {nameStatus.error && (
                <p className="mt-1.5 text-sm font-medium text-primary">{nameStatus.error}</p>
              )}
              {nameStatus.success && (
                <p className="mt-1.5 text-sm font-medium text-emerald-700">{nameStatus.success}</p>
              )}
            </div>

            {/* Email - read only */}
            <div className="border-b border-dashed border-gray-200 pb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                Email Address
              </p>
              <p className="mt-1 text-sm text-ink">{user.email}</p>
            </div>

            {user.createdAt && (
              <div className="border-b border-dashed border-gray-200 pb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                  Member Since
                </p>
                <p className="mt-1 text-sm text-ink">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            {/* Password */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
                Password
              </p>
              <p className="mt-1 text-sm text-ink">••••••••</p>
              <button
                onClick={() => setShowPasswordForm((v) => !v)}
                className="mt-1.5 text-xs font-bold uppercase tracking-wide text-primary hover:text-primary-hover"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="mt-4 space-y-3 rounded-md bg-bg-secondary p-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, newPassword: e.target.value }))
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))
                      }
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                    />
                  </div>

                  {passwordStatus.error && (
                    <p className="text-sm font-medium text-primary">{passwordStatus.error}</p>
                  )}
                  {passwordStatus.success && (
                    <p className="text-sm font-medium text-emerald-700">{passwordStatus.success}</p>
                  )}

                  <button
                    type="submit"
                    disabled={passwordStatus.loading}
                    className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {passwordStatus.loading ? "Updating…" : "Update Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}