"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface WelcomeModalProps {
  onStartNewOrder?: () => void;
}

export default function WelcomeModal({ onStartNewOrder }: WelcomeModalProps) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false)
  const [isReturning, setIsReturning] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const nameFromUrl = searchParams.get("name");
    const storedName = localStorage.getItem("talipu_user_name");
    const name = nameFromUrl || storedName;

    const hasSeenModal = sessionStorage.getItem("talipu_welcome_seen");

    setTimeout(() => {
      if (name) {
        // Stage 2: Returning Customer with Name
        setIsReturning(true);
        setUserName(name);
        if (!hasSeenModal) setIsOpen(true);
      } else {
        // Stage 1: First-Time Customer Greeting
        setIsReturning(false);
        if (!hasSeenModal) setIsOpen(true);
      }
    }, 0);
  }, [searchParams]);

  const handleClose = () => {
    sessionStorage.setItem("talipu_welcome_seen", "true");
    setIsOpen(false);
    if (onStartNewOrder) onStartNewOrder();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-amber-100 text-center">
        {!isReturning ? (
          /* --- STAGE 1: FIRST-TIME CUSTOMER --- */
          <>
            <div className="text-4xl mb-3">🧁</div>
            <h2 className="text-2xl font-bold text-amber-900">
              Welcome to Talipu Bakery!
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Baked fresh daily with love and the finest ingredients. Whether
              you’re celebrating a special milestone or craving a sweet treat,
              we’re honored to be part of your day!
            </p>
            

            <button
              onClick={handleClose}
              className="mt-6 w-full rounded-xl bg-amber-600 py-3 font-semibold text-white shadow-md hover:bg-amber-700 transition"
            >
              Explore Our Menu ✨
            </button>
          </>
        ) : (
          /* --- STAGE 2: RETURNING CUSTOMER --- */
          <>
            <div className="text-4xl mb-3">👋</div>
            <h2 className="text-2xl font-bold text-amber-900">
              Welcome back, {userName}!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              It’s great to see you again! How can we make your day sweet today?
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleClose}
                className="w-full rounded-xl bg-amber-600 py-3 font-semibold text-white shadow-md hover:bg-amber-700 transition"
              >
                Make Another Order 🎂
              </button>

              <button
                onClick={() => {
                  handleClose();
                  // Trigger order tracking logic / drawer
                }}
                className="w-full rounded-xl bg-amber-50 py-3 font-semibold text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
              >
                Track Existing Order 🚚
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
