import { useEffect, useState } from 'react';
import Eyebrow from '../ui/Eyebrow';
import TestimonialCard from './TestimonialCard';
import { testimonials } from '../../data/content';
import { supabase } from '../../lib/supabase';
import { resolveMediaUrl } from '../../lib/media';

const clientStoriesVideo = resolveMediaUrl('WhatsApp Video 2026-08-04 at 10.53.47 AM.mp4');

export default function ClientStories() {
  const [displayTestimonials, setDisplayTestimonials] = useState(testimonials);
  const [storyImage, setStoryImage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadTestimonials() {
      const testimonialsResult = await supabase
        .from('testimonials')
        .select('id,quote,customer_name,customer_role,image_url,sort_order,updated_at')
        .eq('is_published', true)
        .order('sort_order');

      if (cancelled) return;

      const { data, error } = testimonialsResult;
      if (!error && data?.length) {
        setDisplayTestimonials(data.map((row) => ({
          id: row.id,
          quote: row.quote,
          name: row.customer_name,
          role: row.customer_role || '',
        })));

        const imageRow = data.find((row) => row.image_url);
        if (imageRow) setStoryImage(resolveMediaUrl(imageRow.image_url, imageRow.updated_at));
      }
    }

    void loadTestimonials();
    window.addEventListener('focus', loadTestimonials);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadTestimonials);
    };
  }, []);

  return (
    <section className="bg-[#fcf5f4] py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="text-center">
          <Eyebrow align="center">Heartfelt Connections</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">Client Stories</h2>
          <p className="mt-2 text-sm text-muted">Real moments of joy curated by Flower Zone.</p>
        </div>

        <div className="mt-9 grid min-w-0 items-stretch gap-8 sm:mt-12 md:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-blush-dark shadow-sm">
            {clientStoriesVideo ? (
              <video
                src={clientStoriesVideo}
                controls
                playsInline
                preload="metadata"
                poster={storyImage || undefined}
                aria-label="Flower Zone client story video"
                className="h-full w-full object-cover"
              >
                Your browser does not support embedded video.
              </video>
            ) : null}
          </div>

          <div className="min-w-0">
            <div
              className="testimonial-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:max-h-[500px] md:snap-y md:flex-col md:gap-5 md:overflow-x-hidden md:overflow-y-auto md:pb-0 md:pr-3"
              aria-label="Client testimonials"
            >
              {displayTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-[88%] shrink-0 snap-start md:w-full">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
