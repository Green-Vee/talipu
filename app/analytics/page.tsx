"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import { TrendingUp, Award, DollarSign, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FDF0F3] text-gray-800 font-sans flex relative">
      {/* Sidebar without props */}
      <Sidebar />

      <main className="flex-1 flex flex-col h-full min-w-0">
        <TopBar
          title="Analytics"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={() => {}}
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-extrabold text-pink-600 mt-1">
                  $18,420.00
                </p>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2">
                  <TrendingUp size={14} /> +14.2% vs last month
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">
                  Avg. Order Value
                </p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">
                  $38.50
                </p>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2">
                  <TrendingUp size={14} /> +3.1% vs last month
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">Best Seller</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  Chocolate Decadence
                </p>
                <span className="text-xs text-pink-600 font-medium flex items-center gap-1 mt-2">
                  <Award size={14} /> 142 Cakes Sold
                </span>
              </div>
            </div>

            {/* Revenue Growth Chart Card */}
            <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Revenue Performance
                  </h2>
                  <p className="text-xs text-gray-500">
                    Monthly overview of total sales
                  </p>
                </div>
                <span className="text-xs bg-pink-50 text-pink-600 font-semibold px-3 py-1 rounded-full border border-pink-100">
                  Year 2026
                </span>
              </div>

              {/* Visual Bars */}
              <div className="h-56 flex items-end justify-between gap-3 pt-8 px-4 border-b border-pink-100">
                {[40, 65, 55, 80, 95, 70, 85, 100, 90, 110, 120, 105].map(
                  (val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                    >
                      <div className="text-[10px] text-pink-600 font-bold opacity-0 group-hover:opacity-100 transition">
                        ${val * 150}
                      </div>
                      <div
                        className="w-full bg-pink-400 hover:bg-pink-500 rounded-t-lg transition duration-200"
                        style={{ height: `${val}%` }}
                      />
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {
                          [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ][idx]
                        }
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
