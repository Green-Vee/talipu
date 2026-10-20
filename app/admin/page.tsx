"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import {
  ShoppingBag,
  Clock,
  DollarSign,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Low Stock Alert: Strawberry Delight is down to 8kg",
      time: "10 mins ago",
      type: "warning",
      read: false,
    },
    {
      id: 2,
      title: "New order #CB1024 received from Olivia Chen",
      time: "45 mins ago",
      type: "info",
      read: false,
    },
    {
      id: 3,
      title: "Daily sales target of $4,000 achieved!",
      time: "2 hours ago",
      type: "success",
      read: true,
    },
  ]);

  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FDF0F3] text-gray-800 font-sans flex relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-full min-w-0">
        <TopBar
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={markAllAsRead}
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto w-full space-y-8">
            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-4">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Total Orders
                  </p>
                  <p className="text-xl font-extrabold text-gray-900">128</p>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    +12% from last week
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Pending Cakes
                  </p>
                  <p className="text-xl font-extrabold text-gray-900">24</p>
                  <span className="text-[11px] text-amber-600 font-semibold">
                    -3 since yesterday
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                  <DollarSign size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Revenue</p>
                  <p className="text-xl font-extrabold text-gray-900">$4,820</p>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    +8% from last week
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Low Stock Items
                  </p>
                  <p className="text-xl font-extrabold text-gray-900">5</p>
                  <span className="text-[11px] text-red-500 font-semibold">
                    Needs restock
                  </span>
                </div>
              </div>
            </div>

            {/* DASHBOARD OVERVIEW / RECENT SALES CARD */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Sales Overview
                </h2>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                  <TrendingUp size={14} /> +8% vs previous week
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Total sales this week:{" "}
                <strong className="text-gray-900">$4,820</strong>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
