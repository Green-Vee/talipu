"use client";

import React from "react";

interface ToastProps {
  message: string;
}

export default function ToastNotification({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl z-50 text-sm font-medium animate-fade-in">
      {message}
    </div>
  );
}
