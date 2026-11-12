import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import LeafEdge from '../ui/LeafEdge';
import Magnetic from '../ui/Magnetic';
import SplitText from '../ui/SplitText';
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
const SLIDE_MS = 6000;
const accentWords = ['artistry', 'moments', 'unforgettable'];

function enterDelay(ms: number) {
  return { '--enter-delay': `${ms}ms` } as CSSProperties;
}

export default function Hero() {
  const [hero, setHero] = useState(fallbackHero);
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

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

    // Restarting the timer on every change means a manual pick gets a full 6 seconds too.
    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, SLIDE_MS);

    return () => window.clearTimeout(timer);
  }, [activeSlide]);

  // The photo drifts slower than the page as you scroll, and leans away from the mouse.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;

    const pointer = { x: 0, y: 0 };
    let frame = 0;
    function render() {
      frame = 0;
      const scroll = Math.min(window.scrollY, window.innerHeight);
      media!.style.transform = `translate3d(${pointer.x * -18}px, ${scroll * 0.3 + pointer.y * -12}px, 0) scale(1.06)`;
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(render);
    }
    function onPointer(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      const box = section!.getBoundingClientRect();
      pointer.x = (event.clientX - box.left) / box.width - 0.5;
      pointer.y = (event.clientY - box.top) / box.height - 0.5;
      schedule();
    }

    render();
    window.addEventListener('scroll', schedule, { passive: true });
    section.addEventListener('pointermove', onPointer);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      section.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <section ref={sectionRef} data-header-dark className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-ink h-[100svh] max-h-[920px]">
      <div ref={mediaRef} className="absolute inset-0 -z-20 will-change-transform">
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
          } absolute inset-0 h-full w-full object-cover object-[68%_center] [transition:opacity_1.4s_ease,transform_9s_ease-out]`}
        />
      ))}
      </div>
      <div aria-hidden="true" className="hero-glow absolute -z-10" />
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
          <h1 className="mt-5 font-display text-[2.6rem] font-normal leading-[1.1] text-cream sm:text-6xl lg:text-[4.1rem]">
            <SplitText key={hero.title} text={hero.title} delay={300} stagger={65} accentWords={accentWords} />
          </h1>
          <p className="hero-enter mt-8 max-w-[520px] text-[15px] leading-7 text-cream/80" style={enterDelay(500)}>
            {hero.body}
          </p>
          <div className="hero-enter mt-10 flex flex-wrap gap-4" style={enterDelay(700)}>
            <Magnetic className="w-full min-[420px]:w-auto">
              <Link
                to={hero.ctaHref}
                className="btn-sheen inline-flex min-h-12 w-full items-center justify-center bg-cream px-8 text-sm font-medium text-ink transition-all duration-300 hover:bg-rose hover:text-white hover:shadow-[0_14px_30px_-12px_rgba(219,152,153,0.9)] min-[420px]:w-auto"
              >
                {hero.ctaLabel}
              </Link>
            </Magnetic>
            <Magnetic className="w-full min-[420px]:w-auto">
              <Link
                to={hero.secondaryCtaHref}
                className="btn-fill inline-flex min-h-12 w-full items-center justify-center border border-cream/80 px-8 text-sm font-medium text-cream transition-colors duration-300 hover:text-ink min-[420px]:w-auto"
              >
                <span className="relative">{hero.secondaryCtaLabel}</span>
              </Link>
            </Magnetic>
          </div>
        </div>

        <div className="hero-enter mt-12 flex items-center gap-2" style={enterDelay(900)} aria-label="Hero slides">
          <span className="mr-3 font-display text-sm tabular-nums text-cream/80">
            <span key={activeSlide} className="slide-number inline-block text-cream">{String(activeSlide + 1).padStart(2, '0')}</span>
            <span className="mx-1.5 text-cream/40">/</span>
            {String(heroSlides.length).padStart(2, '0')}
          </span>
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
                className={`relative block h-0.5 overflow-hidden rounded-full bg-cream/30 transition-all duration-500 group-hover:bg-cream/60 ${
                  index === activeSlide ? 'w-14' : 'w-6'
                }`}
              >
                {index === activeSlide && (
                  <span
                    key={activeSlide}
                    className="slide-progress absolute inset-0 origin-left bg-cream"
                    style={{ '--slide-ms': `${SLIDE_MS}ms` } as CSSProperties}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <a href="#why-us" aria-label="Scroll to explore" className="scroll-cue hero-enter absolute bottom-28 right-6 hidden flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cream/70 transition-colors hover:text-cream md:flex lg:right-12" style={enterDelay(1300)}>
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="scroll-cue-line relative block h-14 w-px overflow-hidden bg-cream/25" />
      </a>

      <LeafEdge position="bottom" />
    </section>
  );
}
