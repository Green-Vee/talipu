// components/Hero.tsx - FINAL - ONLY LINKS + GOLD BACKGROUND + TEXT VISIBLE
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  // PINK LUXURY CAKES - LINKS ONLY
  const bigCakes = [
    "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=800&q=80&auto=format&fit=crop",
  ];
  const smallCakes = [
    "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=600&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=600&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80&auto=format&fit=crop",
  ];

  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((s) => (s + 1) % 3), 20000); // 20 sec
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative bg-[#FFF2F0] overflow-hidden">
      {/* GOLD FLOWERS - BEHIND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute -top-10 -right-10 w-[650px] h-[650px] bg-[#C9A86A] opacity-[0.08] rounded-full blur-[2px]"
          style={{
            maskImage: "radial-gradient(circle, black 40%, transparent 70%)",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT - TEXT NOW 100% VISIBLE */}
        <div>
         
          <h1 className="font-serif text-[#1A1A1A] text-[48px] md:text-[56px] leading-[0.9] font-bold">
            Cakes for Every
            <br />
            Occasion
          </h1>
          <p className="text-[#222] text-[14px] leading-6 mt-4 max-w-[460px]">
            Handcrafted cakes for weddings, birthdays, anniversaries &
            celebrations — made fresh in Lilongwe with love, buttercream, and
            elegance.
          </p>

          <div className="mt-6 flex flex-col gap-3 max-w-[380px]">
            {/* WhatsApp Button WITH LOGO */}
            <a
              href="https://wa.me/265880808334"
              target="_blank"
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-4 rounded-xl text-center flex items-center justify-center gap-2 shadow-md"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.59 2 2.17 6.42 2.17 11.86c0 1.74.45 3.43 1.31 4.92L2 22l5.38-1.41a9.84 9.84 0 0 0 4.65 1.18h0c5.44 0 9.86-4.42 9.86-9.86a9.77 9.77 0 0 0-2.84-6.99Zm-7.02 15.1h0a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.2.84.85-3.12-.2-.32a8.18 8.18 0 0 1-1.26-4.42c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.22-.08-.39-.12-.55.12-.17.25-.63.81-.77.97-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.01-.38.11-.51.1-.1.25-.26.37-.39.12-.13.17-.22.25-.37.08-.14.04-.27-.02-.39-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42h-.47c-.17 0-.39.06-.6.27-.2.21-.79.77-.79 1.88s.81 2.18.92 2.33c.11.14 1.6 2.44 3.87 3.42.54.23.96.37 1.29.48.54.17 1.03.15 1.42.09.43-.06 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
              </svg>
              WhatsApp: Book Now
            </a>

            {/* View Menu Button FIXED */}
            {/* View Menu Button - Next.js Link */}
            <Link
              href="#menu"
              className="bg-white border-2 border-[#C9A86A] text-[#1A1A1A] font-bold py-4 rounded-xl text-center shadow-sm hover:bg-[#FFF8F0] block"
            >
              View Menu & Flavours
            </Link>
          </div>

          {/* 3 ICONS - BIGGER NOW */}
          <div className="grid grid-cols-3 gap-5 mt-10 max-w-[460px] text-center">
            <div>
              <div className="w-14 h-14 bg-[#C9A86A] rounded-full mx-auto flex items-center justify-center text-white text-[20px] shadow">
                🎂
              </div>
              <p className="font-bold text-[13px] mt-3 text-black">
                Custom Designs
              </p>
              <p className="text-[11px] text-gray-700 mt-1">
                Tailored to your vision
              </p>
            </div>
            <div>
              <div className="w-14 h-14 bg-[#C9A86A] rounded-full mx-auto flex items-center justify-center text-white text-[20px] shadow">
                ♡
              </div>
              <p className="font-bold text-[13px] mt-3 text-black">
                Fresh Daily
              </p>
              <p className="text-[11px] text-gray-700 mt-1">
                Baked with quality
              </p>
            </div>
            <div>
              <div className="w-14 h-14 bg-[#C9A86A] rounded-full mx-auto flex items-center justify-center text-white text-[20px] shadow">
                🚚
              </div>
              <p className="font-bold text-[13px] mt-3 text-black">
                Local Delivery
              </p>
              <p className="text-[11px] text-gray-700 mt-1">Across Lilongwe</p>
            </div>
          </div>
        </div>

        {/* RIGHT - LINKS ONLY */}
        <div className="relative h-[560px]">
          <div className="absolute left-2 top-0 w-[68%] h-[80%] rounded-[28px] overflow-hidden shadow-xl bg-white">
            <img
              src={bigCakes[n]}
              alt="big cake"
              className="w-full h-full object-cover transition-all duration-1000"
            />
          </div>
          <div className="absolute right-0 bottom-12 w-[50%] h-[48%] rounded-[24px] overflow-hidden shadow-xl border-[6px] border-white">
            <img
              src={smallCakes[n]}
              alt="small cake"
              className="w-full h-full object-cover transition-all duration-1000"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-[#FBE0DA] text-center text-[11px] py-2.5 text-[#8B6A4A]">
        Now taking orders for October & November 2024 • Free tasting for wedding
        orders
      </div>
    </section>
  );
}
