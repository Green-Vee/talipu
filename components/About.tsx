// app/about/page.tsx
export default function About() {
  return (
    <div className="bg-[#FFF2F2] min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-[42px] font-bold text-[#7A1F2E] text-center mb-8">
          Our Story
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img src="Talipu.jpeg" className="rounded-lg shadow-lg" />
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#9C7A2D] mb-4">
              TALIPU is Family
            </h2>
            <p className="text-[#5A3A2A] leading-relaxed mb-4">
              TALIPU is more than a bakery. It&apos;s Alick, Tapiwa, Praise, and
              Uchizi — four names, one heart. We started in Lilongwe with a
              simple belief: every cake should feel like home.
            </p>
            <p className="text-[#5A3A2A] leading-relaxed mb-4">
              When you order from us, you&apos;re not just buying a cake —
              you&apos;re keeping a Malawian family dream alive. From our hands
              to your table, every bite is made with love.
            </p>
            <p className="text-[#5A3A2A] leading-relaxed">
              Zikomo kwambiri (thank you very much) for being part of our story.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="font-serif text-xl text-[#9C7A2D] mb-4">
            Our Promise
          </h3>
          <p className="text-[#5A3A2A] max-w-2xl mx-auto">
            Premium ingredients, traditional Malawi flavors, and a whole lot of
            love in every bite. We&apos;re not just baking cakes — we&apos;re
            baking memories.
          </p>
        </div>
      </div>
    </div>
  );
}
