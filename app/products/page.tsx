"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

import Sidebar from "@/components/Sidebar";
import CakeGrid from "@/components/CakeGrid";
import ProductHeader from "@/components/ProductHeader";
import ToastNotification from "@/components/ToastNotification";
import AddCakeModal from "@/components/AddCakeModal";
import EditCakeModal from "@/components/EditCakeModal";
import DeleteCakeModal from "@/components/DeleteCakeModal";

import type { Product } from "@/components/types";
import { supabase } from "@/lib/supabase";

interface SupabaseProduct {
  id: string;
  name: string;
  price: number | string;
  description: string | null;
  image_url: string | null;
}

interface NewCakeInput {
  name: string;
  price: string;
  category: string;
  stockStatus: string;
  image: string;
}

const DEFAULT_CAKE_IMAGE =
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCake, setEditingCake] = useState<Product | null>(null);
  const [deletingCake, setDeletingCake] = useState<Product | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToastMessage(message);

    toastTimer.current = setTimeout(() => {
      setToastMessage("");
      toastTimer.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message);
        showToast("❌ Failed to load products.");
        return;
      }

      const mappedProducts: Product[] = (
        (data ?? []) as unknown as SupabaseProduct[]
      ).map((item) => ({
        id: item.id,
        name: item.name,
        price: String(item.price),
        category: item.description || "General",
        stockStatus: "In Stock",
        image: item.image_url || DEFAULT_CAKE_IMAGE,
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Unexpected error fetching products:", error);
      showToast("❌ An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProducts();
    });
  }, [fetchProducts]);

  const handleAddCake = async (newCakeData: NewCakeInput) => {
    const price = Number(newCakeData.price);

    if (!newCakeData.name.trim() || !Number.isFinite(price) || price < 0) {
      showToast("❌ Enter a valid product name and price.");
      return;
    }

    try {
      const { error } = await supabase.from("products").insert({
        name: newCakeData.name.trim(),
        price,
        description: newCakeData.category.trim() || null,
        image_url: newCakeData.image.trim() || null,
      });

      if (error) {
        console.error("Error adding product:", error.message);
        showToast("❌ Failed to save product.");
        return;
      }

      setShowAddModal(false);
      showToast("✨ Product saved successfully!");

      await fetchProducts();
    } catch (error) {
      console.error("Unexpected error adding product:", error);
      showToast("❌ An unexpected error occurred.");
    }
  };

  const handleSaveEdit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editingCake) return;

    const price = Number(editingCake.price);

    if (!editingCake.name.trim() || !Number.isFinite(price) || price < 0) {
      showToast("❌ Enter a valid product name and price.");
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: editingCake.name.trim(),
          price,
          description: editingCake.category.trim() || null,
          image_url: editingCake.image.trim() || null,
        })
        .eq("id", editingCake.id);

      if (error) {
        console.error("Error updating product:", error.message);
        showToast("❌ Failed to update product.");
        return;
      }

      setEditingCake(null);
      showToast("✏️ Product updated successfully!");

      await fetchProducts();
    } catch (error) {
      console.error("Unexpected error updating product:", error);
      showToast("❌ An unexpected error occurred.");
    }
  };

  const confirmDeleteCake = async () => {
    if (!deletingCake) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deletingCake.id);
      console.log(
        "Attempting to delete/update ID:",
        deletingCake.id,
        typeof deletingCake.id,
      );

      if (error) {
        console.error("Error deleting product:", error.message);
        showToast("❌ Failed to delete product.");
        return;
      }

      setDeletingCake(null);
      showToast("🗑️ Product deleted successfully!");

      await fetchProducts();
    } catch (error) {
      console.error("Unexpected error deleting product:", error);
      showToast("❌ An unexpected error occurred.");
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCakes = products.filter(
    (product) =>
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery),
  );

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#FDF0F3] font-sans text-gray-800">
      <ToastNotification message={toastMessage} />

      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-8">
        <div className="mx-auto w-full max-w-7xl">
          <ProductHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenAddModal={() => setShowAddModal(true)}
          />

          {loading ? (
            <div
              className="flex items-center justify-center py-20 font-semibold text-pink-600"
              role="status"
              aria-live="polite"
            >
              Loading products from database...
            </div>
          ) : (
            <CakeGrid
              products={filteredCakes}
              onEdit={setEditingCake}
              onDelete={setDeletingCake}
            />
          )}
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
