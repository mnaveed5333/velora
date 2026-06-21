"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Centralized navigation configuration
const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/cart", label: "Cart" },
  { href: "/user/orders", label: "Orders" },
  { href: "/contact", label: "Contact" },
];

function NavLinksList({ mode = "desktop", onLinkClick }) {
  const pathname = usePathname();

  const containerClasses =
    mode === "mobile"
      ? "flex flex-col gap-1 w-full"
      : "flex items-center gap-8";

  return (
    <div className={containerClasses}>
      {links.map((link, i) => {
        const isActive = pathname === link.href;

        if (mode === "mobile") {
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={`group relative flex items-center py-4 transition-colors duration-200 ${
                isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
              style={{
                borderBottom: i === links.length - 1 ? "none" : "1px solid rgb(241 245 249)",
              }}
            >
              {/* Active indicator bar */}
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-slate-900 transition-all duration-200 ${
                  isActive ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-2"
                }`}
              />
              <span
                className={`text-[17px] tracking-tight transition-all duration-200 ${
                  isActive ? "font-semibold pl-5" : "font-medium pl-0 group-hover:pl-2"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={`text-base font-medium tracking-wide transition-colors ${
              isActive ? "text-primary font-semibold" : "text-slate-600 hover:text-black"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function NavLinks({ mode = "desktop", onLinkClick }) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  if (mode === "mobile-trigger") {
    return (
      <>
        {/* Hamburger / Close button */}
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
          className="relative z-50 flex h-10 w-10 items-center justify-center"
        >
          <span className="relative h-4 w-5 block">
            {/* Top bar */}
            <span
              className={`absolute left-0 top-0 h-[2px] w-5 bg-slate-900 rounded-full transition-all duration-300 ${
                isOpen ? "opacity-0 -translate-x-3" : "opacity-100 translate-x-0"
              }`}
            />
            {/* X - diagonal 1 (fades/scales in on open) */}
            <span
              className={`absolute left-0 top-[7px] h-[2px] w-5 bg-slate-900 rounded-full transition-all duration-300 origin-center ${
                isOpen ? "rotate-45 opacity-100" : "rotate-0 opacity-100"
              }`}
            />
            {/* X - diagonal 2 */}
            <span
              className={`absolute left-0 top-[7px] h-[2px] w-5 bg-slate-900 rounded-full transition-all duration-300 origin-center ${
                isOpen ? "-rotate-45 opacity-100" : "rotate-0 opacity-0"
              }`}
            />
            {/* Bottom bar */}
            <span
              className={`absolute left-0 bottom-0 h-[2px] w-5 bg-slate-900 rounded-full transition-all duration-300 ${
                isOpen ? "opacity-0 translate-x-3" : "opacity-100 translate-x-0"
              }`}
            />
          </span>
        </button>

        {/* Backdrop */}
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          className={`fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px] transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Drawer panel - half screen width, slides from right */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`fixed top-0 right-0 z-40 h-full w-1/2 min-w-[260px] max-w-[360px] bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col px-6 pt-20 pb-8">
            <NavLinksList mode="mobile" onLinkClick={() => setIsOpen(false)} />
          </div>
        </div>
      </>
    );
  }

  return <NavLinksList mode={mode} onLinkClick={onLinkClick} />;
}