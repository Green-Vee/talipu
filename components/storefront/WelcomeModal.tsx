"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function WelcomeModal() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Valued Customer");

  useEffect(() => {
    const nameFromUrl = searchParams.get("name");
    const storedName = localStorage.getItem("talipu_user_name");
    const name = nameFromUrl || storedName || "Valued Customer";

    if (nameFromUrl) {
      localStorage.setItem("talipu_user_name", nameFromUrl);
    }

    const hasSeenModal = sessionStorage.getItem("talipu_welcome_seen");

    // Wrap state updates in setTimeout to defer them and avoid cascading renders
    setTimeout(() => {
      setUserName(name);
      if (!hasSeenModal) {
        setIsOpen(true);
      }
    }, 0);
  }, [searchParams]);

  const handleClose = () => {
    sessionStorage.setItem("talipu_welcome_seen", "true");
    setIsOpen(false);
  };

  // If modal shouldn't be open yet, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-amber-100 text-center">
        <h2 className="text-2xl font-bold text-amber-900">
          Welcome back, {userName}! 👋
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We’re glad to see you back at Talipu Bakery. How can we help you
          today?
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleClose}
            className="w-full rounded-xl bg-amber-600 py-3 font-semibold text-white shadow-md hover:bg-amber-700 transition"
          >
            Make Another Order 🎂
          </button>

          <button
            onClick={handleClose}
            className="w-full rounded-xl bg-amber-50 py-3 font-semibold text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
          >
            Track Existing Order 🚚
          </button>
        </div>
      </div>
    </div>
  );
}
