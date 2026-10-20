"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import { Users, Heart, Star, Mail } from "lucide-react";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const customers = [
    {
      id: 1,
      name: "Olivia Chen",
      email: "olivia@gmail.com",
      orders: 12,
      totalSpent: "$340.00",
      tier: "VIP Customer",
    },
    {
      id: 2,
      name: "Liam Smith",
      email: "liam.smith@yahoo.com",
      orders: 5,
      totalSpent: "$128.50",
      tier: "Regular",
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma_w@outlook.com",
      orders: 8,
      totalSpent: "$210.00",
      tier: "VIP Customer",
    },
    {
      id: 4,
      name: "Sophia Taylor",
      email: "sophia.t@gmail.com",
      orders: 2,
      totalSpent: "$58.00",
      tier: "New",
    },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FDF0F3] text-gray-800 font-sans flex relative">
      {/* Clean Sidebar - No props required */}
      <Sidebar />

      <main className="flex-1 flex flex-col h-full min-w-0">
        <TopBar
          title="Customers"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={() => {}}
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-pink-100 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
                  <Users size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Total Customers
                  </p>
                  <p className="text-xl font-bold">482</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  <Star size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    VIP Members
                  </p>
                  <p className="text-xl font-bold">64</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                  <Heart size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Repeat Order Rate
                  </p>
                  <p className="text-xl font-bold">78%</p>
                </div>
              </div>
            </div>

            {/* Customer List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {customers
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.email.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm flex items-center justify-between hover:shadow-md transition duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-lg shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{c.name}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail size={12} /> {c.email}
                        </p>
                        <span className="inline-block mt-2 text-[10px] bg-pink-50 text-pink-600 font-bold px-2.5 py-0.5 rounded-full border border-pink-100">
                          {c.tier}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-extrabold text-pink-600">
                        {c.totalSpent}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {c.orders} Orders
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
