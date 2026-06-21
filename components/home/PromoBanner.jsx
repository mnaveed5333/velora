import Button from "@/components/ui/Button";

export default function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="relative overflow-hidden rounded-xl bg-bg-secondary p-4 sm:p-6">
        <picture>
          <source media="(min-width: 640px)" srcSet="/promobanner.avif" />
          <img
            src="/promobanners.jpg"
            alt=""
            className="h-[400px] w-full rounded-xl object-cover sm:h-[600px] sm:w-3/4"
          />
        </picture>

        <div className="mt-4 flex w-full items-center sm:absolute sm:inset-y-6 sm:right-4 sm:mt-0 sm:w-[45%] sm:right-6">
          <div className="w-full rounded-xl bg-white p-6 shadow-xl sm:p-10">
            <h3 className="mb-4 text-2xl font-bold leading-tight text-ink sm:text-3xl md:text-4xl">
              The Exclusive Jackets — Starting at $40
            </h3>
            <p className="mb-6 text-sm text-slate-500 sm:text-base">
              Crafted for comfort, designed for impact — this is the outerwear piece that's redefining everyday style. Our best-selling jacket brings warmth, versatility, and edge to any outfit.
            </p>
            <Button href="/shop">Shop the Exclusive Jacket</Button>
          </div>
        </div>
      </div>
    </section>
  );
}