"use client";

import { useState } from "react";
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
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-bg-secondary md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-bg-secondary text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-ink"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/admin/dashboard/products/new"
            onClick={() => setMobileOpen(false)}
            className="mt-1 flex items-center gap-2.5 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <Plus size={16} />
            Upload
          </Link>

          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="mt-1 flex items-center gap-2.5 rounded-md border-t border-gray-100 px-3 py-2.5 pt-3.5 text-sm font-medium text-gray-500 hover:text-primary"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}