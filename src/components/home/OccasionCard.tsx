import type { Occasion } from '../../data/content';
import { handleImageError } from '../../lib/media';

export default function OccasionCard({ occasion }: { occasion: Occasion }) {
  return (
    <article className="group block overflow-hidden rounded-[8px] bg-white shadow-[0_1px_0_rgba(80,50,50,.04)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-blush-dark">
        {occasion.image && (
          <img
            src={occasion.image}
            alt={occasion.title}
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="min-h-[86px] px-3 py-4 text-center">
        <h3 className="font-display text-lg font-semibold text-ink">{occasion.title}</h3>
        <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-muted">{occasion.subtitle}</p>
      </div>
    </article>
  );
}
