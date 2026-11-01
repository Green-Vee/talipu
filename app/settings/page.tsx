"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import { Store, Bell, Mail, Volume2, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("Settings");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Settings State
  const [storeName, setStoreName] = useState<string>("TALIPU Bakery");
  const [contactEmail, setContactEmail] = useState<string>("admin@talipu.com");
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [desktopSound, setDesktopSound] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Settings panel loaded",
      time: "Just now",
      type: "info",
      read: false,
    },
  ]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
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

        {/* LOCKED MAIN VIEWPORT */}
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 overflow-hidden">
          {/* Fixed Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-950">
                Settings
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your bakery information, store preferences, and alert
                notifications
              </p>
            </div>

            {savedSuccess && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold animate-fadeIn">
                <CheckCircle2 size={16} /> Settings saved successfully!
              </div>
            )}
          </div>

          {/* INDEPENDENTLY SCROLLABLE SETTINGS FORM CONTAINER */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <form
              onSubmit={handleSaveSettings}
              className="max-w-3xl space-y-6 pb-12"
            >
              {/* 1. Bakery Information Card */}
              <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-pink-50">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Store size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-950">
                      Bakery Information
                    </h2>
                    <p className="text-[11px] text-gray-400">
                      Core store identity details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-pink-400 focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:border-pink-400 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Notifications & Alerts Card */}
              <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-pink-50">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-950">
                      Notifications Settings
                    </h2>
                    <p className="text-[11px] text-gray-400">
                      Configure how you receive order alerts
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Toggle 1: Email Alerts */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-400" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          Email alerts for low stock & orders
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Receive automated notices when stock runs low
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={(e) => setEmailAlerts(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>

                  {/* Toggle 2: Desktop Sound */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Volume2 size={18} className="text-gray-400" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          Desktop sound for new orders
                        </p>
                        <p className="text-[10px] text-gray-500">
                          Play an alert chime when a customer places an order
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={desktopSound}
                        onChange={(e) => setDesktopSound(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
