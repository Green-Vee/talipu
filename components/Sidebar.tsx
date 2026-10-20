"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // Navigation Items - Dashboard is placed FIRST as the primary landing page
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingBag },
    { name: "Customers", href: "/", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-pink-100 flex flex-col justify-between p-6 shadow-sm h-full shrink-0">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="text-2xl">🧁</span>
          <span className="text-xl font-bold tracking-tight text-pink-600">
            TALIPU
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            // Checks if current path matches the link href
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin User Profile */}
      <div className="pt-6 border-t border-pink-100 flex items-center gap-3 px-2">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          alt="Admin Avatar"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-300"
        />
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-gray-900 truncate">Admin</p>
          <p className="text-xs text-gray-500 truncate">admin@talipu.com</p>
        </div>
      </div>
    </aside>
  );
}
