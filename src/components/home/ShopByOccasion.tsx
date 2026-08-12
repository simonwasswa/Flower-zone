import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import OccasionCard from './OccasionCard';
import { occasions } from '../../data/content';
import { supabase } from '../../lib/supabase';
import { resolveMediaUrl } from '../../lib/media';

export default function ShopByOccasion() {
  const [displayOccasions, setDisplayOccasions] = useState<typeof occasions>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollControls = useCallback(() => {
    const row = scrollRef.current;
    if (!row) return;

    const maxScrollLeft = row.scrollWidth - row.clientWidth;
    setCanScrollLeft(row.scrollLeft > 2);
    setCanScrollRight(maxScrollLeft - row.scrollLeft > 2);
  }, []);

  const scrollRow = (direction: -1 | 1) => {
    const row = scrollRef.current;
    if (!row) return;

    row.scrollBy({
      left: direction * Math.max(row.clientWidth * 0.8, 240),
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    let cancelled = false;
    async function loadOccasions() {
      const { data, error } = await supabase
        .from('occasions')
        .select('slug,title,subtitle,image_url,is_video,sort_order,updated_at')
        .eq('is_published', true)
        .order('sort_order');
      if (cancelled || error || !data?.length) return;
      setDisplayOccasions(data.map((row) => {
        const mediaUrl = resolveMediaUrl(row.image_url, row.updated_at || Date.now());
        return {
          id: row.slug,
          title: row.title,
          subtitle: row.subtitle || '',
          image: mediaUrl,
        };
      }));
    }
    void loadOccasions();
    window.addEventListener('focus', loadOccasions);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadOccasions);
    };
  }, []);

  useEffect(() => {
    const row = scrollRef.current;
    if (!row) return;

    updateScrollControls();
    row.addEventListener('scroll', updateScrollControls, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollControls);
    resizeObserver.observe(row);

    return () => {
      row.removeEventListener('scroll', updateScrollControls);
      resizeObserver.disconnect();
    };
  }, [displayOccasions, updateScrollControls]);

  return (
    <section className="bg-[#fffaf8] py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          title="Shop by Occasion"
          subtitle="Tailored collections for every milestone"
          rightSlot={
            <div className="flex items-center gap-3">
              <Link to="/services" className="whitespace-nowrap text-[13px] font-medium text-rose-deep transition-colors hover:text-ink">
                View All Collections&nbsp; &rsaquo;
              </Link>
              <div className="flex gap-2" aria-label="Occasion carousel controls">
                <button
                  type="button"
                  onClick={() => scrollRow(-1)}
                  disabled={!canScrollLeft}
                  aria-label="Previous occasions"
                  className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-rose hover:bg-blush disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRow(1)}
                  disabled={!canScrollRight}
                  aria-label="Next occasions"
                  className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-rose hover:bg-blush disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          }
        />

        <div
          ref={scrollRef}
          onScroll={updateScrollControls}
          className="occasion-scroll mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5"
          aria-label="Shop by occasion"
        >
          {displayOccasions.map((occasion, index) => (
            <div
              key={occasion.id}
              className="occasion-card-reveal w-[72vw] max-w-[290px] shrink-0 snap-start sm:w-[42vw] lg:w-[calc((100%-5rem)/5)] lg:max-w-none"
              style={{ animationDelay: `${Math.min(index, 7) * 80}ms` }}
            >
              <OccasionCard occasion={occasion} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
