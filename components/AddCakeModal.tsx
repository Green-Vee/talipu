"use client";

import React, { useState } from "react";
import { X, Upload, Plus } from "lucide-react";

interface AddCakeModalProps {
  onClose: () => void;
  onAddCake: (cake: {
    name: string;
    price: string;
    category: string;
    stockStatus: string;
    image: string;
  }) => void;
  showToast: (msg: string) => void;
}

export default function AddCakeModal({
  onClose,
  onAddCake,
  showToast,
}: AddCakeModalProps) {
  const [newCake, setNewCake] = useState({
    name: "",
    price: "",
    category: "Chocolate",
    stockStatus: "In Stock",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("⚠️ Image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setNewCake((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCake.name || !newCake.price) return;
    onAddCake(newCake);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-pink-100">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-pink-100">
          <h3 className="font-bold text-lg text-gray-900">Add New Cake</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Cake Name
            </label>
            <input
              type="text"
              required
              value={newCake.name}
              onChange={(e) => setNewCake({ ...newCake, name: e.target.value })}
              placeholder="e.g. Chocolate Strawberry Cake"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={newCake.price}
              onChange={(e) =>
                setNewCake({ ...newCake, price: e.target.value })
              }
              placeholder="e.g. 24.99"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={newCake.category}
              onChange={(e) =>
                setNewCake({ ...newCake, category: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition"
            >
              <option value="Chocolate">Chocolate</option>
              <option value="Fruit & Berry">Fruit & Berry</option>
              <option value="Celebration">Celebration</option>
              <option value="Velvet">Velvet</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Photo
            </label>
            <label className="border-2 border-dashed border-pink-200 bg-pink-50/30 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50/70 transition group">
              {imagePreview ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <>
                  <div className="p-3 bg-pink-100 text-pink-600 rounded-full mb-2 group-hover:scale-110 transition duration-200">
                    <Upload size={20} />
                  </div>
                  <span className="text-xs font-medium text-pink-600 text-center">
                    Upload photo / PNG, JPG up to 5MB
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl text-sm shadow-md shadow-pink-200 flex items-center justify-center gap-1.5"
            >
              <Plus size={16} />
              <span>Add Cake</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
