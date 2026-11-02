"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface HeroImage {
  id: string;
  image_url: string;
  alt_text: string;
}

interface OrderItem {
  id: string;
  name: string;
  size: string;
  image_url?: string;
  note?: string;
}

interface OrderTrackerData {
  order_id: string;
  customer_name: string;
  delivery_date: string;
  item: OrderItem;
  current_step: string;
}

export default function HeroSection() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Tracking inputs & states
  const [heroInputCode, setHeroInputCode] = useState("");
  const [modalInputCode, setModalInputCode] = useState("");

  // Popup Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderTrackerData | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  // Fetch showcase cake images for the Hero frame
  useEffect(() => {
    async function fetchImages() {
      try {
        const { data } = await supabase.from("hero_images").select("*");

        if (data && data.length > 0) {
          setHeroImages(data);
        } else {
          setHeroImages([
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
          ]);
        }
      } catch (err) {
        console.error("Error loading hero images:", err);
      }
    }
    fetchImages();
  }, []);

  // Cycle showcased image every 3 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
      setImageError(false);
    }, 3000);

    return () => clearInterval(timer);
  }, [heroImages]);

  const activeImage = heroImages[currentIndex];

  // Step index mapper matching your database status strings
  const getStepIndex = (status?: string): number => {
    if (!status) return 1;
    const cleanStatus = status
      .toLowerCase()
      .trim()
      .replace(/[\s_-]+/g, "");

    if (
      ["ready", "completed", "readyforpickup", "delivered"].includes(
        cleanStatus,
      )
    ) {
      return 4;
    }
    if (
      ["inoven", "baking", "preparing", "bakinginoven"].includes(cleanStatus)
    ) {
      return 3;
    }
    if (
      ["confirmed", "approved", "orderapproved", "paymentreceived"].includes(
        cleanStatus,
      )
    ) {
      return 2;
    }
    return 1;
  };

  // Database Lookup using your exact schema (tracking_code & flat columns)
  const fetchOrderFromDatabase = async (codeToQuery: string) => {
    const cleanCode = codeToQuery.trim();
    if (!cleanCode) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("tracking_code", cleanCode)
        .single();

      if (orderError || !orderData) {
        console.error("Order lookup error:", orderError);
        setErrorMessage(
          `Order "${cleanCode}" not found. Please check your tracking code.`,
        );
        setOrderDetails(null);
        return;
      }

      const fetchedOrder: OrderTrackerData = {
        order_id: orderData.tracking_code || cleanCode,
        customer_name: orderData.customer_name || "Valued Customer",
        delivery_date:
          orderData.delivery_date ||
          orderData.created_at?.split("T")[0] ||
          "Pending",
        current_step: orderData.status || "received",
        item: {
          id: orderData.product_id || orderData.id,
          name: orderData.product_name || "Bespoke Cake",
          size: orderData.size || "Standard Size",
          note:
            orderData.custom_message ||
            `Thank you for ordering, ${orderData.customer_name}.`,
        },
      };

      setOrderDetails(fetchedOrder);
      setModalInputCode(fetchedOrder.order_id);
    } catch (err) {
      console.error("Unexpected lookup crash:", err);
      setErrorMessage("Could not connect to bakery records.");
      setOrderDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroInputCode.trim()) return;
    setIsModalOpen(true);
    fetchOrderFromDatabase(heroInputCode);
  };

  const handleModalReTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalInputCode.trim()) return;
    fetchOrderFromDatabase(modalInputCode);
  };

  const currentStepIndex = orderDetails
    ? getStepIndex(orderDetails.current_step)
    : 1;

  return (
    <section className="relative w-full bg-[#110806] py-16 px-6 border-b border-[#E5C396]/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Hero Text & Order Tracking Box */}
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

          {/* Persistent Order Tracking Box */}
          <div className="pt-2 max-w-md mx-auto lg:mx-0">
            <div className="bg-[#1C0D0A] border border-[#E5C396]/30 p-4 rounded-2xl shadow-lg space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[#FFE3AC] tracking-wider">
                  Already placed an order?
                </span>
                <span className="text-[10px] text-[#E5C396]/60">
                  Live status lookup
                </span>
              </div>
              <form onSubmit={handleHeroSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter order code (e.g. BAKE-3275)"
                  value={heroInputCode}
                  onChange={(e) => setHeroInputCode(e.target.value)}
                  className="flex-1 bg-[#110806] border border-[#E5C396]/30 text-[#FFF5EA] text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#FFE3AC]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#2A1612] hover:bg-[#381e18] border border-[#E5C396]/40 text-[#FFE3AC] text-xs font-bold px-4 py-2.5 rounded-xl transition uppercase tracking-wider shrink-0"
                >
                  Track
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side: Animated Image Frame */}
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

      {/* TRACKING POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1C1410] to-[#0F0907] border border-[#E5C396]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-[#FFF5EA]">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#E5C396]/60 hover:text-[#FFE3AC] bg-[#2A1612]/80 border border-[#E5C396]/30 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {/* Header Title */}
            <div className="text-center space-y-1 mb-6">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#FFE3AC] font-bold bg-[#2A1612] border border-[#E5C396]/30 px-4 py-1 rounded-full inline-block">
                TALIPU BAKERY LIVE TRACKER
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF5EA] pt-2">
                {isLoading
                  ? "Searching Bakery Records..."
                  : orderDetails
                    ? `Welcome ${orderDetails.customer_name}!`
                    : "Track Your Order"}
              </h2>
              <p className="text-xs text-[#E5C396]/70 italic">
                {orderDetails
                  ? "Here is your detailed order progress:"
                  : "Enter an order code below to look up status"}
              </p>
            </div>

            {/* Modal Input Bar for Re-Tracking */}
            <form
              onSubmit={handleModalReTrack}
              className="flex items-center gap-2 bg-[#110806] border border-[#E5C396]/30 p-1.5 pl-4 rounded-full mb-6"
            >
              <input
                type="text"
                placeholder="Enter another code (e.g. BAKE-3275)..."
                value={modalInputCode}
                onChange={(e) => setModalInputCode(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-[#FFE3AC] tracking-wider focus:outline-none placeholder-[#E5C396]/40"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#FFE3AC] via-[#D4A359] to-[#996A22] text-[#110806] text-xs font-bold px-6 py-2 rounded-full uppercase tracking-wider hover:brightness-110 transition shadow-md shrink-0 disabled:opacity-50"
              >
                {isLoading ? "Querying..." : "Track"}
              </button>
            </form>

            {/* Modal States */}
            {isLoading ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-[#FFE3AC] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-[#E5C396]/70 uppercase tracking-widest">
                  Querying live database...
                </p>
              </div>
            ) : errorMessage ? (
              <div className="py-12 text-center space-y-4">
                <p className="text-sm text-red-400">{errorMessage}</p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#2A1612] border border-[#E5C396]/30 text-[#FFE3AC] text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider"
                >
                  Close & Try Again
                </button>
              </div>
            ) : orderDetails ? (
              <>
                {/* Order Summary Card */}
                <div className="bg-[#150B08] border border-[#E5C396]/25 rounded-2xl p-4 sm:p-5 mb-8 shadow-inner space-y-3">
                  <div className="flex justify-between items-center text-xs border-b border-[#E5C396]/10 pb-2">
                    <span className="font-mono font-bold text-[#FFE3AC]">
                      {orderDetails.order_id}
                    </span>
                    <span className="text-[#E5C396]/80 font-medium">
                      Delivery:{" "}
                      <strong className="text-[#FFF5EA]">
                        {orderDetails.delivery_date}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-start gap-4 pt-1">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-[#E5C396]/40 bg-[#2A1612] overflow-hidden shrink-0 flex items-center justify-center relative shadow-md">
                      {orderDetails.item.image_url ? (
                        <img
                          src={orderDetails.item.image_url}
                          alt={orderDetails.item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-[#FFE3AC]">🎂</span>
                      )}
                    </div>

                    <div className="space-y-1 text-left">
                      <h4 className="text-base font-serif font-bold text-[#FFF5EA]">
                        {orderDetails.item.name}
                      </h4>
                      <p className="text-xs text-[#E5C396]/80 flex items-center gap-1">
                        <span>🎂</span> Size: {orderDetails.item.size}
                      </p>
                      {orderDetails.item.note && (
                        <p className="text-[11px] text-[#E5C396]/60 italic pt-1">
                          &ldquo;{orderDetails.item.note}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* LIVE STEP TIMELINE TRACKER WITH DYNAMIC GREEN CHECKMARKS */}
                <div className="relative my-10 px-2 sm:px-6">
                  {/* Background Track Line */}
                  <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-[#2A1612] rounded-full z-0" />

                  {/* Glowing Progress Bar Fill */}
                  <div
                    className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-[#D4A359] rounded-full z-0 transition-all duration-700"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((currentStepIndex - 1) / 3) * 100))}%`,
                    }}
                  />

                  {/* Steps Grid */}
                  <div className="relative z-10 grid grid-cols-4 text-center">
                    {/* Step 1: Received */}
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                          currentStepIndex > 1
                            ? "border-emerald-500 bg-emerald-950/80 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            : currentStepIndex === 1
                              ? "border-[#FFE3AC] bg-[#2A1612] text-[#FFE3AC] shadow-[0_0_15px_rgba(255,227,172,0.4)]"
                              : "border-[#E5C396]/20 bg-[#150B08] text-[#E5C396]/40"
                        }`}
                      >
                        {currentStepIndex > 1 ? (
                          <span className="text-base font-bold text-emerald-400">
                            ✓
                          </span>
                        ) : (
                          <span className="text-sm">📞</span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p
                          className={`text-xs font-bold ${currentStepIndex >= 1 ? "text-[#FFF5EA]" : "text-[#E5C396]/40"}`}
                        >
                          Received
                        </p>
                        <p className="text-[10px] text-[#E5C396]/60 hidden sm:block">
                          Sent via WhatsApp
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Confirmed */}
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                          currentStepIndex > 2
                            ? "border-emerald-500 bg-emerald-950/80 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            : currentStepIndex === 2
                              ? "border-emerald-400 bg-emerald-900/90 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.7)] animate-pulse"
                              : "border-[#E5C396]/20 bg-[#150B08] text-[#E5C396]/40"
                        }`}
                      >
                        {currentStepIndex >= 2 ? (
                          <span className="text-base font-bold text-emerald-400">
                            ✓
                          </span>
                        ) : (
                          <span className="text-sm">🛡️</span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p
                          className={`text-xs font-bold ${currentStepIndex >= 2 ? "text-emerald-400" : "text-[#E5C396]/40"}`}
                        >
                          Confirmed
                        </p>
                        <p
                          className={`text-[10px] hidden sm:block ${currentStepIndex >= 2 ? "text-emerald-400/80 font-medium" : "text-[#E5C396]/40"}`}
                        >
                          Order approved
                        </p>
                      </div>
                    </div>

                    {/* Step 3: In Oven */}
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                          currentStepIndex > 3
                            ? "border-emerald-500 bg-emerald-950/80 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            : currentStepIndex === 3
                              ? "border-amber-500 bg-amber-950/80 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.8)] scale-110"
                              : "border-[#E5C396]/20 bg-[#150B08] text-[#E5C396]/40"
                        }`}
                      >
                        {currentStepIndex > 3 ? (
                          <span className="text-base font-bold text-emerald-400">
                            ✓
                          </span>
                        ) : (
                          <span
                            className={`text-base ${currentStepIndex === 3 ? "animate-bounce" : ""}`}
                          >
                            🔥
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p
                          className={`text-xs font-bold ${currentStepIndex >= 3 ? "text-amber-400" : "text-[#E5C396]/40"}`}
                        >
                          In Oven
                        </p>
                        <p className="text-[10px] text-[#E5C396]/60 hidden sm:block">
                          Preparing to bake
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Ready */}
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                          currentStepIndex === 4
                            ? "border-emerald-400 bg-emerald-900/90 text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.8)]"
                            : "border-[#E5C396]/20 bg-[#150B08] text-[#E5C396]/40"
                        }`}
                      >
                        {currentStepIndex === 4 ? (
                          <span className="text-base font-bold text-emerald-400">
                            ✓
                          </span>
                        ) : (
                          <span className="text-sm">🎁</span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p
                          className={`text-xs font-bold ${currentStepIndex === 4 ? "text-emerald-400" : "text-[#E5C396]/40"}`}
                        >
                          Ready
                        </p>
                        <p className="text-[10px] text-[#E5C396]/60 hidden sm:block">
                          Ready for you
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-[#E5C396]/15 text-center space-y-2">
                  <p className="text-xs text-[#E5C396]/70">
                    Want to add another cake or pastry to your queue?
                  </p>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      const catalog =
                        document.getElementById("menu-collection");
                      if (catalog) {
                        catalog.scrollIntoView({ behavior: "smooth" });
                      } else {
                        router.push("/");
                      }
                    }}
                    className="text-xs font-bold text-[#FFE3AC] hover:text-[#FFF5EA] transition-colors inline-flex items-center gap-1.5"
                  >
                    ← Make Another Order
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
