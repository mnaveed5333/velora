"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Users, Package, ClipboardList, Newspaper, Mail, Plus, Menu, X } from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Users", href: "/admin/dashboard", icon: Users },
    { label: "Products", href: "/admin/dashboard/products", icon: Package },
    { label: "Orders", href: "/admin/dashboard/orders", icon: ClipboardList },
    { label: "Blog", href: "/admin/dashboard/blog", icon: Newspaper },
    { label: "Contact", href: "/admin/dashboard/contact", icon: Mail },
  ];

  const isActive = (href) =>
    href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Lock body scroll while the drawer is open, and allow Escape to close it
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
            V
          </div>
          <span className="text-base font-semibold text-ink">
            Velora <span className="font-normal text-gray-500">Admin</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-bg-secondary text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-ink"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/admin/dashboard/products/new"
            className="ml-2 flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Plus size={15} />
            Upload
          </Link>

          <button
            onClick={handleLogout}
            className="ml-3 flex items-center gap-1.5 border-l border-gray-200 pl-3 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
          >
            <LogOut size={15} />
            Logout
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-bg-secondary md:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Right-side slide-in drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
        className={`fixed inset-y-0 right-0 z-40 flex w-[78%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-500">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-bg-secondary hover:text-ink"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-bg-secondary text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-ink"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-2 border-t border-gray-200 px-3 py-4">
          <Link
            href="/admin/dashboard/products/new"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Plus size={16} />
            Upload
          </Link>

          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-bg-secondary hover:text-primary"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </header>
  );
}