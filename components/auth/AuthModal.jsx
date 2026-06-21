"use client";

import { useSelector, useDispatch } from "react-redux";
import { closeAuthModal } from "@/store/slices/authSlice";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function AuthModal() {
  const { isAuthModalOpen, authView } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!isAuthModalOpen) return null;

  const handleClose = () => dispatch(closeAuthModal());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-md bg-gray-100 p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-2xl leading-none text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        {authView === "login" && <LoginForm />}
        {authView === "signup" && <SignupForm />}
        {authView === "forgot" && <ForgotPasswordForm />}
      </div>
    </div>
  );
}