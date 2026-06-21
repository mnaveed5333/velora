import Button from "@/components/ui/Button";

export default function HeroBanner() {
  return (
    <section className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-ink text-center text-white md:aspect-auto md:min-h-[600px] lg:min-h-[680px]">
      {/* Mobile hero image: shown below md, drives section height via aspect-ratio */}
      <img
        src="/hero-banner.png"
        alt=""
        className="absolute inset-0 block h-full w-full object-cover opacity-60 md:hidden"
      />

      {/* Desktop hero image: shown from md up, fixed min-h drives height */}
      <img
        src="/hero-bannerd.png"
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover opacity-60 md:block"
      />

      <div className="relative z-10 max-w-xl px-4">
        <h1 className="mb-4 text-3xl font-semibold leading-tight sm:text-5xl">
          Timeless Fashion for the Modern Wardrobe
        </h1>
        <p className="mb-6 text-sm text-slate-200 sm:text-base">
          Discover fashion for Men, Women, and Kids — crafted for comfort, designed for confidence.
        </p>
        <Button href="/shop">Explore the Collection</Button>
      </div>
    </section>
  );
}