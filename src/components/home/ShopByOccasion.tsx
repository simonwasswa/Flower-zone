import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import OccasionCard from './OccasionCard';
import { occasions } from '../../data/content';
import { supabase } from '../../lib/supabase';
import { resolveMediaUrl } from '../../lib/media';

export default function ShopByOccasion() {
  const [displayOccasions, setDisplayOccasions] = useState<typeof occasions>([]);

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

  return (
    <section className="bg-[#fffaf8] py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
      <SectionHeading
        title="Shop by Occasion"
        subtitle="Tailored collections for every milestone"
        rightSlot={
          <Link to="/services" className="whitespace-nowrap text-[13px] font-medium text-rose-deep hover:text-ink">
            View All Collections&nbsp; &rsaquo;
          </Link>
        }
      />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
        {displayOccasions.map((occasion) => (
          <OccasionCard key={occasion.id} occasion={occasion} />
        ))}
      </div>
      </div>
    </section>
  );
}
