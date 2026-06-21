"use client";

import Link from "next/link";
import { UserCircle, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import NavLinks from "./NavLinks";
import ProfileDropdown from "@/components/auth/ProfileDropdown";
import { openAuthModal } from "@/store/slices/authSlice";

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo-icon.svg"
            alt="Velora Logo"
            className="h-10 w-auto md:h-12 transition-all"
          />
        </Link>

        <nav className="hidden md:block">
          <NavLinks mode="desktop" />
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <ProfileDropdown />
          ) : (
            <button
              type="button"
              onClick={() => dispatch(openAuthModal("login"))}
              aria-label="Account"
              className="p-2 text-slate-700 hover:text-primary transition-colors"
            >
              <UserCircle size={22} />
            </button>
          )}

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-2 text-slate-700 hover:text-primary transition-colors"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <div className="md:hidden">
            <NavLinks mode="mobile-trigger" />
          </div>
        </div>
      </div>
    </header>
  );
}