"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import { supabase } from "@/lib/supabase";
import {
  TrendingUp,
  Clock,
  PieChart as PieIcon,
  MessageSquare,
  Award,
  RefreshCw,
  Calendar,
  Sparkles,
} from "lucide-react";

interface Order {
  id: string;
  tracking_code: string;
  customer_name: string;
  phone: string;
  product_name: string;
  size: string;
  price: number;
  status: string;
  custom_message?: string;
  created_at: string;
}

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<string>("Analytics");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic Calculated Analytics
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(0);
  const [bestSeller, setBestSeller] = useState<{ name: string; count: number }>(
    {
      name: "N/A",
      count: 0,
    },
  );

  // Insights Breakdowns
  const [sizeBreakdown, setSizeBreakdown] = useState<{ [key: string]: number }>(
    {},
  );
  const [dayOfWeekStats, setDayOfWeekStats] = useState<{
    [key: string]: number;
  }>({});
  const [customMessageCount, setCustomMessageCount] = useState<number>(0);
  const [recentCustomMessages, setRecentCustomMessages] = useState<string[]>(
    [],
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    calculateAnalytics();
  }, []);

  const calculateAnalytics = async () => {
    setLoading(true);

    const { data: orders, error } = await supabase.from("orders").select("*");

    if (!error && orders && orders.length > 0) {
      let revenue = 0;
      const productCounts: { [key: string]: number } = {};
      const sizes: { [key: string]: number } = {};
      const days: { [key: string]: number } = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      };
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      let msgCount = 0;
      const messages: string[] = [];

      orders.forEach((order: Order) => {
        const price = Number(order.price) || 0;
        revenue += price;

        // Best seller count
        const pName = order.product_name || "Custom Cake";
        productCounts[pName] = (productCounts[pName] || 0) + 1;

        // Size breakdown
        const sizeKey = order.size || "Standard";
        sizes[sizeKey] = (sizes[sizeKey] || 0) + 1;

        // Day of week peak calculation
        if (order.created_at) {
          const date = new Date(order.created_at);
          const dayName = dayNames[date.getDay()];
          days[dayName] = (days[dayName] || 0) + 1;
        }

        // Custom messages highlight
        if (order.custom_message && order.custom_message.trim().length > 0) {
          msgCount += 1;
          if (messages.length < 6) {
            messages.push(order.custom_message);
          }
        }
      });

      // Find top product
      let topProd = "N/A";
      let topCount = 0;
      Object.entries(productCounts).forEach(([name, count]) => {
        if (count > topCount) {
          topCount = count;
          topProd = name;
        }
      });

      setTotalRevenue(revenue);
      setAvgOrderValue(Math.round(revenue / orders.length));
      setBestSeller({ name: topProd, count: topCount });
      setSizeBreakdown(sizes);
      setDayOfWeekStats(days);
      setCustomMessageCount(msgCount);
      setRecentCustomMessages(messages);
    }

    setLoading(false);
  };

  const totalOrdersCount = Object.values(sizeBreakdown).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FDF0F3] text-gray-800 font-sans flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <TopBar
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={markAllAsRead}
        />

        {/* LOCKED MAIN VIEWPORT */}
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 overflow-hidden">
          {/* Fixed Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Performance & Bakery Insights
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Data-driven metrics calculated directly from customer order
                history
              </p>
            </div>

            <button
              onClick={calculateAnalytics}
              className="flex items-center gap-2 bg-white border border-pink-100 hover:bg-pink-50 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh Metrics
            </button>
          </div>

          {/* Fixed Top Executive Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 flex-shrink-0">
            {/* Card 1: Total Revenue */}
            <div className="bg-white p-4 md:p-5 rounded-2xl border border-pink-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0">
                <TrendingUp size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-semibold truncate">
                  Gross Revenue
                </p>
                <p className="text-lg md:text-xl font-black text-gray-900 truncate">
                  MK {loading ? "..." : totalRevenue.toLocaleString()}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium truncate">
                  Total sales recorded
                </p>
              </div>
            </div>

            {/* Card 2: Average Order Value */}
            <div className="bg-white p-4 md:p-5 rounded-2xl border border-pink-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl flex-shrink-0">
                <PieIcon size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-semibold truncate">
                  Avg Order Value (AOV)
                </p>
                <p className="text-lg md:text-xl font-black text-gray-900 truncate">
                  MK {loading ? "..." : avgOrderValue.toLocaleString()}
                </p>
                <p className="text-[10px] text-purple-600 font-medium truncate">
                  Average spent per cake
                </p>
              </div>
            </div>

            {/* Card 3: Most Popular Cake */}
            <div className="bg-white p-4 md:p-5 rounded-2xl border border-pink-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0">
                <Award size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-semibold truncate">
                  Top Bestseller
                </p>
                <p className="text-sm md:text-base font-extrabold text-gray-900 truncate">
                  {loading ? "..." : bestSeller.name}
                </p>
                <p className="text-[10px] text-amber-600 font-medium truncate">
                  {bestSeller.count} total orders placed
                </p>
              </div>
            </div>
          </div>

          {/* INDEPENDENTLY SCROLLABLE INSIGHTS GRID */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Insight 1: Ordering Peak Days (Day-by-Day Activity) */}
              <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-pink-50">
                  <div>
                    <h2 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                      <Calendar size={18} className="text-pink-500" />
                      Weekly Order Peak Heatmap
                    </h2>
                    <p className="text-[11px] text-gray-400">
                      Identifies which days experience the highest customer
                      demand
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-pink-50 text-pink-700 px-3 py-1 rounded-xl text-xs font-semibold border border-pink-100">
                    <Clock size={14} className="text-pink-500" />
                    <span>Peak Tracking Active</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => {
                      const count = dayOfWeekStats[day] || 0;
                      const max = Math.max(...Object.values(dayOfWeekStats), 1);
                      const percentage = Math.round((count / max) * 100);

                      return (
                        <div key={day} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-gray-700">
                            <span>{day}</span>
                            <span>
                              {count} Order{count !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-pink-50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-pink-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Insight 2: Size & Tier Demand Breakdown */}
              <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-pink-50">
                  <div>
                    <h2 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles size={18} className="text-purple-500" />
                      Cake Size Preference Breakdown
                    </h2>
                    <p className="text-[11px] text-gray-400">
                      Shows what proportions of Small, Medium, or Large sizes
                      sell best
                    </p>
                  </div>
                </div>

                {Object.keys(sizeBreakdown).length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">
                    No size data logged yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(sizeBreakdown).map(([size, count]) => {
                      const percentage = Math.round(
                        (count / totalOrdersCount) * 100,
                      );

                      return (
                        <div
                          key={size}
                          className="bg-purple-50/40 p-3.5 rounded-xl border border-purple-50 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-xs text-gray-900">
                              {size}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {count} orders placed
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-purple-700">
                              {percentage}%
                            </span>
                            <p className="text-[9px] text-purple-500 font-semibold">
                              of menu orders
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Insight 3: Custom Piping Message Trends */}
            <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-pink-50">
                <div>
                  <h2 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare size={18} className="text-amber-500" />
                    Custom Piping Text & Message Requests
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    {customMessageCount} out of {totalOrdersCount} orders
                    requested custom cake messages (
                    {totalOrdersCount > 0
                      ? Math.round(
                          (customMessageCount / totalOrdersCount) * 100,
                        )
                      : 0}
                    %)
                  </p>
                </div>
              </div>

              {recentCustomMessages.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  No custom messages recorded yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {recentCustomMessages.map((msg, i) => (
                    <div
                      key={i}
                      className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-xs italic text-gray-700"
                    >
                      &quot;{msg}&quot;
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
