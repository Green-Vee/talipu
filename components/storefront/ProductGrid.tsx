"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
}

interface ProductGridProps {
  onSelectProduct: (product: Product) => void;
}

export default function ProductGrid({ onSelectProduct }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase on component mount
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products from Supabase:", error);
      } else if (data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-[#E5C396]/60 text-sm animate-pulse">
        Curating collection...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-[#E5C396]/60 text-sm">
        No signature items available at the moment. Check back soon.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onSelectProduct(product)}
          className="group bg-[#1C0D0A] border border-[#E5C396]/30 rounded-3xl overflow-hidden shadow-xl hover:border-[#FFE3AC] transition duration-300 cursor-pointer flex flex-col"
        >
          {/* Product Image Frame */}
          <div className="relative h-64 overflow-hidden bg-[#110806]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#E5C396]/30 font-serif">
                Talipu Bakery
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C0D0A] via-transparent to-transparent opacity-80"></div>
          </div>

          {/* Card Details & Action */}
          <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#FFF5EA] group-hover:text-[#FFE3AC] transition">
                {product.name}
              </h3>
              <p className="text-xs text-[#E5C396] mt-1 font-semibold">
                MK {product.price?.toLocaleString()}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents double click triggers
                onSelectProduct(product);
              }}
              className="w-full bg-[#2A1612] border border-[#E5C396]/30 text-[#FFE3AC] font-bold text-xs py-2.5 rounded-xl group-hover:bg-[#FFE3AC] group-hover:text-[#110806] transition uppercase tracking-wider cursor-pointer"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
