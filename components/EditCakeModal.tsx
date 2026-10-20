"use client";

import React from "react";
import { X } from "lucide-react";
import { Product } from "./types";

interface EditCakeModalProps {
  editingCake: Product;
  setEditingCake: (cake: Product | null) => void;
  onSave: (e: React.FormEvent) => void;
}

export default function EditCakeModal({
  editingCake,
  setEditingCake,
  onSave,
}: EditCakeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-pink-100">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-pink-100">
          <h3 className="font-bold text-lg text-gray-900">Edit Cake</h3>
          <button
            onClick={() => setEditingCake(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Cake Name
            </label>
            <input
              type="text"
              value={editingCake.name}
              onChange={(e) =>
                setEditingCake({ ...editingCake, name: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={editingCake.price}
              onChange={(e) =>
                setEditingCake({ ...editingCake, price: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Stock Status
            </label>
            <select
              value={editingCake.stockStatus}
              onChange={(e) =>
                setEditingCake({
                  ...editingCake,
                  stockStatus: e.target.value,
                })
              }
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400/50"
            >
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingCake(null)}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl text-sm shadow-md shadow-pink-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
