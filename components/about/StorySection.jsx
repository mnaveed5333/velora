import { Ruler } from "lucide-react";

export default function StorySection() {
  return (
    <section className="bg-bg-secondary py-16 pb-39 pt-29">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1">
          
          {/* Image - 65% width from the left, no rounding */}
          <div className="overflow-hidden lg:w-[65%]">
            <img
              src="/aboutstory.jpg"
              alt="Friends hanging out"
              className="h-[600px] w-full object-cover lg:h-[560px]"
            />
          </div>

          {/* Text Card - overlapping, more rounded, shifted down, 100px gap from right */}
          <div className="relative z-10 -mt-16 mx-4 flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-xl sm:-mt-20 lg:absolute lg:bottom-0 lg:right-[80px] lg:top-20 lg:mx-0 lg:mt-0 lg:w-[calc(40%+40px)] lg:translate-y-16 lg:rounded-[2.5rem] lg:p-16">
            <Ruler size={40} strokeWidth={1.5} className="mb-5 text-primary" />
            <h2 className="mb-4 text-2xl font-bold text-ink sm:text-3xl">
              More Than Just Clothing
            </h2>
            <p className="font-semibold text-slate-700 leading-relaxed">
              At Velora, we believe fashion should feel as good as it looks.
              Born from a passion for timeless design and everyday comfort,
              our mission is simple: to create versatile, high-quality clothing
              that empowers confidence — for everyone, every day.
            </p>
            <p className="mt-4 font-semibold text-slate-700 leading-relaxed">
              Whether you're dressing up for a moment or down for the
              everyday, our collections are made to move with you, evolve with
              your lifestyle, and elevate your wardrobe — effortlessly.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}