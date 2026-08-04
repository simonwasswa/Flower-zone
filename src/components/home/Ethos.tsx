import { useEffect, useState } from 'react';
import Eyebrow from '../ui/Eyebrow';
import { stats } from '../../data/content';
import { supabase } from '../../lib/supabase';
import { handleImageError, resolveMediaUrl } from '../../lib/media';

export default function Ethos() {
  const [ethosImages, setEthosImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      const { data, error } = await supabase
        .from('services')
        .select('image_url,updated_at')
        .eq('is_published', true)
        .not('image_url', 'is', null)
        .order('sort_order')
        .limit(3);
      if (cancelled || error) return;
      setEthosImages((data ?? []).map((row) => resolveMediaUrl(row.image_url, row.updated_at)).filter(Boolean));
    }

    void loadImages();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="bg-[#f7eaea] py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:px-12">
        <div className="grid grid-cols-[1fr_1.08fr] gap-4">
          <div className="flex flex-col gap-4">
            <div className="aspect-[1.08/1] overflow-hidden rounded-[8px]">
              {ethosImages[0] && <img src={ethosImages[0]} alt="Florist arranging a bouquet by hand" onError={handleImageError} className="h-full w-full object-cover" />}
            </div>
            <div className="aspect-[1.08/1] overflow-hidden rounded-[8px]">
              {ethosImages[1] && <img src={ethosImages[1]} alt="A finished floral arrangement" onError={handleImageError} className="h-full w-full object-cover" />}
            </div>
          </div>
          <div className="aspect-[3/4.25] self-center overflow-hidden rounded-[8px]">
            {ethosImages[2] && (
              <img
                src={ethosImages[2]}
                alt="Premium Flower Zone floral arrangement"
                onError={handleImageError}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        <div>
          <Eyebrow>The Flower Zone Ethos</Eyebrow>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-[2.7rem]">
            Exceptional Florals for Life's Grandest Stages
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-ink-soft">
            Flower Zone was founded on the principle that premium occasions deserve premium
            artistry. We don't just sell flowers; we curate emotional landscapes that honor the
            significance of your most important days.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink-soft">
            Our master florists specialize in large-scale event decor, bespoke wedding packages,
            and highly personalized surprise services, using only the finest Grade-A blooms.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-2 pt-4 text-center sm:gap-5">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl text-rose-deep sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
