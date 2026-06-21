export default function BlogHero() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden bg-slate-900 md:h-[520px]">
      
      {/* Desktop Image */}
      <img
        src="/blogd.png"
        alt="Blog Hero"
        className="hidden md:block h-full w-full object-cover object-center"
      />

      {/* Mobile Image */}
      <img
        src="/blogm.png"
        alt="Blog Hero"
        className="block md:hidden h-full w-full object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Text Content */}
      <div className="absolute inset-0 flex items-center justify-end">
        <div className="mr-8 max-w-xs text-right md:mr-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
            The Velora Edit
          </p>
          <h1 className="text-5xl font-bold leading-tight text-white drop-shadow-lg md:text-6xl">
            Style, <br /> Tips & <br /> More
          </h1>
          <div className="my-4 ml-auto h-[2px] w-12 bg-primary" />
          <p className="text-sm leading-relaxed text-white/80">
            Welcome to The Velora Edit, your go-to <br />
            destination for all things fashion.
          </p>
        </div>
      </div>

    </div>
  );
}