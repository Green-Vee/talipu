"use client";

import React from "react";
import { Plus, Search } from "lucide-react";

interface ProductHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal: () => void;
}

export default function ProductHeader({
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
}: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products Directory</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage all cakes and menu items in real-time
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search cakes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm"
          />
        </div>

        {/* Add Product Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-xl shadow-sm transition shrink-0"
        >
          <Plus size={18} />
          Add Cake
        </button>
      </div>
    </div>
  );
}
