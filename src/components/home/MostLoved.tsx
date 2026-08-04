import { useEffect, useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import ProductCard from './ProductCard';
import { products } from '../../data/content';
import { supabase } from '../../lib/supabase';
import { resolveMediaUrl } from '../../lib/media';

export default function MostLoved() {
  const [displayProducts, setDisplayProducts] = useState<typeof products>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadArrangements() {
      const { data, error } = await supabase
        .from('arrangements')
        .select('slug,name,tag,image_url,sort_order,updated_at')
        .eq('is_published', true)
        .order('sort_order');
      if (cancelled || error || !data?.length) return;
      setDisplayProducts(data.map((row) => {
        return {
          id: row.slug,
          name: row.name,
          tag: row.tag || '',
          price: 0,
          image: resolveMediaUrl(row.image_url, row.updated_at || Date.now()),
        };
      }));
    }
    void loadArrangements();
    window.addEventListener('focus', loadArrangements);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadArrangements);
    };
  }, []);

  return (
    <section className="bg-[#fffaf8] py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
      <SectionHeading
        align="center"
        title="Most Loved Arrangements"
        subtitle="Our signature designs, curated for impact."
      />

      <div className="mt-10 grid min-w-0 grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      </div>
    </section>
  );
}
