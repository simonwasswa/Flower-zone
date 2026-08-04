import type { Testimonial } from '../../data/content';

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <article className="rounded-[8px] border-l-[3px] border-rose-deep bg-white/60 px-7 py-7">
      <p className="text-sm italic leading-6 text-ink-soft">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush text-rose-deep text-xs font-semibold">
          {initials}
        </span>
        <div>
          <p className="text-sm font-medium text-ink">{testimonial.name}</p>
          <p className="text-xs text-muted">{testimonial.role}</p>
        </div>
      </div>
    </article>
  );
}
