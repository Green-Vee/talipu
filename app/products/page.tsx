"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { NotificationItem } from "@/components/types";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Trash2,
  Edit3,
  Package,
  RefreshCw,
  X,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category?: string;
  is_available: boolean;
  created_at?: string;
}

export default function AdminProductsPage() {
  // Inside AdminProductsPage component:
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      // eslint-disable-next-line react-hooks/immutability
      setIsAddModalOpen(true);
    }
  }, [searchParams]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<string>("Products");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [category, setCategory] = useState("Cakes");

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    } else if (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  // Helper to upload image file to Supabase Storage bucket
  const uploadImageAndGetUrl = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images") // Make sure this bucket exists in your Supabase storage
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage upload error:", uploadError.message);
        alert(
          `Image upload failed: ${uploadError.message}. Saving without new image.`,
        );
        return null;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error("Error uploading image:", err);
      return null;
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    setSubmitting(true);
    let finalImageUrl = existingImageUrl;

    if (imageFile) {
      const uploadedUrl = await uploadImageAndGetUrl(imageFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      image_url: finalImageUrl || null,
      category,
      is_available: true,
    };

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select();

    if (error) {
      console.error("Failed to add product:", error.message);
      alert(`Error adding product: ${error.message}`);
    } else if (data) {
      setProducts([data[0], ...products]);
      resetForm();
      setIsAddModalOpen(false);
    }
    setSubmitting(false);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentId || !name || !price) return;

    setSubmitting(true);
    let finalImageUrl = existingImageUrl;

    if (imageFile) {
      const uploadedUrl = await uploadImageAndGetUrl(imageFile);
      if (uploadedUrl) finalImageUrl = uploadedUrl;
    }

    const updatedFields = {
      name,
      description,
      price: parseFloat(price),
      image_url: finalImageUrl || null,
      category,
    };

    const { error } = await supabase
      .from("products")
      .update(updatedFields)
      .eq("id", currentId);

    if (error) {
      console.error("Failed to update product:", error.message);
      alert(`Error updating product: ${error.message}`);
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === currentId
            ? {
                ...p,
                ...updatedFields,
                image_url: updatedFields.image_url ?? undefined,
              }
            : p,
        ),
      );
      resetForm();
      setIsEditModalOpen(false);
    }
    setSubmitting(false);
  };

  const openEditModal = (product: Product) => {
    setCurrentId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setExistingImageUrl(product.image_url || "");
    setImageFile(null);
    setCategory(product.category || "Cakes");
    setIsEditModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    const targetId = productToDelete;
    setProducts((prev) => prev.filter((p) => p.id !== targetId));
    setIsDeleteModalOpen(false);
    setProductToDelete(null);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", targetId);

    if (error) {
      console.error("Failed to delete product:", error);
      fetchProducts(); // Revert on failure
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_available: updatedStatus } : p,
      ),
    );

    const { error } = await supabase
      .from("products")
      .update({ is_available: updatedStatus })
      .eq("id", id);

    if (error) {
      console.error("Failed to update availability:", error);
      fetchProducts();
    }
  };

  const resetForm = () => {
    setCurrentId(null);
    setName("");
    setDescription("");
    setPrice("");
    setImageFile(null);
    setExistingImageUrl("");
    setCategory("Cakes");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Products & Bakery Menu
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Add, edit, or remove cakes and pastries available in your
                  store catalog
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchProducts}
                  className="flex items-center gap-2 bg-white border border-pink-100 hover:bg-pink-50 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
                >
                  <RefreshCw
                    size={14}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setIsAddModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
                >
                  <Plus size={16} />
                  Add New Cake
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="bg-white p-12 rounded-2xl text-center text-sm text-gray-500 border border-pink-100">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center space-y-3 border border-pink-100">
                <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <Package size={24} />
                </div>
                <p className="text-base font-bold text-gray-800">
                  No products in menu
                </p>
                <p className="text-xs text-gray-500">
                  Click &quot;Add New Cake&quot; to start building your product
                  catalog.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden flex flex-col justify-between"
                  >
                    <div className="h-40 bg-pink-50 relative flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-pink-300 flex flex-col items-center">
                          <ImageIcon size={32} />
                          <span className="text-[10px] mt-1 font-medium">
                            No Image
                          </span>
                        </div>
                      )}

                      <span
                        className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          product.is_available
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {product.is_available ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {product.name}
                        </h3>
                        <span className="text-pink-600 font-extrabold text-xs">
                          MK {Number(product.price).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2">
                        {product.description || "No description provided."}
                      </p>
                    </div>

                    <div className="p-4 pt-0 border-t border-pink-50 flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() =>
                          toggleAvailability(product.id, product.is_available)
                        }
                        className="text-[11px] font-semibold text-gray-600 hover:text-pink-600 transition"
                      >
                        Toggle Status
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 space-y-4 shadow-xl border border-pink-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {isEditModalOpen ? "Edit Cake Details" : "Add New Cake"}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={
                isEditModalOpen ? handleUpdateProduct : handleAddProduct
              }
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cake Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Velvet Deluxe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Price (MK) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 25000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-pink-500"
                />
              </div>

              {/* File Upload Input for Image */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cake Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
                {existingImageUrl && !imageFile && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    Current image exists. Uploading a new one will replace it.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description of ingredients or flavor..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 transition"
                >
                  {submitting
                    ? "Saving..."
                    : isEditModalOpen
                      ? "Update Cake"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 space-y-4 shadow-xl border border-pink-100 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-gray-900">
                Delete Cake?
              </h2>
              <p className="text-xs text-gray-500">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition text-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
