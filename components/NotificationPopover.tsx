"use client";

import React, { useRef, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  ShoppingBag,
  CheckCircle2,
  Check,
} from "lucide-react";
import { NotificationItem } from "./types";

interface NotificationPopoverProps {
  notifications: NotificationItem[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  markAllAsRead: () => void;
}

export default function NotificationPopover({
  notifications,
  showNotifications,
  setShowNotifications,
  markAllAsRead,
}: NotificationPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowNotifications]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={`p-2.5 rounded-xl border transition relative ${
          showNotifications
            ? "bg-pink-50 border-pink-300 text-pink-600"
            : "border-pink-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600"
        }`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-pink-500 rounded-full ring-2 ring-white" />
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-pink-100 z-50 overflow-hidden">
          <div className="p-4 border-b border-pink-100 flex items-center justify-between bg-pink-50/50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
              >
                <Check size={14} />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-pink-50">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 hover:bg-pink-50/40 transition flex gap-3 ${
                    !item.read ? "bg-pink-50/20" : ""
                  }`}
                >
                  <div className="mt-0.5">
                    {item.type === "warning" && (
                      <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                        <AlertTriangle size={16} />
                      </div>
                    )}
                    {item.type === "info" && (
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                        <ShoppingBag size={16} />
                      </div>
                    )}
                    {item.type === "success" && (
                      <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-xs ${
                        !item.read
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      {item.title}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
