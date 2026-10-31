"use client";

export default function TopNav() {
  return (
    <nav className="w-full border-b border-[#E5C396]/20 bg-[#110806]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#E5C396]/40 flex items-center justify-center text-[#FFE3AC] font-serif font-bold text-sm bg-[#1C0D0A]">
            ◆
          </div>
          <div>
            <h1 className="text-sm font-serif font-bold tracking-[0.2em] text-[#FFF5EA]">
              TALIPU
            </h1>
            <p className="text-[8px] uppercase tracking-[0.3em] text-[#E5C396]/70">
              Luxury Bakery
            </p>
          </div>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-xs text-[#F3E8DF]/80 font-light tracking-wide">
          <a href="#" className="hover:text-[#FFE3AC] transition">
            Home
          </a>
          <a href="#" className="hover:text-[#FFE3AC] transition">
            Collections
          </a>
          <a href="#" className="hover:text-[#FFE3AC] transition">
            Menu
          </a>
          <a href="#" className="hover:text-[#FFE3AC] transition">
            Bespoke
          </a>
          <a href="#" className="hover:text-[#FFE3AC] transition">
            About
          </a>
          <a href="#" className="hover:text-[#FFE3AC] transition">
            Contact
          </a>
        </div>

        {/* Right Action Icons & Badge */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline-block text-[10px] bg-[#2A1612] border border-[#E5C396]/30 text-[#FFE3AC] px-3 py-1 rounded-full tracking-wider">
            ★ Dribbble Best of Year · 2024
          </span>
          <div className="flex items-center gap-3 text-[#E5C396]">
            <button className="hover:text-[#FFE3AC] transition cursor-pointer">
              🔍
            </button>
            <button className="hover:text-[#FFE3AC] transition cursor-pointer">
              👤
            </button>
            <button className="hover:text-[#FFE3AC] transition cursor-pointer">
              🛒
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
