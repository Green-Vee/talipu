// components/Navbar.tsx - WITH LINK LOGO

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#FFF8F8] w-full h-[80px] px-6 md:px-10 flex items-center justify-between border-b border-[#E8C4C4]/20 sticky top-0 z-50">
      {/* LEFT: Logo + Name - CLICKABLE TO HOME */}
      <Link href="/" className="flex items-center gap-3">
        <img
          src="Talipu.jpeg"
          alt="Talipu Logo"
          className="w-[55px] h-[55px] object-contain"
        />
        <div className="flex flex-col">
          <span className="font-serif text-[32px] font-bold text-[#9C7A2D] leading-none">
            Talipu
          </span>
          <span className="text-[10px] tracking-[0.5px] text-[#9C7A2D] mt-1">
            Morethan just a bakery...
          </span>
        </div>
      </Link>

      {/* RIGHT: Order Button */}
      <a
        href="https://wa.me/265880808334?text=Hi Talipu! I want to order"
        target="_blank"
        className="border border-[#C9A86A] text-[#9C7A2D] px-6 py-2 rounded-[8px] text-[14px] font-medium hover:bg-[#C9A86A] hover:text-white transition"
      >
        Order Now
      </a>
    </nav>
  );
}
