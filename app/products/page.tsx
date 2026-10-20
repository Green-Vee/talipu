"use client";

import React, { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import CakeGrid from "@/components/CakeGrid";
import AddCakeModal from "@/components/AddCakeModal";
import EditCakeModal from "@/components/EditCakeModal";
import DeleteCakeModal from "@/components/DeleteCakeModal";
import { Product, NotificationItem } from "@/components/types";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<string>("Products");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Chocolate Decadence",
      price: "28.00",
      category: "Chocolate",
      stockStatus: "In Stock",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      name: "Strawberry Delight",
      price: "24.50",
      category: "Fruit & Berry",
      stockStatus: "Low Stock",
      image:
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      name: "Vanilla Birthday Dream",
      price: "32.00",
      category: "Celebration",
      stockStatus: "In Stock",
      image:
        "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=500&auto=format&fit=crop&q=60",
    },
    {
      id: 4,
      name: "Red Velvet Royale",
      price: "29.99",
      category: "Velvet",
      stockStatus: "In Stock",
      image:
        "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=500&auto=format&fit=crop&q=60",
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Low Stock Alert: Strawberry Delight is down to 8kg",
      time: "10 mins ago",
      type: "warning",
      read: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingCake, setEditingCake] = useState<Product | null>(null);
  const [deletingCake, setDeletingCake] = useState<Product | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filteredCakes = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  const handleAddCake = (newCakeData: {
    name: string;
    price: string;
    category: string;
    stockStatus: string;
    image: string;
  }) => {
    const product: Product = {
      id: Date.now(),
      name: newCakeData.name,
      price: parseFloat(newCakeData.price).toFixed(2),
      category: newCakeData.category,
      stockStatus: newCakeData.stockStatus,
      image:
        newCakeData.image ||
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
    };

    setProducts([product, ...products]);
    setShowAddModal(false);
    showToast("✨ Cake added successfully!");
  };

  const confirmDeleteCake = () => {
    if (!deletingCake) return;
    setProducts(products.filter((p) => p.id !== deletingCake.id));
    setDeletingCake(null);
    showToast("🗑️ Cake deleted successfully!");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCake) return;
    setProducts(
      products.map((p) => (p.id === editingCake.id ? editingCake : p)),
    );
    setEditingCake(null);
    showToast("✏️ Cake updated successfully!");
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FDF0F3] text-gray-800 font-sans flex relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl z-50 text-sm font-medium animate-bounce">
          {toastMessage}
        </div>
      )}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-full min-w-0">
        <TopBar
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markAllAsRead={markAllAsRead}
          onOpenAddModal={() => setShowAddModal(true)}
        />

        {/* INDEPENDENT SCROLL AREA FOR YOUR CAKES */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto w-full">
            <CakeGrid
              products={filteredCakes}
              onEdit={setEditingCake}
              onDelete={setDeletingCake}
            />
          </div>
        </div>
      </main>

      {showAddModal && (
        <AddCakeModal
          onClose={() => setShowAddModal(false)}
          onAddCake={handleAddCake}
          showToast={showToast}
        />
      )}

      {editingCake && (
        <EditCakeModal
          editingCake={editingCake}
          setEditingCake={setEditingCake}
          onSave={handleSaveEdit}
        />
      )}

      {deletingCake && (
        <DeleteCakeModal
          deletingCake={deletingCake}
          onCancel={() => setDeletingCake(null)}
          onConfirm={confirmDeleteCake}
        />
      )}
    </div>
  );
}
