"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import NotificationPopover from "./NotificationPopover";
import { NotificationItem } from "./types";

interface TopBarProps {
  title?: string;
  activeTab?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: NotificationItem[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  markAllAsRead: () => void;
  onOpenAddModal?: () => void;
}

export default function TopBar({
  title,
  activeTab,
  searchQuery,
  setSearchQuery,
  notifications,
  showNotifications,
  setShowNotifications,
  markAllAsRead,
  onOpenAddModal,
}: TopBarProps) {
  // Uses title first, or falls back to activeTab, or defaults to 'Dashboard'
  const displayTitle = title || activeTab || "Dashboard";

  return (
    <header className="h-20 bg-white/70 backdrop-blur-md border-b border-pink-100 px-8 flex items-center justify-between shrink-0 z-20">
      <h1 className="text-2xl font-bold text-gray-900">{displayTitle}</h1>

      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-pink-50/50 border border-pink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition"
          />
        </div>

        <NotificationPopover
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={markAllAsRead}
        />

        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl text-sm transition shadow-md shadow-pink-200"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        )}
      </div>
    </header>
  );
}
