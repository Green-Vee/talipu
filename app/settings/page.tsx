"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import { Store, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FDF0F3] text-gray-800 font-sans flex relative">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full min-w-0">
        <TopBar
          title="Settings"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={() => {}}
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Bakery Profile */}
            <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-pink-100">
                <Store className="text-pink-600" size={20} />
                <h2 className="font-bold text-lg text-gray-900">
                  Bakery Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    defaultValue="TALIPU Bakery"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@talipu.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-pink-100">
                <Bell className="text-pink-600" size={20} />
                <h2 className="font-bold text-lg text-gray-900">
                  Notifications Settings
                </h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-pink-50/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    Email alerts for low stock items
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-pink-500 w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-pink-50/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    Desktop sound for new orders
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-pink-500 w-4 h-4"
                  />
                </label>
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-pink-200">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
