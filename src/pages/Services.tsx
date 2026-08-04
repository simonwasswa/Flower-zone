import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import Eyebrow from '../components/ui/Eyebrow';
import instagramIcon from '../assets/instagram-icon.png';
import whatsappIcon from '../assets/whatsapp-icon.png';
import { supabase } from '../lib/supabase';
import { handleImageError, resolveMediaUrl } from '../lib/media';

const zones = [
  {
    id: 'birthday',
    title: 'Birthday Zone',
    description:
      'Vibrant celebrations and personalized arrangements designed to make their special day bloom with unforgettable joy.',
    image: '',
    details:
      'We create joyful birthday florals around the recipient’s personality, favourite colours, and celebration style. Every design is prepared fresh in our Kampala studio and can be paired with a thoughtful message.',
    includes: ['Personalised bouquet or vase arrangement', 'Custom colour and flower selection', 'Handwritten message card', 'Scheduled delivery across Kampala'],
    className: 'lg:col-span-2',
    buttonClass: 'bg-[#df9298] text-ink hover:bg-[#e9aab0]',
  },
  {
    id: 'romance',
    title: 'Romance Zone',
    description:
      'The language of love spoken through velvet roses and delicate petals. Perfect for anniversaries and whispers of affection.',
    image: '',
    details:
      'Designed for anniversaries, proposals, and meaningful romantic gestures, this package combines expressive flowers with discreet planning for a memorable reveal.',
    includes: ['Romantic floral arrangement', 'Personal message presentation', 'Surprise delivery coordination', 'Optional room or dinner-table styling'],
    className: '',
    buttonClass: 'bg-[#a75358] text-white hover:bg-[#94474c]',
  },
  {
    id: 'wedding',
    title: 'Wedding Zone',
    description:
      'Bridal bouquets and venue styling that turn your forever promise into a living botanical masterpiece.',
    image: '',
    details:
      'Our wedding service brings a consistent floral story to every part of your day, from personal flowers to ceremony and reception styling.',
    includes: ['Bride and bridal-party bouquets', 'Buttonholes and corsages', 'Ceremony and reception florals', 'Venue setup and floral styling'],
    className: '',
    buttonClass: 'bg-white text-rose-deep hover:bg-blush',
  },
  {
    id: 'sympathy',
    title: 'Sympathy Zone',
    description:
      'Graceful tributes and floral arrangements that offer a silent, beautiful embrace during times of loss and remembrance.',
    image: '',
    details:
      'Created with sensitivity and care, our tribute arrangements help families express remembrance, comfort, and respect through flowers.',
    includes: ['Wreaths, sprays, or casket flowers', 'Family colour and flower preferences', 'Message ribbon or sympathy card', 'Timely delivery to the selected venue'],
    className: '',
    buttonClass: 'bg-[#625e60] text-white hover:bg-[#4c484a]',
  },
  {
    id: 'surprise',
    title: 'Surprise Zone',
    description:
      'Eclectic “Just Because” arrangements designed to deliver a spontaneous moment of pure, unadulterated delight.',
    image: '',
    details:
      'For moments that deserve an unexpected burst of happiness, we plan the flowers, presentation, and timing around the person you want to celebrate.',
    includes: ['Bespoke surprise arrangement', 'Gift and message coordination', 'Discreet delivery planning', 'Optional reveal setup and photography'],
    className: '',
    buttonClass: 'bg-[#e88f98] text-ink hover:bg-[#f0a9af]',
  },
];

type Zone = (typeof zones)[number];

const serviceStyles: Record<string, Pick<Zone, 'className' | 'buttonClass'>> = Object.fromEntries(
  zones.map((zone) => [zone.id, { className: zone.className, buttonClass: zone.buttonClass }]),
);

const instagramProfileUrl =
  'https://www.instagram.com/flowerzone.ug?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';

export default function Services() {
  const [displayZones, setDisplayZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      const { data, error } = await supabase
        .from('services')
        .select('slug,title,summary,details,image_url,inclusions,sort_order,updated_at')
        .eq('is_published', true)
        .order('sort_order');

      if (cancelled) return;
      if (error) {
        console.warn('Using local service content:', error.message);
        return;
      }
      if (!data?.length) return;

      const loadedZones = data.map((row) => {
          const fallback = zones.find((zone) => zone.id === row.slug) ?? zones[0];
          const styles = serviceStyles[row.slug] ?? serviceStyles.birthday;
          return {
            ...fallback,
            id: row.slug,
            title: row.title,
            description: row.summary,
            details: row.details || row.summary,
            image: resolveMediaUrl(row.image_url, row.updated_at),
            includes: row.inclusions?.length ? row.inclusions : fallback.includes,
            ...styles,
          };
        });
      setDisplayZones(loadedZones);

      const packageId = new URLSearchParams(window.location.search).get('package');
      if (packageId) setSelectedZone(loadedZones.find((zone) => zone.id === packageId) ?? null);
    }

    void loadServices();
    window.addEventListener('focus', loadServices);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadServices);
    };
  }, []);

  useEffect(() => {
    if (!selectedZone) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelectedZone(null);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedZone]);

  return (
    <div className="bg-[#fffaf8]">
      <section className="px-5 pb-14 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-20">
        <Eyebrow align="center">Experience Curated Elegance</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Flower Zones for Every Moment
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-display text-base italic leading-7 text-muted sm:text-lg">
          From whispers of romance to silent tributes of memory, our specialized floral zones are
          designed to honor life&apos;s most profound chapters.
        </p>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-3">
          {displayZones.map((zone, index) => (
            <article
              key={zone.title}
              className={`${zone.className} ${index < 2 ? 'lg:min-h-[425px]' : 'lg:min-h-[380px]'} group relative min-h-[360px] overflow-hidden rounded-[24px] sm:rounded-[28px]`}
            >
              {zone.image && (
                <img
                  src={zone.image}
                  alt={`${zone.title} floral arrangement`}
                  onError={handleImageError}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <h2 className="font-display text-2xl font-semibold sm:text-[1.7rem]">{zone.title}</h2>
                <p className="mt-2 max-w-xl font-display text-[15px] leading-6 text-white/95">
                  {zone.description}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  className={`${zone.buttonClass} mt-6 inline-flex min-w-36 items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors`}
                >
                  View Packages
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
        <div className="relative overflow-hidden rounded-[30px] bg-[#f0e7e6] px-6 py-16 text-center sm:px-12 sm:py-20">
          <span className="pointer-events-none absolute -right-1 -top-14 font-display text-[9rem] text-[#e5d7d6]" aria-hidden="true">
            FZ
          </span>
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold text-ink">Looking for Something Bespoke?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">
              Our floral designers can craft unique arrangements tailored to your specific vision.
              Let&apos;s create something extraordinary together.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/contact#contact-form"
                className="inline-flex min-w-48 items-center justify-center rounded-full bg-[#9d4f52] px-7 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-deep"
              >
                Inquire Now
              </Link>
              <Link
                to="/gallery"
                className="inline-flex min-w-48 items-center justify-center rounded-full border border-[#d9b6b6] px-7 py-3.5 text-sm font-medium text-rose-deep transition-colors hover:border-rose-deep hover:bg-white"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {selectedZone && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#241d1d]/75 p-2 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="package-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedZone(null);
          }}
        >
          <div className="relative grid max-h-[calc(100dvh-1rem)] w-full max-w-5xl overflow-y-auto rounded-[16px] bg-[#fffaf8] shadow-2xl sm:max-h-[92vh] sm:rounded-[20px] lg:grid-cols-[.95fr_1.05fr]">
            <button
              type="button"
              onClick={() => setSelectedZone(null)}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white hover:text-rose-deep"
              aria-label="Close package details"
            >
              <X size={20} />
            </button>

            <div className="relative min-h-[230px] overflow-hidden sm:min-h-[300px] lg:min-h-[590px]">
              {selectedZone.image && (
                <img
                  src={selectedZone.image}
                  alt={`${selectedZone.title} package`}
                  onError={handleImageError}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              <span className="absolute bottom-6 left-6 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-rose-deep backdrop-blur-sm">
                Flower Zone Kampala
              </span>
            </div>

            <div className="flex flex-col justify-center p-5 sm:p-10 lg:p-12">
              <Eyebrow>Package Details</Eyebrow>
              <h2 id="package-title" className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
                {selectedZone.title}
              </h2>
              <p className="mt-5 text-sm leading-7 text-ink-soft sm:text-[15px]">
                {selectedZone.details}
              </p>

              <h3 className="mt-7 text-sm font-semibold uppercase tracking-[0.12em] text-ink">What&apos;s included</h3>
              <ul className="mt-4 space-y-3">
                {selectedZone.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-ink-soft">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blush text-rose-deep">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/256772262288?text=${encodeURIComponent(`Hello Flower Zone, I would like to inquire about the ${selectedZone.title}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f9e5b] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#27884d] sm:w-fit"
                >
                  <img src={whatsappIcon} alt="" className="h-5 w-5 rounded-full object-cover" />
                  Inquire on WhatsApp
                </a>
                <a
                  href={instagramProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#833ab4] via-[#e1306c] to-[#f77737] px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-fit"
                >
                  <img src={instagramIcon} alt="" className="h-5 w-5 rounded-md object-cover" />
                  View on Instagram
                </a>
              </div>
              <p className="mt-3 text-xs text-muted">We&apos;ll confirm availability, flower preferences, and delivery details with you.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
