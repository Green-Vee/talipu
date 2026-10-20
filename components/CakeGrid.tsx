"use client";

import React from "react";
import {
  Package,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Product } from "./types";

interface CakeGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function CakeGrid({
  products,
  onEdit,
  onDelete,
}: CakeGridProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 min-h-[600px]">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-pink-100">
        <h2 className="text-lg font-bold text-gray-900">Your Cakes</h2>
        <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
          Showing {products.length} products
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={48} className="mx-auto mb-3 text-pink-200" />
          <p>No cakes found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((cake) => (
            <div
              key={cake.id}
              className="border border-pink-100 rounded-xl overflow-hidden hover:shadow-md transition duration-200 bg-white flex flex-col group"
            >
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                  src={cake.image}
                  alt={cake.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                  {cake.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                    {cake.name}
                  </h3>
                  <div className="flex items-center justify-between my-2">
                    <span className="text-lg font-extrabold text-pink-600">
                      ${cake.price}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                        cake.stockStatus === "In Stock"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}
                    >
                      {cake.stockStatus === "In Stock" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <AlertTriangle size={12} />
                      )}
                      {cake.stockStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-pink-50">
                  <button
                    onClick={() => onEdit(cake)}
                    className="p-2 rounded-lg text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition"
                    title="Edit Cake"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(cake)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete Cake"
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
  );
}
