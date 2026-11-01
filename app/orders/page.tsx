"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import { supabase } from "@/lib/supabase";
import {
  RefreshCw,
  ShoppingBag,
  Eye,
  X,
  Clock,
  CheckCircle,
  Phone,
  User,
  Calendar,
  MessageSquare,
  Tag,
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
  delivery_date: string;
  custom_message?: string;
  created_at: string;
}

const STATUSES = ["Pending", "Confirmed", "Baking", "Ready"];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<string>("Orders");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "New orders synced from database",
      time: "Just now",
      type: "info",
      read: false,
    },
  ]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    } else if (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // 1. Update local orders list
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    // 2. Update selected modal view if active
    setSelectedOrder((prev) =>
      prev && prev.id === orderId ? { ...prev, status: newStatus } : prev
    );

    // 3. Sync to Supabase database
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to update status in database:", error);
      alert(`Database update failed: ${error.message}`);
      fetchOrders(); // Revert on failure
    }
  };

  // Filter orders based on top bar search query
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.customer_name?.toLowerCase().includes(query) ||
      order.tracking_code?.toLowerCase().includes(query) ||
      order.product_name?.toLowerCase().includes(query) ||
      order.phone?.includes(query)
    );
  });

  // Calculate quick metrics
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) =>
    ["pending", "confirmed", "baking"].includes(o.status?.toLowerCase())
  ).length;
  const readyCount = orders.filter((o) =>
    ["ready", "delivered"].includes(o.status?.toLowerCase())
  ).length;

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
    <div className="h-screen w-screen overflow-hidden bg-[#FDF0F3] text-gray-800 font-sans flex relative">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full min-w-0">
        <TopBar
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={markAllAsRead}
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            
            {/* Header Title & Refresh Button */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Customer Orders
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Manage incoming cake orders, inspect custom requirements, and update live tracking statuses
                </p>
              </div>

              <button
                onClick={fetchOrders}
                disabled={loading}
                className="flex items-center gap-2 bg-white border border-pink-100 hover:bg-pink-50 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                {loading ? "Refreshing..." : "Refresh Orders"}
              </button>
            </div>

            {/* Quick Metrics Header Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                  <p className="text-xl font-extrabold text-gray-900 mt-0.5">
                    {loading ? "..." : totalCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  <ShoppingBag size={20} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Pending / Baking</p>
                  <p className="text-xl font-extrabold text-amber-700 mt-0.5">
                    {loading ? "..." : pendingCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Clock size={20} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Ready for Pickup / Delivery</p>
                  <p className="text-xl font-extrabold text-emerald-700 mt-0.5">
                    {loading ? "..." : readyCount}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle size={20} />
                </div>
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-sm text-gray-500">
                  Loading orders from database...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag size={24} />
                  </div>
                  <p className="text-base font-bold text-gray-800">
                    No orders found
                  </p>
                  <p className="text-xs text-gray-500">
                    {searchQuery
                      ? "No orders match your search criteria."
                      : "When customers submit orders, they will show up here."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FDF0F3]/60 border-b border-pink-100 text-gray-600 font-semibold">
                      <tr>
                        <th className="p-4">Tracking Code</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Product & Size</th>
                        <th className="p-4">Delivery Date</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Status Update</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-50">
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-pink-50/40 transition-colors"
                        >
                          <td className="p-4 font-bold text-gray-900">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="bg-pink-50 text-pink-700 border border-pink-200 px-2.5 py-1 rounded-lg hover:bg-pink-100 hover:border-pink-300 transition font-mono"
                            >
                              {order.tracking_code}
                            </button>
                          </td>
                          <td className="p-4 font-semibold text-gray-900">
                            {order.customer_name}
                          </td>
                          <td className="p-4 text-gray-600 font-mono">
                            {order.phone}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-gray-800">
                              {order.product_name}
                            </span>{" "}
                            <span className="text-gray-400">({order.size})</span>
                          </td>
                          <td className="p-4 text-gray-600 font-medium">
                            {order.delivery_date}
                          </td>
                          <td className="p-4 font-bold text-gray-900">
                            MK {Number(order.price).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              className={`border text-xs rounded-xl px-3 py-1.5 font-bold outline-none cursor-pointer transition ${getStatusBadgeColor(
                                order.status
                              )}`}
                            >
                              {STATUSES.map((st) => (
                                <option key={st} value={st} className="bg-white text-gray-800">
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition"
                              title="Inspect Full Order Details"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* FULL ORDER DETAILS POPUP MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 space-y-6 shadow-2xl border border-pink-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-pink-100 text-pink-700 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-pink-200">
                    {selectedOrder.tracking_code}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-gray-900 mt-2">
                  Order Details
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Order Specs Breakdown */}
            <div className="space-y-4 text-xs">
              
              {/* Customer Info Card */}
              <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 space-y-2">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <User size={14} className="text-pink-600" />
                  <span>{selectedOrder.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-mono">
                  <Phone size={14} className="text-gray-400" />
                  <span>{selectedOrder.phone}</span>
                </div>
              </div>

              {/* Product Info & Pricing */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                    Product & Size
                  </span>
                  <p className="font-bold text-gray-900">
                    {selectedOrder.product_name}
                  </p>
                  <p className="text-gray-500 font-medium">
                    Size: {selectedOrder.size}
                  </p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                    Price & Delivery
                  </span>
                  <p className="font-black text-pink-600 text-sm">
                    MK {Number(selectedOrder.price).toLocaleString()}
                  </p>
                  <p className="text-gray-500 font-medium flex items-center gap-1">
                    <Calendar size={12} /> {selectedOrder.delivery_date}
                  </p>
                </div>
              </div>

              {/* Custom Piping Message / Special Instructions */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <MessageSquare size={14} className="text-amber-600" />
                  <span>Piping Message / Custom Request</span>
                </div>
                <p className="text-gray-700 italic bg-white/80 p-2.5 rounded-xl border border-amber-100">
                  {selectedOrder.custom_message
                    ? `"${selectedOrder.custom_message}"`
                    : "No custom message requested for this cake."}
                </p>
              </div>

              {/* Update Status Selector Inside Modal */}
              <div className="pt-2 space-y-2">
                <label className="block font-bold text-gray-900">
                  Update Order Progress Tag:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`py-2 rounded-xl font-bold text-xs border transition ${
                        selectedOrder.status === st
                          ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-pink-50 hover:border-pink-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}