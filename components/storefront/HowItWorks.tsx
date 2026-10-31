"use client";

export default function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Select",
      desc: "Choose from our curated menu or signature pieces.",
    },
    {
      num: "2",
      title: "Customize",
      desc: "Add bespoke details, flavors, and personal note.",
    },
    {
      num: "3",
      title: "Schedule",
      desc: "Pick your date and delivery window.",
    },
    {
      num: "4",
      title: "Delivered",
      desc: "Cold-pack delivered fresh to your door.",
    },
  ];

  return (
    <section className="py-20 px-6 border-t border-[#E5C396]/20 bg-[#160B08]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#FFE3AC] font-bold">
            Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF5EA]">
            How It Works — Ordering Flow
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#1C0D0A] border border-[#E5C396]/25 rounded-2xl p-6 space-y-3 relative group hover:border-[#FFE3AC] transition"
            >
              <div className="w-10 h-10 rounded-full bg-[#2A1612] border border-[#E5C396]/40 text-[#FFE3AC] font-serif font-bold flex items-center justify-center shadow">
                {item.num}
              </div>
              <h3 className="text-base font-serif font-bold text-[#FFF5EA]">
                {item.title}
              </h3>
              <p className="text-xs text-[#E5C396]/80 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
