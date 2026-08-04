import { useState } from 'react';
import { Heart } from 'lucide-react';
import type { Product } from '../../data/content';
import { handleImageError } from '../../lib/media';

export default function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group">
      <div className="relative aspect-[1.08/1] overflow-hidden rounded-[8px] bg-blush-dark">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <button
          type="button"
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={liked}
          onClick={() => setLiked((v) => !v)}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
        >
          <Heart size={14} className={liked ? 'fill-rose-dark text-rose-dark' : 'text-ink-soft'} />
        </button>
      </div>
      <h3 className="mt-3 text-sm font-medium text-ink sm:text-base">{product.name}</h3>
      <p className="mt-0.5 text-[10px] text-muted">{product.tag}</p>
    </div>
  );
}
