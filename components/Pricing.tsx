// components/Pricing.tsx - Exact like your MKW screenshot
export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative bg-[#FFF2F2] py-16 px-4 overflow-hidden"
    >
      {/* GOLD FLORAL BACKGROUND - TOP */}
      <div className="absolute top-0 left-0 right-0 h-[200px] pointer-events-none opacity-40">
        <div className="absolute top-4 left-[5%] text-[#C9A86A] text-6xl font-light">
          ❀
        </div>
        <div className="absolute top-8 left-[18%] text-[#C9A86A] opacity-60">
          <svg
            width="120"
            height="80"
            viewBox="0 0 100 60"
            fill="none"
            stroke="#C9A86A"
            strokeWidth="0.6"
          >
            <path d="M10 50 Q30 10 50 30 T90 20" />
            <circle cx="20" cy="30" r="3" />
            <circle cx="50" cy="25" r="4" />
          </svg>
        </div>
        <div className="absolute top-4 right-[5%] text-[#C9A86A] text-6xl font-light scale-x-[-1]">
          ❀
        </div>
        <div className="absolute top-8 right-[18%] text-[#C9A86A] opacity-60 scale-x-[-1]">
          <svg
            width="120"
            height="80"
            viewBox="0 0 100 60"
            fill="none"
            stroke="#C9A86A"
            strokeWidth="0.6"
          >
            <path d="M10 50 Q30 10 50 30 T90 20" />
            <circle cx="20" cy="30" r="3" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-[48px] font-bold text-[#9C7A2D] tracking-tight">
            Our Pricing
          </h2>
          <p className="text-[#7A1F2E] text-[15px] mt-2 font-medium">
            Delicious cakes for every celebration. Made with love in Blantyre,
            Malawi.
          </p>

          <div className="inline-flex mt-4 bg-[#FFF8E7] border border-[#C9A86A]/60 rounded-full px-5 py-1.5 text-[19px] text-[#5A3A2A] font-medium">
            Freshly baked • Delivery in Lilongwe
          </div>
        </div>

        {/* 3 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Birthday */}
          <div className="bg-[#FFFCFA] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white p-7 text-center relative">
            <div className="flex justify-center mb-3">
              <div className="text-[#9C7A2D]">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M3 20h18M5 20v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8" />
                  <path d="M8 12V9m4 3V8m4 4v-3" />
                  <circle cx="8" cy="7" r="1" />
                  <circle cx="12" cy="6" r="1" />
                  <circle cx="16" cy="7" r="1" />
                </svg>
              </div>
            </div>
            <h3 className="text-[#7A1F2E] font-bold text-[20px]">
              Birthday Cakes
            </h3>
            <p className="text-[#9C7A2D] font-bold text-[22px] mt-1">
              From MKW 25,000
            </p>
            <p className="text-[#5A3A2A] text-[12px] mt-1">
              Perfect for birthdays & celebrations
            </p>

            <ul className="text-left mt-6 space-y-2.5 text-[12px] text-[#2A2A2A]">
              {[
                "Custom flavours & designs",
                "Sizes: 1kg, 2kg, 3kg available",
                "Buttercream or fondant finish",
                "Candles & name decoration included",
                "Ready in 2-3 days",
              ].map((t) => (
                <li key={t} className="flex gap-2 items-start">
                  <span className="w-4 h-4 rounded-full bg-[#FFE8D6] flex items-center justify-center text-[#9C7A2D] text-[10px] mt-0.5">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/265880808334?text=Hi! I want Birthday Package - From MKW 25,000"
              target="_blank"
              className="mt-6 block bg-[#FADBD8] hover:bg-[#F8C6C0] text-[#7A1F2E] font-bold text-[13px] py-3 rounded-[8px] border border-[#C9A86A]/30"
            >
              Choose Birthday Package
            </a>
          </div>

          {/* Wedding - MOST POPULAR */}
          <div className="bg-[#FFFCFA] rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-white p-7 text-center relative mt-2 md:mt-0">
            <div className="absolute -top-3 -left-2 bg-[#E8A5A5] text-white text-[11px] font-bold px-5 py-1.5 rounded-r-[8px] rounded-l-[2px] shadow tracking-wide">
              MOST POPULAR
              <div className="absolute left-0 -bottom-1.5 w-2 h-2 bg-[#B87A7A] rotate-45"></div>
            </div>

            <div className="flex justify-center mb-3 mt-2">
              <div className="text-[#9C7A2D]">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M12 20l-5-5 5-5 5 5-5 5z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
            </div>
            <h3 className="text-[#7A1F2E] font-bold text-[20px]">
              Wedding Cakes
            </h3>
            <p className="text-[#9C7A2D] font-bold text-[22px] mt-1">
              From MKW 150,000
            </p>
            <p className="text-[#5A3A2A] text-[12px] mt-1">
              Elegant & timeless for your special day
            </p>

            <ul className="text-left mt-6 space-y-2.5 text-[12px] text-[#2A2A2A]">
              {[
                "Multi-tier designs available",
                "Floral or traditional décor",
                "Tasting session included",
                "Delivery & setup included",
                "Custom flavour combinations",
              ].map((t) => (
                <li key={t} className="flex gap-2 items-start">
                  <span className="w-4 h-4 rounded-full bg-[#FFE8D6] flex items-center justify-center text-[#9C7A2D] text-[10px] mt-0.5">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/265880808334?text=Hi! I want Wedding Package - From MKW 150,000"
              target="_blank"
              className="mt-6 block bg-[#B88A2A] hover:bg-[#9C7A2D] text-white font-bold text-[13px] py-3 rounded-[8px] shadow"
            >
              Choose Wedding Package
            </a>
          </div>

          {/* Custom */}
          <div className="bg-[#FFFCFA] rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white p-7 text-center relative">
            <div className="flex justify-center mb-3">
              <div className="text-[#9C7A2D]">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path d="M4 14l8-8 8 8-8 8-8-8z" />
                  <path d="M2 10h20M2 14h20" />
                </svg>
              </div>
            </div>
            <h3 className="text-[#7A1F2E] font-bold text-[20px]">
              Custom Cakes
            </h3>
            <p className="text-[#9C7A2D] font-bold text-[22px] mt-1">
              From MKW 35,000
            </p>
            <p className="text-[#5A3A2A] text-[12px] mt-1">
              Designed just for you
            </p>

            <ul className="text-left mt-6 space-y-2.5 text-[12px] text-[#2A2A2A]">
              {[
                "Fully custom design & flavour",
                "Corporate, baby shower & events",
                "Dietary options: eggless, gluten-free",
                "Photo or themed cakes",
                "5-7 days advance booking",
              ].map((t) => (
                <li key={t} className="flex gap-2 items-start">
                  <span className="w-4 h-4 rounded-full bg-[#FFE8D6] flex items-center justify-center text-[#9C7A2D] text-[10px] mt-0.5">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/265880808334?text=Hi! I want Custom Cake - From MKW 35,000"
              target="_blank"
              className="mt-6 block bg-[#FADBD8] hover:bg-[#F8C6C0] text-[#7A1F2E] font-bold text-[13px] py-3 rounded-[8px] border border-[#C9A86A]/30"
            >
              Create Custom Order
            </a>
          </div>
        </div>

        <p className="text-center text-[19px] text-[#5A3A2A] mt-8">
          Custom orders require a 80% deposit &nbsp;•&nbsp; Free consultation
          &nbsp;•&nbsp; Call/WhatsApp: +265 880 808 334 &nbsp;•&nbsp; Lilongwe,
          Malawi
        </p>
      </div>
    </section>
  );
}
