"use client";

import { useState, useEffect } from "react";

interface HeroImage {
  id: string;
  image_url: string;
  alt_text: string;
}

export default function HeroSection() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Fetch showcase cake images for the Hero frame (from DB)
  useEffect(() => {
    async function fetchImages() {
      // Replace with your Supabase DB query when ready
      const data: HeroImage[] = [
        {
          id: "1",
          image_url:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80",
          alt_text: "Dark Chocolate Gold Cake",
        },
        {
          id: "2",
          image_url:
            "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80",
          alt_text: "Champagne Velvet Cake",
        },
        {
          id: "3",
          image_url:
            "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80",
          alt_text: "Gold Leaf Masterpiece",
        },
      ];
      setHeroImages(data);
    }
    fetchImages();
  }, []);

  // Cycle ONLY the showcased image every 3 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
      setImageError(false); // Reset error state on cycle
    }, 3000);

    return () => clearInterval(timer);
  }, [heroImages]);

  const activeImage = heroImages[currentIndex];

  return (
    <section className="relative w-full bg-[#110806] py-16 px-6 border-b border-[#E5C396]/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Hero Text & Call to Action */}
        <div className="space-y-6 text-center lg:text-left">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#FFE3AC] font-bold bg-[#2A1612] border border-[#E5C396]/30 px-4 py-1.5 rounded-full inline-block">
            Talipu Reserve Collection
          </span>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#FFF5EA] leading-tight">
            Handcrafted <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE3AC] via-[#D4A359] to-[#996A22]">
              Luxury Confections
            </span>
          </h1>

          <p className="text-sm text-[#E5C396]/80 font-light max-w-md mx-auto lg:mx-0 leading-relaxed">
            Bespoke cake commissions made with fine Valrhona dark chocolate,
            gold leaf accents, and tailor-made flavor profiles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <a
              href="#menu-collection"
              className="w-full sm:w-auto bg-gradient-to-r from-[#FFE3AC] via-[#D4A359] to-[#996A22] text-[#110806] font-bold text-xs px-8 py-3.5 rounded-2xl shadow hover:brightness-110 transition uppercase tracking-widest text-center"
            >
              Explore Menu
            </a>
          </div>
        </div>

        {/* Right Side: Showcase Image Frame (Changes Every 3 Seconds) */}
        <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden border border-[#E5C396]/30 bg-[#1C0D0A] shadow-[0_0_50px_rgba(212,163,89,0.15)] flex items-center justify-center">
          {activeImage && !imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={activeImage.id}
              src={activeImage.image_url}
              alt={activeImage.alt_text}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out animate-fade-in"
            />
          ) : (
            /* Luxury Fallback Card if image link breaks */
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#2A1612] to-[#110806] p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full border border-[#E5C396]/50 flex items-center justify-center text-[#FFE3AC] font-serif text-2xl font-bold">
                ◆
              </div>
              <h3 className="text-sm font-serif font-bold text-[#FFF5EA]">
                Talipu Signature Piece
              </h3>
              <p className="text-xs text-[#E5C396]/60">
                Handcrafted Fresh Daily
              </p>
            </div>
          )}

          {/* 3-Second Cycle Progress Bar Indicators on the Image */}
          {heroImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {heroImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentIndex
                      ? "w-8 bg-[#FFE3AC] shadow-[0_0_10px_#FFE3AC]"
                      : "w-2 bg-[#E5C396]/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
