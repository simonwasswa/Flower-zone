import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import Eyebrow from '../ui/Eyebrow';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { handleImageError, resolveMediaUrl } from '../../lib/media';
import weddingSlide from '../../assets/hero-wedding-polished.png';
import giftBasketSlide from '../../assets/hero-gift-basket-polished.png';
import redRosesSlide from '../../assets/hero-red-roses-polished.png';
import pinkBouquetSlide from '../../assets/hero-pink-bouquet-polished.png';

const fallbackHero = {
  eyebrow: 'Premium Occasion Specialists',
  title: "Flower Zone: Artistry for Life's Major Moments",
  body: 'From breathtaking weddings to intimate surprises, we specialize in premium floral services that transform occasions into unforgettable memories. Bespoke, elegant, and delivered with unmatched sophistication.',
  image: '',
  ctaLabel: 'Book a Consultation',
  ctaHref: '/contact#contact-form',
  secondaryCtaLabel: 'Explore Gallery',
  secondaryCtaHref: '/gallery',
};

export default function Hero() {
  const navigate = useNavigate();
  const [hero, setHero] = useState(fallbackHero);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroSlides = [weddingSlide, giftBasketSlide, redRosesSlide, pinkBouquetSlide];

  useEffect(() => {
    let cancelled = false;

    async function loadHero() {
      const { data, error } = await supabase
        .from('site_sections')
        .select('eyebrow,title,body,image_url,cta_label,cta_href,secondary_cta_label,secondary_cta_href,updated_at')
        .eq('page_key', 'home')
        .eq('section_key', 'hero')
        .eq('is_published', true)
        .maybeSingle();

      if (cancelled || error || !data) return;
      setHero({
        eyebrow: data.eyebrow || fallbackHero.eyebrow,
        title: data.title || fallbackHero.title,
        body: data.body || fallbackHero.body,
        image: resolveMediaUrl(data.image_url, data.updated_at || Date.now()),
        ctaLabel: data.cta_label || fallbackHero.ctaLabel,
        ctaHref: data.cta_href || fallbackHero.ctaHref,
        secondaryCtaLabel: data.secondary_cta_label || fallbackHero.secondaryCtaLabel,
        secondaryCtaHref: data.secondary_cta_href || fallbackHero.secondaryCtaHref,
      });
    }

    void loadHero();
    window.addEventListener('focus', loadHero);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadHero);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <section className="relative isolate min-h-[560px] overflow-hidden bg-[#fcf5f2] sm:min-h-[630px] lg:min-h-[720px]">
      {heroSlides.map((slide, index) => (
        <img
          key={slide}
          src={slide}
          alt={index === activeSlide ? 'Premium Flower Zone floral arrangement' : ''}
          aria-hidden={index !== activeSlide}
          onError={handleImageError}
          className={`${index === activeSlide ? 'opacity-100' : 'opacity-0'} absolute inset-0 -z-30 h-full w-full object-cover object-[68%_center] transition-opacity duration-1000 ease-in-out`}
        />
      ))}
      <div className="absolute inset-0 -z-20 bg-[#fcf5f2]/35 lg:bg-transparent" />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(90deg, #fcf5f2 0%, rgba(252,245,242,0.98) 30%, rgba(252,245,242,0.86) 45%, rgba(252,245,242,0.32) 67%, rgba(252,245,242,0.06) 100%)',
        }}
      />

      <div className="mx-auto flex min-h-[560px] max-w-[1440px] items-center px-5 py-14 sm:min-h-[630px] sm:px-8 sm:py-16 md:py-20 lg:min-h-[720px] lg:px-12">
        <div className="max-w-[760px]">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 className="mt-4 max-w-[15ch] font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl lg:text-[3.65rem]">
            {hero.title}
          </h1>
          <p className="mt-7 max-w-[620px] text-[15px] leading-7 text-ink-soft sm:text-base sm:leading-8">
            {hero.body}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button className="w-full min-[420px]:w-auto" variant="primary" onClick={() => navigate(hero.ctaHref)}>{hero.ctaLabel}</Button>
            <Button className="w-full min-[420px]:w-auto" variant="outline" onClick={() => navigate(hero.secondaryCtaHref)}>{hero.secondaryCtaLabel}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
