"use client";

import { useState } from "react";
import WelcomeModal from "@/components/storefront/WelcomeModal";
import TopNav from "@/components/storefront/TopNav";
import HeroSection from "@/components/storefront/HeroSection";
import ProductGrid from "@/components/storefront/ProductGrid";
import HowItWorks from "@/components/storefront/HowItWorks";
import ProductDetailModal from "@/components/storefront/ProductDetailModal";
import OrderModal from "@/components/storefront/OrderModal";
import { Suspense } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
}

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleOpenOrder = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#110806] text-[#F3E8DF] font-sans selection:bg-[#D4A359] selection:text-[#110806]">
      {/* Welcome Popup Modal */}
      <Suspense fallback={null}>
        <WelcomeModal />
      </Suspense>

      {/* Main Storefront Sections */}
      <TopNav />
      <HeroSection />

      <main id="menu-collection" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-serif text-[#FFF5EA] font-semibold">
            Specialty Menu Preview
          </h2>
          <span className="text-xs text-[#E5C396] tracking-widest uppercase">
            Click any piece to view details
          </span>
        </div>

        <ProductGrid onSelectProduct={handleProductClick} />
      </main>

      <HowItWorks />

      <footer className="border-t border-[#E5C396]/20 py-10 text-center text-xs text-[#E5C396]/60 space-y-2">
        <p>
          &copy; 2026 Talipu Luxury Bakery &bull; New York, NY &bull;
          hello@talipu.com &bull; Instagram @talipuluxurybakery
        </p>
      </footer>

      {/* Interactive Modals */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenOrder={handleOpenOrder}
      />

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
