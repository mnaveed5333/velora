import Image from "next/image";

export default function DesignSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      {/* Black Text Side */}
      <div className="flex flex-col justify-center bg-ink px-8 py-16 sm:px-12 lg:px-16">
        <h2 className="mb-5 text-4xl font-bold text-white sm:text-4xl">
          Thoughtfully Designed for All
        </h2>
        <p className="text-base font-medium leading-relaxed text-white/90 sm:text-lg">
          Our range covers Men, Women, and Kids, with each piece carefully
          crafted to combine form, function, and feeling. From the perfect polo to
          the softest loungewear and statement outerwear, everything at Velora is
          designed with real life in mind — easy to wear, easy to love. We also
          believe in the power of details. That's why we obsess over fit, fabric,
          and finish — so you don't have to.
        </p>
      </div>

      {/* Image Side */}
      <div className="relative min-h-[300px] lg:min-h-0">
        <Image
          src="/aboutdesign.png"
          alt="Velora clothing collection for men, women, and kids, showcasing thoughtfully designed fits and fabrics"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={false}
        />
      </div>
    </section>
  );
}