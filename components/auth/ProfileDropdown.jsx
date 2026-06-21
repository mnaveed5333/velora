"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/store/slices/authSlice";

export default function ProfileDropdown() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-red-600 font-semibold text-white"
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            fill
            sizes="36px"
            className="object-cover"
            unoptimized
          />
        ) : (
          user.name?.charAt(0).toUpperCase()
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
          <p className="truncate border-b border-gray-100 px-4 py-2 text-sm text-gray-500">
            {user.email}
          </p>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
          >
            My Account
          </Link>
          
          <button
            onClick={() => {
              dispatch(logout());
              setOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}