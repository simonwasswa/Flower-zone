import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import LeafEdge from '../ui/LeafEdge';
import { supabase } from '../../lib/supabase';
import { handleImageError } from '../../lib/media';
import weddingSlide from '../../assets/hero-wedding-polished.webp';
import giftBasketSlide from '../../assets/hero-gift-basket-polished.webp';
import redRosesSlide from '../../assets/hero-red-roses-polished.webp';
import pinkBouquetSlide from '../../assets/hero-pink-bouquet-polished.webp';

const fallbackHero = {
  eyebrow: 'Premium Occasion Specialists',
  title: "Flower Zone: Artistry for Life's Major Moments",
  body: 'From breathtaking weddings to intimate surprises, we specialize in premium floral services that transform occasions into unforgettable memories. Bespoke, elegant, and delivered with unmatched sophistication.',
  ctaLabel: 'Book a Consultation',
  ctaHref: '/contact#contact-form',
  secondaryCtaLabel: 'Explore Gallery',
  secondaryCtaHref: '/gallery',
};

const heroSlides = [pinkBouquetSlide, weddingSlide, giftBasketSlide, redRosesSlide];

function enterDelay(ms: number) {
  return { '--enter-delay': `${ms}ms` } as CSSProperties;
}

export default function Hero() {
  const [hero, setHero] = useState(fallbackHero);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadHero() {
      const { data, error } = await supabase
        .from('site_sections')
        .select('eyebrow,title,body,cta_label,cta_href,secondary_cta_label,secondary_cta_href')
        .eq('page_key', 'home')
        .eq('section_key', 'hero')
        .eq('is_published', true)
        .maybeSingle();

      if (cancelled || error || !data) return;
      setHero({
        eyebrow: data.eyebrow || fallbackHero.eyebrow,
        title: data.title || fallbackHero.title,
        body: data.body || fallbackHero.body,
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
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section data-header-dark className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-ink h-[100svh] max-h-[920px]">
      {heroSlides.map((slide, index) => (
        <img
          key={slide}
          src={slide}
          alt={index === activeSlide ? 'Premium Flower Zone floral arrangement' : ''}
          aria-hidden={index !== activeSlide}
          onError={handleImageError}
          decoding="async"
          className={`${
            index === activeSlide ? 'scale-110 opacity-100' : 'scale-100 opacity-0'
          } absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center] [transition:opacity_1.4s_ease,transform_9s_ease-out]`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-ink/45 md:bg-ink/10 lg:bg-transparent" />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(48,40,39,0.9) 0%, rgba(48,40,39,0.72) 38%, rgba(48,40,39,0.28) 68%, rgba(48,40,39,0.12) 100%), linear-gradient(0deg, rgba(48,40,39,0.35), transparent 40%)',
        }}
      />

      <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 lg:px-12">
        <div className="max-w-[620px]">
          <p className="hero-enter text-xs font-medium uppercase tracking-[0.28em] text-rose" style={enterDelay(150)}>
            {hero.eyebrow}
          </p>
          <h1
            className="hero-enter mt-5 font-display text-[2.6rem] font-normal leading-[1.1] text-cream sm:text-6xl lg:text-[4.1rem]"
            style={enterDelay(300)}
          >
            {hero.title}
          </h1>
          <p className="hero-enter mt-8 max-w-[520px] text-[15px] leading-7 text-cream/80" style={enterDelay(500)}>
            {hero.body}
          </p>
          <div className="hero-enter mt-10 flex flex-wrap gap-4" style={enterDelay(700)}>
            <Link
              to={hero.ctaHref}
              className="inline-flex min-h-12 w-full items-center justify-center bg-cream px-8 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose hover:text-white hover:shadow-lg min-[420px]:w-auto"
            >
              {hero.ctaLabel}
            </Link>
            <Link
              to={hero.secondaryCtaHref}
              className="inline-flex min-h-12 w-full items-center justify-center border border-cream/80 px-8 text-sm font-medium text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream hover:text-ink min-[420px]:w-auto"
            >
              {hero.secondaryCtaLabel}
            </Link>
          </div>
        </div>

        <div className="hero-enter mt-12 flex gap-2" style={enterDelay(900)} aria-label="Hero slides">
          {heroSlides.map((slide, index) => (
            <button
              key={slide}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeSlide}
              className="group grid h-8 place-items-center"
            >
              <span
                className={`block h-0.5 rounded-full transition-all duration-500 ${
                  index === activeSlide ? 'w-10 bg-cream' : 'w-5 bg-cream/40 group-hover:bg-cream/70'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <LeafEdge position="bottom" />
    </section>
  );
}
