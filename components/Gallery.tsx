// components/Gallery.tsx - Exact like your screenshot
"use client";
import { useState } from "react";

const cakes = [
  { id: 1, name: "Everlasting Romance", sub: "3-Tier Wedding Cake", cat: "Wedding Cakes", desc: "Wedding Cakes • Serves 40-60 • From MK 85,000", price: "MK 85,000", best: true, img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80&auto=format&fit=crop" },
  { id: 2, name: "Confetti Celebration", sub: "Birthday Cake", cat: "Birthday Cakes", desc: "Birthday Cakes • Serves 12-16 • From MK 25,000", price: "MK 25,000", best: false, img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80&auto=format&fit=crop" },
  { id: 3, name: "Blush Floral Custom Cake", sub: "Custom Cakes", cat: "Custom Cakes", desc: "Custom Cakes • Personalized • From MK 45,000", price: "MK 45,000", best: false, img: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600&q=80&auto=format&fit=crop" },
  { id: 4, name: "Golden Love", sub: "Two-Tier Wedding Cake", cat: "Wedding Cakes", desc: "Wedding Cakes • Serves 30-40 • From MK 70,000", price: "MK 70,000", best: true, img: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=600&q=80&auto=format&fit=crop" },
  { id: 5, name: "Chocolate Delight", sub: "Birthday Cake", cat: "Birthday Cakes", desc: "Birthday Cakes • Serves 10-14 • From MK 28,000", price: "MK 28,000", best: false, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80&auto=format&fit=crop" },
  { id: 6, name: "Golden Jubilee Custom Cake", sub: "Custom Cake", cat: "Custom Cakes", desc: "Custom Cake • Custom Design • From MK 55,000", price: "MK 55,000", best: false, img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&q=80&auto=format&fit=crop" },
];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Wedding Cakes", "Birthday Cakes", "Custom Cakes"];
  const filtered = filter === "All" ? cakes : cakes.filter(c => c.cat === filter);

  return (
    <section id="menu" className="bg-[#FFF2F2] relative py-12 px-4 overflow-hidden">
      {/* faint floral bg like screenshot */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{backgroundImage: `url("https://www.transparenttextures.com/patterns/flowers.png")`}}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="font-serif text-[42px] font-bold text-center text-[#7A1F2E]">Gallery</h1>
        <p className="text-center text-[#7A1F2E]/70 text-[14px] mt-1">Handcrafted cakes for your special moments in Lilongwe, Malawi</p>

        <div className="flex gap-2 justify-center mt-6 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-5 py-2 rounded-full text-[13px] font-bold border transition
              ${filter===f ? "bg-[#D4A84B] text-white border-[#D4A84B] shadow" : "bg-[#FFF2F2] text-[#7A1F2E] border-[#E8C4C4] hover:bg-white"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {filtered.map(cake => (
            <div key={cake.id} className="bg-white/90 backdrop-blur rounded-[14px] overflow-hidden shadow-sm border border-white hover:shadow-lg transition">
              <div className="relative h-[220px] bg-[#FFF8F6]">
                {cake.best && <span className="absolute top-3 left-3 bg-[#C9A86A] text-white text-[10px] font-bold px-3 py-1 rounded-full">Bestseller</span>}
                <img src={cake.img} alt={cake.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-[#7A1F2E] text-[15px] leading-tight">{cake.name}</h3>
                <p className="text-[11px] text-gray-500">{cake.sub}</p>
                <p className="text-[11px] text-gray-700 mt-1 font-medium">{cake.desc}</p>
                <a href={`https://wa.me/265880808334?text=Hi! I want ${cake.name} - ${cake.price}`} target="_blank"
                   className="mt-3 inline-block text-[#7A1F2E] text-[12px] font-bold hover:underline">
                  Order on WhatsApp →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}