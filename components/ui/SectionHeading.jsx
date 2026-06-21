export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-12 max-w-2xl ${alignment}`}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      )}
      
      {/* Enlarged title and changed font to serif */}
      <h2 className="font-sans text-4xl font-bold text-ink sm:text-5xl tracking-tight">
        {title}
      </h2>
      
      {/* Enlarged subtitle, adjusted spacing, and added font weight/tracking */}
      {subtitle && (
        <p className="mt-4 font-sans text-base md:text-lg text-slate-500 leading-relaxed max-w-prose mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}