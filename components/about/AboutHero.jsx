export default function AboutHero() {
  return (
    <section className="relative flex min-h-[620px] w-full items-center justify-center overflow-hidden sm:h-[520px]">

      {/* Mobile Image */}
      <img
        src="/abouthero.png"
        alt="Style That Moves With You"
        className="absolute inset-0 h-full w-full object-cover sm:hidden"
      />

      {/* Desktop Image */}
      <img
        src="/aboutherod.png"
        alt="Style That Moves With You"
        className="absolute inset-0 hidden h-full w-full object-cover sm:block"
      />

      {/* Light overlay - just enough for subtle depth, image stays visible */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Floating Text Content */}
      <div className="relative z-10 max-w-2xl px-6 text-center">
        <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-md">
          About Velora
        </span>

        <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl">
          Style That <br /> Moves With You
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm font-medium text-white sm:text-lg">
          Born from a passion for timeless design and everyday comfort
        </p>
      </div>

    </section>
  );
}