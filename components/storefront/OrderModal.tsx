"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
}

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({
  product,
  isOpen,
  onClose,
}: OrderModalProps) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [size, setSize] = useState("Standard (8 inch)");
  const [customMessage, setCustomMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCloseAndReset = () => {
    setCustomerName("");
    setPhone("");
    setDeliveryDate("");
    setSize("Standard (8 inch)");
    setCustomMessage("");
    setErrorMessage(null);
    onClose();
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Generate unique tracking code
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const trackingCode = `BAKE-${randomCode}`;

      // 2. Insert into Supabase and request returned record
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            tracking_code: trackingCode,
            customer_name: customerName,
            phone: phone,
            delivery_date: deliveryDate,
            product_name: product.name,
            product_id: product.id,
            size: size,
            custom_message: customMessage,
            price: product.price,
            status: "Pending",
          },
        ])
        .select(); // Request returned row to verify insertion

      if (error) {
        console.error("Supabase Insert Error:", error);
        setErrorMessage(`Database Error: ${error.message}`);
        setSubmitting(false);
        return; // STOP execution so we don't open WhatsApp if DB save failed
      }

      // 3. Save to localStorage for instant lookup on /track
      localStorage.setItem("talipu_tracking_code", trackingCode);
      localStorage.setItem("talipu_customer_name", customerName);

      // 4. Format WhatsApp Message
      const whatsappText = encodeURIComponent(
        `Hello Talipu Bakery! My Name is ${customerName} 🎂\n\n` +
          `I would like to place an order:\n` +
          `*Order Code:* ${trackingCode}\n` +
          `*Cake:* ${product.name}\n` +
          `*Size:* ${size}\n` +
          `*Price:* MK ${product.price?.toLocaleString()}\n` +
          `*Name:* ${customerName}\n` +
          `*Phone:* ${phone}\n` +
          `*Delivery Date:* ${deliveryDate}\n` +
          (customMessage ? `*Custom Note:* ${customMessage}\n` : "") +
          `\nPlease confirm my order status!`,
      );

      // 5. Open WhatsApp & reset
      // 4. Reset form state & close modal
      window.open(`https://wa.me/265888216159?text=${whatsappText}`, "_blank");
      handleCloseAndReset();

      // 5. Instantly redirect customer to tracking page
      router.push("/track");
    } catch (err: unknown) {
      console.error("Unexpected submission error:", err);
      setErrorMessage("Something went wrong. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#1C0D0A] border border-[#E5C396]/40 text-[#F3E8DF] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative">
        <button
          onClick={handleCloseAndReset}
          className="absolute top-5 right-5 text-[#E5C396] hover:text-[#FFE3AC] text-lg w-8 h-8 rounded-full bg-[#2A1612] border border-[#E5C396]/20 flex items-center justify-center transition"
        >
          ✕
        </button>

        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFE3AC] font-bold block">
            Bespoke Commission
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#FFF5EA]">
            {product.name}
          </h3>
          <p className="text-xs text-[#E5C396] font-semibold">
            MK {product.price?.toLocaleString()}
          </p>
        </div>

        {/* Display database error message on screen if insert fails */}
        {errorMessage && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleOrderSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#E5C396] mb-1 font-semibold">
              Your Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chisomo Phiri"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-[#110806] border border-[#E5C396]/30 rounded-xl px-3.5 py-2.5 text-[#FFF5EA] outline-none focus:border-[#FFE3AC] transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#E5C396] mb-1 font-semibold">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                required
                placeholder="+265..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#110806] border border-[#E5C396]/30 rounded-xl px-3.5 py-2.5 text-[#FFF5EA] outline-none focus:border-[#FFE3AC] transition"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#E5C396] mb-1 font-semibold">
                Delivery Date
              </label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-[#110806] border border-[#E5C396]/30 rounded-xl px-3.5 py-2.5 text-[#FFF5EA] outline-none focus:border-[#FFE3AC] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#E5C396] mb-1 font-semibold">
              Select Cake Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-[#110806] border border-[#E5C396]/30 rounded-xl px-3.5 py-2.5 text-[#FFF5EA] outline-none focus:border-[#FFE3AC] transition"
            >
              <option value="Standard (8 inch)">
                Standard (8 inch) - Feeds 8-10
              </option>
              <option value="Large (10 inch)">
                Large (10 inch) - Feeds 12-16
              </option>
              <option value="2-Tier Luxury Special">
                2-Tier Luxury Special - Feeds 25+
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#E5C396] mb-1 font-semibold">
              Custom Inscription / Note (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Happy 30th Birthday Alex!"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-[#110806] border border-[#E5C396]/30 rounded-xl px-3.5 py-2.5 text-[#FFF5EA] outline-none focus:border-[#FFE3AC] transition"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#FFE3AC] via-[#D4A359] to-[#996A22] text-[#110806] font-bold text-xs py-3.5 rounded-xl shadow-[0_0_20px_rgba(212,163,89,0.4)] hover:brightness-110 transition uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            {submitting
              ? "Saving Order to Database..."
              : "💬 Send Order to WhatsApp & Track"}
          </button>
        </form>
      </div>
    </div>
  );
}
