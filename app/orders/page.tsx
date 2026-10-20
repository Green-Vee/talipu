"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
} from "lucide-react";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const orders = [
    {
      id: "#ORD-1024",
      customer: "Olivia Chen",
      items: "2x Chocolate Decadence",
      total: "$56.00",
      status: "Completed",
      date: "Today, 2:30 PM",
    },
    {
      id: "#ORD-1025",
      customer: "Liam Smith",
      items: "1x Strawberry Delight",
      total: "$24.50",
      status: "Pending",
      date: "Today, 1:15 PM",
    },
    {
      id: "#ORD-1026",
      customer: "Emma Wilson",
      items: "1x Vanilla Dream, 1x Red Velvet",
      total: "$61.99",
      status: "Processing",
      date: "Today, 11:40 AM",
    },
    {
      id: "#ORD-1027",
      customer: "Noah Davis",
      items: "3x Red Velvet Royale",
      total: "$89.97",
      status: "Completed",
      date: "Yesterday",
    },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FDF0F3] text-gray-800 font-sans flex relative">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full min-w-0">
        <TopBar
          title="Orders"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={() => {}}
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-pink-100 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Total Orders
                  </p>
                  <p className="text-xl font-bold">1,248</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-pink-100 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Pending Delivery
                  </p>
                  <p className="text-xl font-bold">14</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-pink-100 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Completed Today
                  </p>
                  <p className="text-xl font-bold">38</p>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-pink-100 text-gray-500 uppercase text-[11px] tracking-wider">
                      <th className="pb-3 px-2">Order ID</th>
                      <th className="pb-3 px-2">Customer</th>
                      <th className="pb-3 px-2">Items</th>
                      <th className="pb-3 px-2">Total</th>
                      <th className="pb-3 px-2">Status</th>
                      <th className="pb-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-pink-50/30 transition"
                      >
                        <td className="py-3.5 px-2 font-bold text-gray-900">
                          {order.id}
                        </td>
                        <td className="py-3.5 px-2 font-medium">
                          {order.customer}
                        </td>
                        <td className="py-3.5 px-2 text-gray-600">
                          {order.items}
                        </td>
                        <td className="py-3.5 px-2 font-extrabold text-pink-600">
                          {order.total}
                        </td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              order.status === "Completed"
                                ? "bg-emerald-50 text-emerald-600"
                                : order.status === "Pending"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <button className="p-2 text-gray-400 hover:text-pink-600 rounded-lg hover:bg-pink-50 transition">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
