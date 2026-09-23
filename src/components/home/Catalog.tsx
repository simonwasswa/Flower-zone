import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, Flower2, Heart } from 'lucide-react';
import LeafEdge from '../ui/LeafEdge';
import OrnamentTitle from '../ui/OrnamentTitle';
import Reveal from '../ui/Reveal';
import { products } from '../../data/content';
import { supabase } from '../../lib/supabase';
import { handleImageError, resolveMediaUrl } from '../../lib/media';
import backdrop from '../../assets/hero-pink-bouquet-polished.webp';
import redRosesPhoto from '../../assets/hero-red-roses-polished.webp';
import bridalGlowPhoto from '../../assets/bridal-glow-clean.webp';

type CatalogItem = {
  id: string;
  name: string;
  tag: string;
  image: string;
};

// Local photos for the built-in arrangements, used until Supabase provides the real catalogue.
const fallbackImages: Record<string, string> = {
  'anniversary-heart': redRosesPhoto,
  'bridal-glow': bridalGlowPhoto,
  'birthday-brights': backdrop,
};

const fallbackItems: CatalogItem[] = products.map(({ id, name, tag, image }) => ({
  id,
  name,
  tag,
  image: image || fallbackImages[id] || '',
}));
const loadingItems: CatalogItem[] = Array.from({ length: 5 }, (_, index) => ({ id: `loading-${index}`, name: '', tag: '', image: '' }));

function orderLink(name: string) {
  const message = `Hello Flower Zone, I'd like to order the ${name} arrangement.`;
  return `https://wa.me/256772262288?text=${encodeURIComponent(message)}`;
}

export default function Catalog() {
  const [items, setItems] = useState<CatalogItem[] | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadArrangements() {
      const { data, error } = await supabase
        .from('arrangements')
        .select('slug,name,tag,image_url,sort_order,updated_at')
        .eq('is_published', true)
        .order('sort_order');
      if (cancelled) return;

      const nextItems = !error && data?.length
        ? data.map((row) => ({
            id: row.slug,
            name: row.name,
            tag: row.tag || '',
            image: resolveMediaUrl(row.image_url, row.updated_at),
          }))
        : fallbackItems;

      setItems((current) => {
        if (!current) setActive(Math.floor(nextItems.length / 2));
        return nextItems;
      });
    }

    void loadArrangements();
    window.addEventListener('focus', loadArrangements);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadArrangements);
    };
  }, []);

  const count = items?.length ?? 0;
  const current = count ? Math.min(active, count - 1) : Math.floor(loadingItems.length / 2);

  function go(direction: number) {
    if (!count) return;
    setActive((index) => (Math.min(index, count - 1) + direction + count) % count);
  }

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {
      setActive((index) => (Math.min(index, count - 1) + 1) % count);
    }, 4500);
    return () => window.clearInterval(interval);
  }, [paused, count]);

  function toggleFavourite(id: string) {
    setFavourites((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section
      data-header-dark
      className="relative isolate overflow-hidden bg-ink pb-36 pt-36 sm:pb-44 sm:pt-44"
      aria-roledescription="carousel"
      aria-label="Arrangement catalogue"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <img src={backdrop} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover blur-[6px]" />
      <div className="absolute inset-0 -z-10 bg-ink/65" />
      <LeafEdge position="top" />

      <OrnamentTitle light>Our Catalogue</OrnamentTitle>

      <Reveal variant="fade" delay={200}>
        <div
          className="catalog-viewport relative mt-12 overflow-hidden py-10"
          style={{ '--active': current } as CSSProperties}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') go(-1);
            if (event.key === 'ArrowRight') go(1);
          }}
          onPointerDown={(event) => {
            pointerStart.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return;
            const distance = event.clientX - pointerStart.current;
            pointerStart.current = null;
            if (Math.abs(distance) > 40) go(distance < 0 ? 1 : -1);
          }}
        >
          <ul className="catalog-track ml-[50%] flex w-max items-center gap-[var(--gap)]">
            {(items ?? loadingItems).map((item, index) => {
              const isActive = items !== null && index === current;
              const loading = items === null;

              return (
                <li
                  key={item.id}
                  aria-hidden={!isActive}
                  className={`relative w-[var(--card-w)] shrink-0 p-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? 'z-10 scale-[1.08] bg-cream shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]'
                      : 'scale-[0.92] bg-blush-dark/80 opacity-75 hover:opacity-95'
                  }`}
                >
                  <div className="aspect-square overflow-hidden bg-blush">
                    {loading ? (
                      <div className="h-full w-full animate-pulse bg-blush-dark" />
                    ) : !item.image ? (
                      <div className="grid h-full w-full place-items-center text-rose">
                        <Flower2 size={44} strokeWidth={1} aria-hidden="true" />
                      </div>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.name}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                        className={`h-full w-full object-cover transition-transform duration-[1200ms] ${isActive ? 'scale-105' : 'scale-100'}`}
                      />
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h3 className="min-w-0 truncate font-display text-base text-ink">{loading ? ' ' : item.name}</h3>
                    <p className="shrink-0 text-xs text-muted">{item.tag}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <a
                      href={orderLink(item.name)}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={isActive ? 0 : -1}
                      className="inline-flex min-h-10 items-center whitespace-nowrap border border-ink px-4 text-xs sm:px-5 font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-cream"
                    >
                      Order now
                    </a>
                    <button
                      type="button"
                      tabIndex={isActive ? 0 : -1}
                      aria-pressed={favourites.has(item.id)}
                      onClick={() => toggleFavourite(item.id)}
                      className="inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap text-xs text-muted transition-colors hover:text-rose-deep"
                    >
                      Favourite
                      <Heart
                        size={14}
                        className={`transition-transform duration-300 ${favourites.has(item.id) ? 'scale-125 fill-rose-dark text-rose-dark' : ''}`}
                      />
                    </button>
                  </div>

                  {!isActive && !loading && (
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setActive(index)}
                      className="absolute inset-0 z-10 cursor-pointer"
                      aria-label={`Show ${item.name}`}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {count > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous arrangement"
              className="grid size-9 place-items-center rounded-full border border-cream/40 text-cream transition hover:border-cream hover:bg-cream hover:text-ink"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {items?.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show ${item.name}`}
                  aria-current={index === current}
                  className={`size-2.5 rounded-full border border-cream transition-all duration-500 ${
                    index === current ? 'scale-125 bg-cream' : 'bg-transparent hover:bg-cream/50'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next arrangement"
              className="grid size-9 place-items-center rounded-full border border-cream/40 text-cream transition hover:border-cream hover:bg-cream hover:text-ink"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </Reveal>

      <LeafEdge position="bottom" />
    </section>
  );
}
