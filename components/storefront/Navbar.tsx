"use client";

export default function Navbar() {
  return (
    <header className="relative py-16 px-6 text-center border-b border-[#E5C396]/20 bg-gradient-to-b from-[#1C0D0A] to-[#110806]">
      <div className="max-w-4xl mx-auto space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#FFE3AC] font-bold block">
          Dark Chocolate & Champagne Gold
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#FFF5EA] tracking-wide">
          Talipu Bakery
        </h1>
        <p className="text-xs sm:text-sm text-[#E5C396]/80 max-w-md mx-auto font-light">
          Bespoke artisanal confections crafted for moments of pure indulgence.
        </p>
      </div>
    </header>
  );
}
