"use client";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenOrder: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onOpenOrder,
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1C0D0A] border border-[#E5C396]/40 text-[#F3E8DF] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
        {/* Subtle ambient gold glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4A359]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#E5C396] hover:text-[#FFE3AC] text-sm w-9 h-9 rounded-full bg-[#2A1612] border border-[#E5C396]/25 flex items-center justify-center transition z-10 cursor-pointer"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Product Image Frame */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-[#E5C396]/30 bg-[#110806] shadow-inner">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#E5C396]/40 font-serif text-lg">
                Talipu Bakery
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C0D0A]/80 via-transparent to-transparent"></div>
          </div>

          {/* Product Details & Copy */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#FFE3AC] font-bold block mb-1">
                Signature Collection
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF5EA] leading-tight">
                {product.name}
              </h2>
              <p className="text-sm font-semibold text-[#E5C396] mt-1">
                MK {product.price?.toLocaleString()}
              </p>
            </div>

            <p className="text-xs text-[#F3E8DF]/75 leading-relaxed font-light">
              {product.description ||
                "Handcrafted fresh in small batches using premium imported dark chocolate and organic local dairy. Prepared exclusively to order."}
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-[#E5C396]/90">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFE3AC]"></span>
                Baked fresh within 24 hours of delivery
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#E5C396]/90">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFE3AC]"></span>
                Custom size & inscription options available
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-4">
              <button
                onClick={() => {
                  onClose();
                  onOpenOrder(product);
                }}
                className="w-full bg-gradient-to-r from-[#FFE3AC] via-[#D4A359] to-[#996A22] text-[#110806] font-bold text-xs py-3.5 rounded-xl shadow-[0_0_25px_rgba(212,163,89,0.4)] hover:brightness-110 transition uppercase tracking-wider cursor-pointer"
              >
                Order Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
