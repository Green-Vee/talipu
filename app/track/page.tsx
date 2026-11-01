"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface OrderDetails {
  tracking_code: string;
  customer_name: string;
  product_name: string;
  size: string;
  price: number;
  status: string;
  delivery_date: string;
  custom_message?: string;
}

const STAGES = [
  { key: "Pending", label: "Received", note: "Sent via WhatsApp" },
  { key: "Confirmed", label: "Confirmed", note: "Order approved" },
  { key: "Baking", label: "In Oven 🥖", note: "Preparing bake" },
  { key: "Ready", label: "Ready 🎂", note: "Ready for you" },
];

export default function TrackPage() {
  const [code, setCode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("talipu_tracking_code") || "";
    }
    return "";
  });
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (searchCode: string) => {
    const cleanCode = searchCode.trim().toUpperCase();
    if (!cleanCode) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchErr } = await supabase
      .from("orders")
      .select("*")
      .eq("tracking_code", cleanCode)
      .single();

    if (fetchErr || !data) {
      setError("No order found with that code.");
      setOrder(null);
    } else {
      setOrder(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const savedCode = localStorage.getItem("talipu_tracking_code");
    if (savedCode) {
      setTimeout(() => {
        fetchOrder(savedCode);
      }, 0);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(code);
  };

  const currentStageIndex = STAGES.findIndex(
    (s) => s.key.toLowerCase() === order?.status?.toLowerCase(),
  );

  return (
    <main className="min-h-screen bg-[#110806] text-[#F3E8DF] flex flex-col justify-center items-center p-4">
      <div className="max-w-xl w-full bg-[#1C0D0A] border border-[#E5C396]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        {/* Header with Personalized Greeting */}
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFE3AC] font-bold block">
            Talipu Bakery Live Tracker
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#FFF5EA]">
            {order ? `Welcome ${order.customer_name}!` : "Track Your Order"}
          </h1>
          {order && (
            <p className="text-xs text-[#E5C396]/80">
              Here is your order progress:
            </p>
          )}
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. BAKE-4821"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-[#110806] border border-[#E5C396]/30 rounded-xl px-4 py-2.5 text-[#FFF5EA] text-xs outline-none focus:border-[#FFE3AC] transition uppercase tracking-wider"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#FFE3AC] via-[#D4A359] to-[#996A22] text-[#110806] font-bold text-xs px-5 py-2.5 rounded-xl hover:brightness-110 transition cursor-pointer"
          >
            {loading ? "..." : "Track"}
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-400 text-center bg-red-950/40 py-2 rounded-lg border border-red-500/30">
            {error}
          </p>
        )}

        {/* Order Details & Horizontal Progress Bar */}
        {order && (
          <div className="space-y-6 pt-4 border-t border-[#E5C396]/20">
            {/* Summary Card */}
            <div className="bg-[#110806] p-4 rounded-2xl border border-[#E5C396]/20 space-y-2 text-xs">
              <div className="flex justify-between text-[#E5C396] font-bold">
                <span>{order.tracking_code}</span>
                <span>Delivery: {order.delivery_date}</span>
              </div>
              <h2 className="text-sm font-bold text-[#FFF5EA]">
                {order.product_name}
              </h2>
              <p className="text-[#E5C396]/80 text-[11px]">
                Size: {order.size}
              </p>
              {order.custom_message && (
                <p className="text-slate-400 text-[11px] italic">
                  &quot;{order.custom_message}&quot;
                </p>
              )}
            </div>

            {/* Horizontal Timeline */}
            <div className="py-4">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-2 left-[10%] right-[10%] h-0.5 bg-[#E5C396]/20 -z-0" />

                {STAGES.map((stage, idx) => {
                  const activeIndex =
                    currentStageIndex !== -1 ? currentStageIndex : 0;
                  const isComplete = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;

                  return (
                    <div
                      key={stage.key}
                      className="relative z-10 flex flex-col items-center flex-1 text-center"
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                          isComplete
                            ? "bg-[#FFE3AC] border-[#FFE3AC] shadow-[0_0_10px_#FFE3AC]"
                            : "bg-[#1C0D0A] border-[#E5C396]/30"
                        }`}
                      />
                      <p
                        className={`text-[11px] font-bold mt-2 leading-tight ${
                          isCurrent
                            ? "text-[#FFE3AC]"
                            : isComplete
                              ? "text-[#FFF5EA]"
                              : "text-slate-500"
                        }`}
                      >
                        {stage.label}
                      </p>
                      <p className="text-[9px] text-[#E5C396]/60 mt-0.5 max-w-[70px] hidden sm:block">
                        {stage.note}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Return to Shop Button */}
        <div className="pt-6 border-t border-[#E5C396]/20 text-center space-y-2">
          <p className="text-xs text-[#E5C396]/70">
            Want to add another cake or pastry to your queue?
          </p>
          <Link
            href="/"
            className="inline-block bg-[#110806] border border-[#E5C396]/40 text-[#FFE3AC] hover:bg-[#FFE3AC] hover:text-[#110806] text-xs font-bold px-6 py-2.5 rounded-xl transition-all duration-300"
          >
            ← Make Another Order
          </Link>
        </div>
      </div>
    </main>
  );
}
