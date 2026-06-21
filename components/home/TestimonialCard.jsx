import { Quote } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="flex flex-1 flex-col rounded-2xl bg-bg-secondary p-8 shadow-sm">
      <Quote className="mb-4 text-primary" size={40} strokeWidth={1.5} />

      <p className="mb-6 flex-1 text-base leading-relaxed text-slate-600">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <p className="text-base font-bold text-ink">{testimonial.name}</p>
      </div>
    </div>
  );
}