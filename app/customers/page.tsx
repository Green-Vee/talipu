/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Star,
  RefreshCw,
  Phone,
  ShoppingBag,
  X,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  product_name: string;
  price: number;
  status: string;
  created_at: string;
}

interface CustomerProfile {
  name: string;
  phone: string;
  is_vip: boolean;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  orders: Order[];
}

const STATUSES = ["Pending", "Confirmed", "Baking", "Ready"];

export default function AdminCustomersPage() {
  const [activeTab, setActiveTab] = useState<string>("Customers");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [isOpenOrdersExpanded, setIsOpenOrdersExpanded] = useState<boolean>(true);
  const [isPastOrdersExpanded, setIsPastOrdersExpanded] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    setLoading(true);

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && orders) {
      const customerMap: { [key: string]: CustomerProfile } = {};

      orders.forEach((order) => {
        const phoneKey = order.phone?.trim() || "unknown";
        const price = Number(order.price) || 0;
        const status = order.status?.toLowerCase() || "pending";

        if (!customerMap[phoneKey]) {
          customerMap[phoneKey] = {
            name: order.customer_name || "Unknown Customer",
            phone: order.phone || "N/A",
            is_vip: false,
            totalOrders: 0,
            pendingOrders: 0,
            deliveredOrders: 0,
            totalSpent: 0,
            firstOrderDate: order.created_at,
            orders: [],
          };
        }

        const cust = customerMap[phoneKey];
        cust.totalOrders += 1;
        cust.totalSpent += price;
        cust.orders.push(order);

        if (status === "ready" || status === "delivered") {
          cust.deliveredOrders += 1;
        } else {
          cust.pendingOrders += 1;
        }
      });

      setCustomers(Object.values(customerMap));
    }
    setLoading(false);
  };

  const toggleVipStatus = (phone: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.phone === phone ? { ...c, is_vip: !c.is_vip } : c))
    );
    setSelectedCustomer((prev) =>
      prev && prev.phone === phone ? { ...prev, is_vip: !prev.is_vip } : prev
    );
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    if (!selectedCustomer) return;

    const updatedOrders = selectedCustomer.orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );

    let delivered = 0;
    let pending = 0;
    updatedOrders.forEach((o) => {
      const st = o.status.toLowerCase();
      if (st === "ready" || st === "delivered") {
        delivered += 1;
      } else {
        pending += 1;
      }
    });

    const updatedCustomer = {
      ...selectedCustomer,
      orders: updatedOrders,
      deliveredOrders: delivered,
      pendingOrders: pending,
    };

    setSelectedCustomer(updatedCustomer);
    setCustomers((prev) =>
      prev.map((c) => (c.phone === selectedCustomer.phone ? updatedCustomer : c))
    );

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to update order status:", error.message);
      alert(`Could not update database: ${error.message}`);
      fetchCustomerData();
    }
  };

  const totalCustomersCount = customers.length;
  const vipCount = customers.filter((c) => c.is_vip).length;
  const repeatRate =
    totalCustomersCount > 0
      ? Math.round(
          (customers.filter((c) => c.totalOrders > 1).length / totalCustomersCount) * 100
        )
      : 0;

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const getBusinessDuration = (firstDateStr: string) => {
    if (!firstDateStr) return "New customer";
    const firstDate = new Date(firstDateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - firstDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "Joined today";
    if (diffDays < 30) return `${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
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

  const openOrders = selectedCustomer?.orders.filter(
    (o) => !["ready", "delivered"].includes(o.status?.toLowerCase())
  ) || [];

  const completedOrders = selectedCustomer?.orders.filter((o) =>
    ["ready", "delivered"].includes(o.status?.toLowerCase())
  ) || [];

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

        {/* LOCKED MAIN CONTAINER VIEWPORT */}
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 overflow-hidden">
          
          {/* Fixed Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Customers CRM</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Click any customer profile to view complete order breakdown and manage VIP tags
              </p>
            </div>

            <button
              onClick={fetchCustomerData}
              className="flex items-center gap-2 bg-white border border-pink-100 hover:bg-pink-50 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Fixed Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 flex-shrink-0">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-4">
              <div className="p-3 bg-pink-100 text-pink-600 rounded-xl flex-shrink-0">
                <Users size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium truncate">Total Customers</p>
                <p className="text-lg md:text-xl font-extrabold text-gray-900">
                  {loading ? "..." : totalCustomersCount}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl flex-shrink-0">
                <Star size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium truncate">VIP Members</p>
                <p className="text-lg md:text-xl font-extrabold text-gray-900">
                  {loading ? "..." : vipCount}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl flex-shrink-0">
                <ShoppingBag size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium truncate">Repeat Order Rate</p>
                <p className="text-lg md:text-xl font-extrabold text-gray-900">
                  {loading ? "..." : `${repeatRate}%`}
                </p>
              </div>
            </div>
          </div>

          {/* INDEPENDENTLY SCROLLABLE CUSTOMERS GRID */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            {loading ? (
              <div className="bg-white p-12 rounded-2xl text-center text-sm text-gray-500 border border-pink-100">
                Loading customer profiles...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center text-sm text-gray-500 border border-pink-100">
                No customer records found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((customer, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsOpenOrdersExpanded(true);
                      setIsPastOrdersExpanded(false);
                    }}
                    className="bg-white p-4 md:p-5 rounded-2xl border border-pink-100 shadow-sm flex items-center justify-between gap-4 hover:border-pink-300 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-pink-50 text-pink-600 font-black flex items-center justify-center text-base border border-pink-100 group-hover:bg-pink-100 transition flex-shrink-0">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-xs md:text-sm truncate">
                            {customer.name}
                          </h3>
                          {customer.is_vip && (
                            <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0">
                              <Star size={9} /> VIP
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 font-mono truncate">
                          <Phone size={11} className="flex-shrink-0" /> {customer.phone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xs md:text-sm font-extrabold text-gray-900">
                        MK {customer.totalSpent.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {customer.totalOrders} Order{customer.totalOrders > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* DETAILED CUSTOMER POPUP MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-pink-100 text-pink-600 font-black text-lg md:text-xl flex items-center justify-center border-2 border-pink-200 shadow-sm flex-shrink-0">
                  {selectedCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg md:text-xl font-extrabold text-gray-900">
                      {selectedCustomer.name}
                    </h2>
                    <button
                      onClick={() => toggleVipStatus(selectedCustomer.phone)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center gap-1 transition cursor-pointer ${
                        selectedCustomer.is_vip
                          ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-600"
                      }`}
                    >
                      <Star size={11} />
                      {selectedCustomer.is_vip ? "VIP Member" : "Set as VIP"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    Phone: {selectedCustomer.phone}
                  </p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar size={11} /> Doing business since:{" "}
                    {getBusinessDuration(selectedCustomer.firstOrderDate)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Customer Stats Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-pink-50/60 p-3.5 rounded-2xl border border-pink-100 text-center">
                <p className="text-[10px] text-gray-500 font-semibold">Total Orders</p>
                <p className="text-base font-black text-gray-900 mt-0.5">
                  {selectedCustomer.totalOrders}
                </p>
              </div>

              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100 text-center">
                <p className="text-[10px] text-gray-500 font-semibold">Active / Pending</p>
                <p className="text-base font-black text-amber-700 mt-0.5">
                  {selectedCustomer.pendingOrders}
                </p>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 text-center">
                <p className="text-[10px] text-gray-500 font-semibold">Delivered / Ready</p>
                <p className="text-base font-black text-emerald-700 mt-0.5">
                  {selectedCustomer.deliveredOrders}
                </p>
              </div>

              <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 text-center">
                <p className="text-[10px] text-gray-500 font-semibold">Total Spent</p>
                <p className="text-sm font-black text-blue-700 mt-0.5">
                  MK {selectedCustomer.totalSpent.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Collapsible Orders Sections */}
            <div className="space-y-3">
              
              {/* 1. Open Orders */}
              <div className="border border-pink-100 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setIsOpenOrdersExpanded(!isOpenOrdersExpanded)}
                  className="w-full bg-pink-50/50 p-3.5 flex items-center justify-between font-bold text-gray-900 text-xs hover:bg-pink-50 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Open / Active Orders ({openOrders.length})</span>
                  </div>
                  {isOpenOrdersExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isOpenOrdersExpanded && (
                  <div className="p-3 space-y-2 border-t border-pink-50 max-h-48 overflow-y-auto">
                    {openOrders.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-2">
                        No active orders right now.
                      </p>
                    ) : (
                      openOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-xs"
                        >
                          <div>
                            <p className="font-bold text-gray-900">
                              {order.product_name || "Custom Cake"}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="text-right flex items-center gap-2.5">
                            <span className="font-bold text-gray-900">
                              MK {Number(order.price || 0).toLocaleString()}
                            </span>

                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleOrderStatusChange(order.id, e.target.value)
                              }
                              className={`border text-[10px] rounded-xl px-2 py-1 font-bold outline-none cursor-pointer transition ${getStatusBadgeColor(
                                order.status
                              )}`}
                            >
                              {STATUSES.map((st) => (
                                <option key={st} value={st} className="bg-white text-gray-800">
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* 2. Completed Orders */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setIsPastOrdersExpanded(!isPastOrdersExpanded)}
                  className="w-full bg-gray-50 p-3.5 flex items-center justify-between font-bold text-gray-700 text-xs hover:bg-gray-100/70 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Past Delivered Orders ({completedOrders.length})</span>
                  </div>
                  {isPastOrdersExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isPastOrdersExpanded && (
                  <div className="p-3 space-y-2 border-t border-gray-100 max-h-48 overflow-y-auto">
                    {completedOrders.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-2">
                        No completed past orders yet.
                      </p>
                    ) : (
                      completedOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-xs"
                        >
                          <div>
                            <p className="font-bold text-gray-900">
                              {order.product_name || "Custom Cake"}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="text-right flex items-center gap-2.5">
                            <span className="font-bold text-gray-900">
                              MK {Number(order.price || 0).toLocaleString()}
                            </span>

                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleOrderStatusChange(order.id, e.target.value)
                              }
                              className={`border text-[10px] rounded-xl px-2 py-1 font-bold outline-none cursor-pointer transition ${getStatusBadgeColor(
                                order.status
                              )}`}
                            >
                              {STATUSES.map((st) => (
                                <option key={st} value={st} className="bg-white text-gray-800">
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Footer Close */}
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}