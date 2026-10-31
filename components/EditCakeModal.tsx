'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ProductDetailModal from '@/components/ProductDetailModal';
import OrderModal from '@/components/OrderModal';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  // Fetch products from Supabase on load
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else if (data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // When a user clicks a cake card on the menu
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  // When user clicks "Commission This Masterpiece" from detail view
  const handleOpenOrder = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#110806] text-[#F3E8DF] font-sans selection:bg-[#D4A359] selection:text-[#110806]">
      
      {/* Hero Section */}
      <header className="relative py-20 px-6 text-center border-b border-[#E5C396]/20 bg-gradient-to-b from-[#1C0D0A] to-[#110806]">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#FFE3AC] font-bold">
            Dark Chocolate & Champagne Gold
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#FFF5EA] tracking-wide">
            Talipu Bakery
          </h1>
          <p className="text-sm sm:text-base text-[#E5C396]/80 max-w-xl mx-auto font-light">
            Bespoke artisanal confections crafted for moments of pure indulgence.
          </p>
        </div>
      </header>

      {/* Menu Grid Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-serif text-[#FFF5EA] font-semibold">The Signature Collection</h2>
          <span className="text-xs text-[#E5C396] tracking-widest uppercase">Click any piece to view details</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#E5C396]/60 text-sm">
            Curating collection...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-[#E5C396]/60 text-sm">
            No signature items available at the moment. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div 
                key={product.id}
                onClick={() => handleProductClick(product)}
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

                {/* Card Info */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#FFF5EA] group-hover:text-[#FFE3AC] transition">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#E5C396] mt-1 font-semibold">
                      MK {product.price?.toLocaleString()}
                    </p>
                  </div>

                  <button className="w-full bg-[#2A1612] border border-[#E5C396]/30 text-[#FFE3AC] font-bold text-xs py-2.5 rounded-xl group-hover:bg-[#FFE3AC] group-hover:text-[#110806] transition uppercase tracking-wider">
                    View Details & Commission
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5C396]/20 py-8 text-center text-xs text-[#E5C396]/60">
        &copy; 2026 Talipu Bakery. All Rights Reserved.
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenOrder={handleOpenOrder}
      />

      {/* 2-Step Order Modal */}
      {selectedProduct && (
        <OrderModal 
          product={selectedProduct}
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
        />
      )}

    </div>
  );
}