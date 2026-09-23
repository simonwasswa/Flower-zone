import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ArrowRight, Check, ChevronDown, Flower2, Gift, MessageCircleHeart, X, type LucideIcon } from 'lucide-react';
import Newsletter from '../components/home/Newsletter';
import BlossomBackdrop from '../components/ui/BlossomBackdrop';
import Eyebrow from '../components/ui/Eyebrow';
import Reveal from '../components/ui/Reveal';
import instagramIcon from '../assets/instagram-icon.webp';
import whatsappIcon from '../assets/whatsapp-icon.webp';
import heroPhoto from '../assets/hero-gift-basket-polished.webp';
import bespokePhoto from '../assets/hero-pink-bouquet-polished.webp';
import redRosesPhoto from '../assets/hero-red-roses-polished.webp';
import weddingPhoto from '../assets/hero-wedding-polished.webp';
import bridalGlowPhoto from '../assets/bridal-glow-clean.webp';
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

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: MessageCircleHeart,
    title: 'Tell Us Your Moment',
    text: 'Who are the flowers for, and what is the occasion? Share their favourite colours and the message you want to send.',
  },
  {
    icon: Flower2,
    title: 'We Design It Fresh',
    text: 'Our florists design your arrangement in our Kampala studio, matched to the recipient and the feeling you want to give.',
  },
  {
    icon: Gift,
    title: 'We Deliver the Smile',
    text: 'We schedule delivery across Kampala at a time that suits you, and coordinate surprises discreetly when needed.',
  },
];

const faqs = [
  {
    question: 'Do you deliver across Kampala?',
    answer: 'Yes. We schedule deliveries across Kampala, and for tributes we deliver on time to the venue you choose.',
  },
  {
    question: 'How do I place an order?',
    answer: 'Open a zone and tap “Inquire on WhatsApp”, or send us your details through the contact form. We’ll confirm flowers, timing, and delivery with you.',
  },
  {
    question: 'Can I choose the colours and flowers?',
    answer: 'Absolutely. Arrangements are personalised, with custom colour and flower selection based on the recipient and your occasion.',
  },
  {
    question: 'Can you include a personal message?',
    answer: 'Yes. We can add a handwritten message card, a message ribbon for tributes, or a special presentation for romantic gestures.',
  },
  {
    question: 'Can you help plan a secret surprise?',
    answer: 'Our Surprise Zone covers discreet delivery planning, gift and message coordination, and optional reveal setup and photography.',
  },
  {
    question: 'Do you style weddings and venues?',
    answer: 'Yes. Our Wedding Zone includes bouquets, buttonholes and corsages, ceremony and reception florals, and venue styling.',
  },
  {
    question: 'When can I reach you?',
    answer: 'Our concierge is available 9am – 9pm, and you can reach us on WhatsApp 24/7.',
  },
  {
    question: 'Do you create fully bespoke designs?',
    answer: 'Yes. Tell us your vision through the contact form and our floral designers will craft something unique for you.',
  },
];

const localBandImages = [redRosesPhoto, bridalGlowPhoto, weddingPhoto, bespokePhoto, heroPhoto];

function TicketCard({ number, action, children }: { number: number; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="group h-full drop-shadow-[0_18px_28px_rgba(48,40,39,0.12)] transition-transform duration-500 hover:-translate-y-1.5">
      <article className="ticket-card flex h-full flex-col bg-white">
        {children}
        <div className="mx-5 border-t border-dashed border-line" />
        <div className={`flex h-[67px] items-center px-6 ${action ? 'justify-between' : 'justify-center'}`}>
          <span className="grid size-8 place-items-center rounded-full bg-blush text-xs font-semibold text-rose-deep">{number}</span>
          {action}
        </div>
      </article>
    </div>
  );
}

const instagramProfileUrl =
  'https://www.instagram.com/flowerzone.ug?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';

export default function Services() {
  const [displayZones, setDisplayZones] = useState<Zone[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>('0-0');

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

  const bandImages = [...displayZones.map((zone) => zone.image).filter(Boolean), ...localBandImages];

  return (
    <div>
      <BlossomBackdrop />

      {/* Hero: photo with a centred paper note */}
      <section data-header-dark className="relative isolate overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
        <img src={heroPhoto} alt="" aria-hidden="true" className="slow-zoom absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-ink/25" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink/60 to-transparent" />
        <Reveal variant="paper" className="mx-auto max-w-xl">
          <div className="paper-card px-7 py-12 text-center sm:px-14 sm:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-rose-deep">Experience Curated Elegance</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
              Flower Zones for <span className="italic text-rose-deep">Every Moment</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-ink-soft">
              From whispers of romance to silent tributes of memory, our specialized floral zones are designed to honor
              life&apos;s most profound chapters.
            </p>
            <a
              href="#zones"
              className="mt-8 inline-flex min-h-12 items-center justify-center bg-rose-deep px-8 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink"
            >
              Explore Our Zones
            </a>
          </div>
        </Reveal>
      </section>

      {/* In a hurry strip */}
      <section className="border-y border-line/70 bg-white/70 px-5 py-12 text-center backdrop-blur-sm sm:px-8">
        <Reveal>
          <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-ink">In a hurry?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink-soft">
            Our concierge is on WhatsApp 24/7. Message us and we&apos;ll let you know what we can arrange for your moment.
          </p>
          <a
            href="https://wa.me/256772262288?text=Hello%20Flower%20Zone%2C%20I%20need%20flowers%20soon."
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-rose-deep px-8 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink"
          >
            <img src={whatsappIcon} alt="" className="h-5 w-5 rounded-full object-cover" />
            Message Us
          </a>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">How It Works</h2>
          <p className="mt-3 text-sm text-ink-soft">Tell us the moment. We handle the flowers, the timing, and the delivery.</p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-[1080px] gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 140} className="h-full">
              <TicketCard number={index + 1}>
                <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-9 text-center">
                  <span className="grid size-20 place-items-center rounded-full bg-blush text-rose-deep transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
                    <step.icon size={40} strokeWidth={1.2} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-xl text-ink">{step.title}</h3>
                  <p className="mt-3 text-[13px] leading-6 text-muted">{step.text}</p>
                </div>
              </TicketCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#zones"
            className="inline-flex min-h-12 items-center justify-center bg-rose-deep px-8 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Service zones */}
      <section id="zones" className="scroll-mt-20 px-5 pb-20 sm:px-8 sm:pb-24">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Our Flower Zones</h2>
          <p className="mt-3 text-sm text-ink-soft">Choose the zone that fits your occasion and open it to see what&apos;s included.</p>
        </Reveal>

        <div className="mx-auto mt-12 flex max-w-[1180px] flex-wrap justify-center gap-6">
          {displayZones.map((zone, index) => (
            <Reveal
              key={zone.id}
              delay={(index % 3) * 140}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]"
            >
              <TicketCard
                number={index + 1}
                action={
                  <button
                    type="button"
                    onClick={() => setSelectedZone(zone)}
                    className="inline-flex min-h-10 items-center gap-1.5 border border-rose-deep px-4 text-xs font-semibold uppercase tracking-[0.12em] text-rose-deep transition-colors hover:bg-rose-deep hover:text-white"
                  >
                    View Package <ArrowRight size={14} />
                  </button>
                }
              >
                <div className="m-3 mb-0 aspect-[4/3] overflow-hidden rounded-[10px] bg-blush">
                  {zone.image && (
                    <img
                      src={zone.image}
                      alt={`${zone.title} floral arrangement`}
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col px-6 pb-6 pt-5 text-center">
                  <h3 className="font-display text-xl text-ink">{zone.title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-muted">{zone.description}</p>
                </div>
              </TicketCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bespoke split */}
      <section className="grid lg:grid-cols-2">
        <div className="flex items-center justify-center bg-white/55 px-6 py-20 backdrop-blur-[2px] sm:px-12">
          <Reveal className="max-w-md text-center">
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-[2.6rem]">Looking for Something Bespoke?</h2>
            <p className="mt-5 text-sm leading-7 text-ink-soft">
              Our floral designers can craft unique arrangements tailored to your specific vision. Let&apos;s create
              something extraordinary together.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/contact#contact-form"
                className="inline-flex min-h-12 items-center justify-center bg-rose-deep px-8 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink"
              >
                Inquire Now
              </Link>
              <Link
                to="/gallery"
                className="inline-flex min-h-12 items-center justify-center border border-rose-deep px-8 text-xs font-semibold uppercase tracking-[0.16em] text-rose-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-deep hover:text-white"
              >
                View Gallery
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="group relative min-h-[340px] overflow-hidden lg:min-h-[520px]">
          <img
            src={bespokePhoto}
            alt="A bespoke Flower Zone bouquet"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-sm text-ink-soft">Everything you need to know before you plan your moment.</p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-[1080px] items-start gap-4 md:grid-cols-2">
          {[faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))].map((column, columnIndex) => (
            <div key={columnIndex} className="grid gap-4">
              {column.map((faq, index) => {
                const id = `${columnIndex}-${index}`;
                const open = openFaq === id;
                return (
                  <Reveal key={faq.question} delay={index * 90}>
                    <div className="bg-white shadow-[0_10px_30px_-22px_rgba(48,40,39,0.5)]">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`faq-${id}`}
                        onClick={() => setOpenFaq(open ? null : id)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-ink"
                      >
                        {faq.question}
                        <span className={`grid size-7 shrink-0 place-items-center rounded-full bg-blush text-rose-deep transition-transform duration-500 ${open ? 'rotate-180' : ''}`}>
                          <ChevronDown size={16} />
                        </span>
                      </button>
                      <div
                        id={`faq-${id}`}
                        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                      >
                        <p className="overflow-hidden px-6 text-[13px] leading-6 text-muted">
                          <span className="block pb-5">{faq.answer}</span>
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* Flower band */}
      <section aria-label="Flower Zone arrangements" className="overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flower-marquee flex w-max gap-3">
          {[...bandImages, ...bandImages].map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              onError={handleImageError}
              className="h-48 w-64 shrink-0 object-cover sm:h-60 sm:w-80"
            />
          ))}
        </div>
      </section>

      <Newsletter />

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
