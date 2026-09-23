import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeOff, Heart, MessageCircle, Sparkles } from 'lucide-react';
import BlossomBackdrop from '../components/ui/BlossomBackdrop';
import PageBanner from '../components/ui/PageBanner';
import aboutBanner from '../assets/hero-wedding-polished.webp';
import { supabase } from '../lib/supabase';
import { handleImageError, resolveMediaUrl } from '../lib/media';

const stories = [
  {
    title: 'The Anniversary Surprise',
    location: 'Kampala, Uganda',
    image: '',
  },
  {
    title: "Grandma's 80th",
    location: 'Entebbe, Uganda',
    image: '',
  },
  {
    title: 'The Big Graduation',
    location: 'Jinja, Uganda',
    image: '',
  },
];

const journey = [
  {
    title: 'Consult',
    description: 'Chat with our Joy Experts to share details about the person and the occasion.',
    icon: MessageCircle,
  },
  {
    title: 'Curate',
    description: 'Our artisans select the freshest blooms and unique add-ons to fit the specific vibe.',
    icon: Sparkles,
  },
  {
    title: 'Surprise',
    description: 'We execute the delivery with precision and optional covert recording to capture the reaction.',
    icon: Heart,
  },
];

export default function About() {
  const [displayStories, setDisplayStories] = useState(stories.slice(0, 0));

  useEffect(() => {
    let cancelled = false;
    async function loadStories() {
      const { data, error } = await supabase
        .from('about_stories')
        .select('title,location,image_url,sort_order,updated_at')
        .eq('is_published', true)
        .order('sort_order');
      if (cancelled || error || !data?.length) return;
      setDisplayStories(data.map((row) => ({
        title: row.title,
        location: row.location || '',
        image: resolveMediaUrl(row.image_url, row.updated_at),
      })));
    }
    void loadStories();
    window.addEventListener('focus', loadStories);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadStories);
    };
  }, []);

  return (
    <div>
      <BlossomBackdrop />
      <PageBanner
        eyebrow="Experiential Gifting"
        title={<>Crafting Unforgettable <em className="text-rose">Moments of Joy</em></>}
        subtitle="More than just flowers, we orchestrate the perfect surprise. From secret admirations to grand romantic gestures, we make their day extraordinary."
        image={aboutBanner}
      >
        <Link to="/contact#contact-form" className="inline-flex min-h-12 w-full items-center justify-center bg-cream px-8 text-sm font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose hover:text-white min-[420px]:w-auto">
          Plan a Surprise
        </Link>
        <Link to="/services" className="inline-flex min-h-12 w-full items-center justify-center border border-cream/80 px-8 text-sm font-medium text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-cream hover:text-ink min-[420px]:w-auto">
          View Packages
        </Link>
      </PageBanner>

      <section className="bg-white/35 py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-ink">Real Surprises, Real Tears</h2>
            <p className="mt-2 text-sm text-muted">Watch how we helped others say what words couldn&apos;t.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {displayStories.map((story) => (
              <article key={story.title} className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-blush-dark">
                {story.image && <img src={story.image} alt={story.title} onError={handleImageError} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 rounded-[8px] bg-white/80 px-4 py-3 backdrop-blur-md">
                  <h3 className="text-sm font-medium text-ink">&ldquo;{story.title}&rdquo;</h3>
                  <p className="mt-0.5 text-[11px] text-muted">{story.location}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fdf3f2]/45 py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold text-ink">Curated Surprise Tiers</h2>
              <p className="mt-2 max-w-xl text-sm text-muted">Whether it&apos;s a whisper or a shout, we have the perfect scale for your emotion.</p>
            </div>
            <Link to="/services" className="text-sm font-medium text-rose-deep hover:text-ink">View full catalogue&nbsp; &rarr;</Link>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[.92fr_2fr]">
            <article className="flex min-h-[390px] flex-col rounded-[24px] bg-white p-7 sm:p-9">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-blush text-rose-deep"><EyeOff size={19} /></span>
              <h3 className="mt-7 font-display text-xl font-semibold text-ink">Secret Admirer</h3>
              <p className="mt-3 text-sm leading-6 text-muted">A mysterious, elegant single-stem delivery with a hand-sealed wax note. Perfectly understated.</p>
            </article>

            <article className="group relative min-h-[390px] overflow-hidden rounded-[24px]">
              {displayStories[1]?.image && <img src={displayStories[1].image} alt="Grand romantic floral installation" onError={handleImageError} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="relative flex min-h-[390px] max-w-xl flex-col justify-end p-8 text-white sm:p-10">
                <span className="mb-3 w-fit rounded-full bg-rose-deep px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em]">Best Seller</span>
                <h3 className="font-display text-3xl font-semibold">The Grand Gesture</h3>
                <p className="mt-3 text-sm leading-6 text-white/85">A floor-to-ceiling floral installation that transforms any room into a botanical wonderland, complete with professional photography of the moment.</p>
                <div className="mt-6 flex items-center gap-5">
                  <Link to="/contact#contact-form" className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-rose-deep">Book Now</Link>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
            <article className="grid min-h-[220px] overflow-hidden rounded-[24px] bg-[#fff8f7] sm:grid-cols-[1.35fr_.75fr]">
              <div className="flex flex-col justify-center p-7 sm:p-9">
                <h3 className="font-display text-xl font-semibold text-ink">Just Because</h3>
                <p className="mt-3 text-sm leading-6 text-muted">Weekly subscription for those who believe every Monday deserves a surprise. Fresh seasonal picks delivered with a custom message.</p>
                <Link to="/services" className="mt-6 text-sm font-medium text-rose-deep">Learn More&nbsp; &rarr;</Link>
              </div>
              {displayStories[2]?.image && <img src={displayStories[2].image} alt="Seasonal flower subscription arrangement" onError={handleImageError} className="h-full min-h-[220px] w-full object-cover" />}
            </article>

            <article className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] bg-[#fff8f7] p-8 text-center">
              <h3 className="font-display text-xl font-semibold text-ink">Thinking of You</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted">A soft palette of lilies and eucalyptus, designed to bring peace and comfort to their doorstep.</p>
              <div className="mt-6 flex -space-x-2">
                {displayStories.map((story) => story.image).filter(Boolean).slice(0, 3).map((image) => (
                  <img key={image} src={image} alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                ))}
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-blush text-[9px] text-rose-deep">+12</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#fff9f8]/25 py-20 sm:py-24">
        <div className="mx-auto max-w-[1220px] px-5 sm:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-ink">Your Surprise Journey</h2>
            <span className="mx-auto mt-4 block h-0.5 w-16 bg-rose-deep" />
          </div>
          <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
            <div className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-line md:block" />
            {journey.map((step, index) => (
              <article key={step.title} className="relative text-center">
                <span className={`${index === 2 ? 'bg-rose-deep text-white' : 'bg-white text-rose-deep'} mx-auto grid h-14 w-14 place-items-center rounded-full border border-line shadow-sm`}>
                  <step.icon size={21} />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted">{step.description}</p>
              </article>
            ))}
          </div>

          <div className="relative mx-auto mt-20 max-w-4xl overflow-hidden rounded-[34px] bg-[#9a5458] px-7 py-14 text-center text-white shadow-[0_20px_45px_rgba(100,55,58,.18)] sm:px-12 sm:py-16">
            <span className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-white/8" aria-hidden="true" />
            <span className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/8" aria-hidden="true" />
            <div className="relative">
              <h2 className="font-display text-xl font-semibold">Ready to make magic happen?</h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/75">Join 2,000+ happy senders who have used Flower Zone to create memories that last far longer than the flowers.</p>
              <Link to="/contact#contact-form" className="mt-8 inline-flex min-w-52 items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-medium text-rose-deep transition-transform hover:scale-[1.02]">Plan a Surprise</Link>
              <p className="mt-5 text-xs text-white/55">Average setup time: 10 minutes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
