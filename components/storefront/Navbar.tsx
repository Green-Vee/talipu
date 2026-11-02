"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<"order" | "track">("order");
  const [trackingCode, setTrackingCode] = useState("");
  const router = useRouter();

  // Auto-fill from localStorage if they've ordered before on this device
  useEffect(() => {
    const savedCode = localStorage.getItem("last_order_id");
    if (savedCode) {
      setTrackingCode(savedCode);
    }
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    router.push(`/track/${encodeURIComponent(trackingCode.trim())}`);
  };

  return (
    <section className="relative bg-amber-50/60 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl my-4 border border-amber-100/50">
      <div className="max-w-3xl mx-center text-center mx-auto space-y-6">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-950 tracking-tight">
          Freshly Baked Delights, <br />
          <span className="text-amber-600">Tracked Right to Your Door.</span>
        </h1>

        <p className="text-base sm:text-lg text-amber-900/80 max-w-xl mx-auto">
          Order custom cakes for any occasion, or enter your order code below to
          follow your cake’s progress in real-time.
        </p>

        {/* Dual Mode Switcher Card */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-amber-100 max-w-md mx-auto text-left space-y-4">
          {/* Tabs: Toggle between Ordering or Tracking */}
          <div className="flex bg-amber-100/60 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("order")}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === "order"
                  ? "bg-white text-amber-950 shadow-sm"
                  : "text-amber-800 hover:text-amber-950"
              }`}
            >
              🎂 Place an Order
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === "track"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-amber-800 hover:text-amber-950"
              }`}
            >
              📦 Track Existing Order
            </button>
          </div>

          {/* TAB 1: Order Mode */}
          {activeTab === "order" && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-200">
              <p className="text-xs text-gray-500">
                Ready to customize your cake? Explore our catalog or build your
                custom order.
              </p>
              <button
                onClick={() => {
                  const productsSection = document.getElementById("products");
                  productsSection?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition-colors text-sm text-center block"
              >
                Browse Cake Menu
              </button>
            </div>
          )}

          {/* TAB 2: Tracking Mode */}
          {activeTab === "track" && (
            <form
              onSubmit={handleTrackSubmit}
              className="space-y-3 pt-1 animate-in fade-in duration-200"
            >
              <div>
                <label className="block text-xs font-medium text-amber-900 mb-1">
                  Have an order reference code? (e.g. #1212)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter order code..."
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
                  >
                    Track
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-amber-800/70 italic">
                * Check your confirmation receipt or WhatsApp notification for
                your 4-digit order code.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
