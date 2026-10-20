"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Product } from "./types";

interface DeleteCakeModalProps {
  deletingCake: Product;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteCakeModal({
  deletingCake,
  onCancel,
  onConfirm,
}: DeleteCakeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-pink-100 text-center">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} />
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-2">Delete Cake</h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">
            &quot;{deletingCake.name}&quot;
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl text-sm shadow-md shadow-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
