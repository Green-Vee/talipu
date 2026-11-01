"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Clock,
  ArrowRight,
  RefreshCw,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  tracking_code: string;
  customer_name: string;
  phone: string;
  product_name: string;
  price: number;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic Dashboard Stats
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [totalProductsCount, setTotalProductsCount] = useState<number>(0);
  const [totalCustomersCount, setTotalCustomersCount] = useState<number>(0);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    setLoading(true);

    // 1. Fetch Orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!ordersError && orders) {
      setRecentOrders(orders); // Set all orders so the container can scroll smoothly

      let revenue = 0;
      let pending = 0;
      const uniqueCustomers = new Set<string>();

      orders.forEach((order) => {
        const price = Number(order.price) || 0;
        revenue += price;

        const st = order.status?.toLowerCase() || "pending";
        if (["pending", "confirmed", "baking"].includes(st)) {
          pending += 1;
        }

        if (order.phone) {
          uniqueCustomers.add(order.phone.trim());
        }
      });

      setTotalRevenue(revenue);
      setPendingOrdersCount(pending);
      setTotalCustomersCount(uniqueCustomers.size);
    }

    // 2. Fetch Products Count
    const { count: productsCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (productsCount !== null) {
      setTotalProductsCount(productsCount);
    }

    setLoading(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "baking":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "ready":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

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

        {/* Locked Container Viewport */}
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 overflow-hidden">
          {/* Fixed Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Bakery Overview
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Welcome back! Here is what&apos;s happening at Talipu Bakery
                today.
              </p>
            </div>

            <button
              onClick={fetchDashboardMetrics}
              disabled={loading}
              className="flex items-center gap-2 bg-white border border-pink-100 hover:bg-pink-50 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh Data
            </button>
          </div>

          {/* Fixed Metric Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 flex-shrink-0">
            {/* Card 1 */}
            <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-500 font-semibold truncate">
                  Total Revenue
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div>
                <p className="text-base md:text-xl font-black text-gray-900 truncate">
                  MK {loading ? "..." : totalRevenue.toLocaleString()}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold hidden sm:block truncate">
                  Gross earnings
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-500 font-semibold truncate">
                  Pending Orders
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} />
                </div>
              </div>
              <div>
                <p className="text-base md:text-xl font-black text-gray-900">
                  {loading ? "..." : pendingOrdersCount}
                </p>
                <p className="text-[10px] text-amber-600 font-semibold hidden sm:block truncate">
                  Needs baking
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-500 font-semibold truncate">
                  Customers
                </span>
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                  <Users size={16} />
                </div>
              </div>
              <div>
                <p className="text-base md:text-xl font-black text-gray-900">
                  {loading ? "..." : totalCustomersCount}
                </p>
                <p className="text-[10px] text-pink-600 font-semibold hidden sm:block truncate">
                  Unique buyers
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-500 font-semibold truncate">
                  Menu Items
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Package size={16} />
                </div>
              </div>
              <div>
                <p className="text-base md:text-xl font-black text-gray-900">
                  {loading ? "..." : totalProductsCount}
                </p>
                <p className="text-[10px] text-purple-600 font-semibold hidden sm:block truncate">
                  Active cakes
                </p>
              </div>
            </div>
          </div>

          {/* INDEPENDENTLY SCROLLABLE LOWER PANELS */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 min-h-0 overflow-hidden">
            {/* Panel 1: RECENT ORDERS (Independent internal scrollbar) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-pink-100 shadow-sm p-4 md:p-5 flex flex-col min-h-0">
              <div className="flex items-center justify-between pb-3 border-b border-pink-50 flex-shrink-0">
                <div>
                  <h2 className="text-sm md:text-base font-bold text-gray-900">
                    Recent Orders
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Scroll through incoming submissions
                  </p>
                </div>
                <Link
                  href="/orders"
                  className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 transition"
                >
                  View All Orders <ArrowRight size={14} />
                </Link>
              </div>

              {/* Internal Scroll Container */}
              <div className="flex-1 overflow-y-auto pt-3 pr-1 space-y-2.5">
                {loading ? (
                  <p className="text-xs text-gray-400 py-6 text-center">
                    Loading recent orders...
                  </p>
                ) : recentOrders.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">
                    No orders logged yet.
                  </p>
                ) : (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => router.push(`/admin/orders`)}
                      className="flex items-center justify-between bg-pink-50/40 p-3 rounded-xl border border-pink-50 text-xs hover:border-pink-200 transition cursor-pointer"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 truncate">
                            {order.customer_name}
                          </span>
                          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-pink-100 text-pink-600 font-bold flex-shrink-0">
                            {order.tracking_code}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">
                          {order.product_name}
                        </p>
                      </div>

                      <div className="text-right space-y-1 flex-shrink-0">
                        <p className="font-bold text-gray-900">
                          MK {Number(order.price).toLocaleString()}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${getStatusBadgeColor(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Panel 2: QUICK OPERATIONS (Independent internal scrollbar) */}
            <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 md:p-5 flex flex-col justify-between min-h-0">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="pb-3 border-b border-pink-50 flex-shrink-0">
                  <h2 className="text-sm md:text-base font-bold text-gray-900">
                    Quick Operations
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Shortcuts for store administration
                  </p>
                </div>

                {/* Internal Scroll Container for Operations */}
                <div className="flex-1 overflow-y-auto pt-3 pr-1 space-y-2.5">
                  <Link
                    href="/products?action=add"
                    className="w-full flex items-center justify-between bg-pink-50 hover:bg-pink-100/70 p-3.5 rounded-xl border border-pink-100 text-xs font-bold text-pink-700 transition"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Plus size={16} className="flex-shrink-0" /> Add New Cake
                      to Store
                    </span>
                    <ArrowRight size={14} className="flex-shrink-0" />
                  </Link>

                  <Link
                    href="/orders"
                    className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-700 transition"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <ShoppingBag size={16} className="flex-shrink-0" /> Manage
                      Customer Orders
                    </span>
                    <ArrowRight size={14} className="flex-shrink-0" />
                  </Link>

                  <Link
                    href="/customers"
                    className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-700 transition"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Users size={16} className="flex-shrink-0" /> View
                      Customers & VIP Status
                    </span>
                    <ArrowRight size={14} className="flex-shrink-0" />
                  </Link>
                </div>
              </div>

              <div className="pt-3 border-t border-pink-50 flex-shrink-0 mt-2">
                <p className="text-[10px] text-gray-400 text-center truncate">
                  Talipu Bakery Management Console • Supabase Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
