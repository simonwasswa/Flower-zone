import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Flower2 } from 'lucide-react';
import { defaultSteps, type Service, type ServiceHighlight } from '../data/services';
import { useServices } from '../lib/useServices';
import { supabase } from '../lib/supabase';
import { handleImageError, resolveMediaUrl } from '../lib/media';
import Reveal from '../components/ui/Reveal';
import whatsappIcon from '../assets/whatsapp-icon.webp';

// Layout follows the product pages on hydeinnovations.com: light hero with a badge, framed image and pills,
// then sections that alternate between a tinted band and the plain page, ending in a rounded call-to-action block.
// Every colour comes from the service's own theme (src/data/services.ts), so each page has its own look.

const WHATSAPP_NUMBER = '256772262288';

type Photo = { src: string; alt: string };
type Tone = 'band' | 'page';

const accentButton =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_var(--accent)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-95';
const outlineButton =
  'inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-white/70 px-7 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-ink)]';

// Where the motif icons sit in the hero; percentages keep them clear of the headline.
const motifSpots: { style: CSSProperties; size: number }[] = [
  { style: { left: '6%', top: '22%' }, size: 34 },
  { style: { right: '8%', top: '18%' }, size: 42 },
  { style: { left: '12%', top: '58%' }, size: 26 },
  { style: { right: '13%', top: '52%' }, size: 30 },
];

function enterDelay(ms: number) {
  return { '--enter-delay': `${ms}ms` } as CSSProperties;
}

function whatsappLink(title: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Flower Zone, I would like to inquire about the ${title}.`)}`;
}

function Section({ tone, id, children }: { tone: Tone; id?: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 ${tone === 'band' ? 'bg-[var(--accent-band)]' : 'bg-cream'}`}
    >
      <div className="mx-auto max-w-[1120px]">{children}</div>
    </section>
  );
}

function SectionHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-[2rem] leading-[1.15] text-ink md:text-[2.6rem]">{title}</h2>
      {lead && <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-7 text-ink-soft md:text-base">{lead}</p>}
    </Reveal>
  );
}

function CheckBadge() {
  return (
    <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-ink)]" aria-hidden="true">
      <Check size={13} strokeWidth={2.4} />
    </span>
  );
}

/** Photos from the gallery filed under this service's category. */
function useGalleryPhotos(keywords: string[]) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const key = keywords.join('|');

  useEffect(() => {
    let cancelled = false;
    setPhotos([]);
    if (!key) return;

    void (async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('title,category,source_url,alt_text,updated_at')
        .eq('is_published', true)
        .eq('media_type', 'photo')
        .order('sort_order');
      if (cancelled || error || !data) return;

      const words = key.split('|');
      setPhotos(
        data
          // Match on the gallery category only, so photos filed under another service never appear here.
          .filter((row) => words.some((word) => (row.category ?? '').toLowerCase().includes(word)))
          .map((row) => ({ src: resolveMediaUrl(row.source_url, row.updated_at), alt: row.alt_text || row.title })),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [key]);

  return photos;
}

/** The framed hero picture with a soft glow in the service colour behind it. */
function FramedImage({ service }: { service: Service }) {
  const Badge = service.theme.motif[0] ?? Flower2;
  return (
    <div className="relative mx-auto mt-16 max-w-[920px]">
      <div
        aria-hidden="true"
        className="absolute -inset-x-6 -top-10 bottom-6 rounded-[3rem] blur-2xl"
        style={{
          backgroundImage:
            'radial-gradient(50% 60% at 30% 30%, color-mix(in oklab, var(--accent) 38%, transparent), transparent 70%), radial-gradient(50% 60% at 72% 55%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)',
        }}
      />
      <div className="relative rounded-[1.5rem] bg-white p-2.5 shadow-[0_40px_80px_-30px_rgba(48,40,39,0.45)] ring-1 ring-black/5 md:rounded-[2rem] md:p-3.5">
        <div className="overflow-hidden rounded-[1rem] bg-[var(--accent-soft)] md:rounded-[1.35rem]">
          {service.image ? (
            <img
              src={service.image}
              alt={`${service.title} floral arrangement`}
              decoding="async"
              onError={handleImageError}
              className="block aspect-[16/10] w-full object-cover"
            />
          ) : (
            // No photo yet: a shorter panel of the service's own motifs instead of a big empty frame.
            <div className="flex aspect-[16/7] items-center justify-center gap-6 text-[var(--accent)] md:gap-10">
              {service.theme.motif.map((Icon, index) => (
                <Icon key={index} strokeWidth={1} aria-hidden="true" className={index % 2 === 0 ? 'size-12 opacity-70 md:size-16' : 'size-8 opacity-40 md:size-10'} />
              ))}
            </div>
          )}
        </div>
      </div>
      <span className="absolute -bottom-6 right-6 grid size-14 place-items-center rounded-full bg-[var(--accent)] text-white shadow-[0_18px_30px_-12px_var(--accent)] md:right-10 md:size-16">
        <Badge size={26} strokeWidth={1.6} aria-hidden="true" />
      </span>
    </div>
  );
}

function HighlightVisual({ highlight, photo }: { highlight: ServiceHighlight; photo?: Photo }) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-line bg-[var(--accent-soft)]">
      {photo ? (
        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" onError={handleImageError} className="block aspect-[16/11] w-full object-cover" />
      ) : (
        <div className="relative grid aspect-[16/11] place-items-center overflow-hidden">
          <highlight.icon aria-hidden="true" strokeWidth={0.6} className="absolute -right-8 -top-8 size-56 text-[var(--accent)] opacity-10" />
          <span className="relative grid size-28 place-items-center rounded-full bg-white text-[var(--accent)] shadow-[0_24px_40px_-24px_var(--accent)] md:size-32">
            <highlight.icon size={52} strokeWidth={1.2} aria-hidden="true" />
          </span>
        </div>
      )}
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const services = useServices();
  const service = services.find((item) => item.id === slug);
  const photos = useGalleryPhotos(service?.galleryKeywords ?? []);

  useEffect(() => {
    const previous = document.title;
    document.title = `${service?.title ?? 'Service not found'} | Flower Zone`;
    return () => {
      document.title = previous;
    };
  }, [service?.title]);

  if (!service) {
    return (
      <section data-header-light className="bg-petal px-5 pb-24 pt-40 text-center sm:px-8">
        <h1 className="font-display text-4xl text-ink">Service not found</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink-soft">
          This link does not match any of our services. Use the Services menu above to find the one you need.
        </p>
        <Link
          to="/services"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-rose-deep px-7 text-sm font-semibold text-white transition-colors hover:bg-ink"
        >
          View all services
        </Link>
      </section>
    );
  }

  const { theme } = service;
  const steps = service.steps.length ? service.steps : defaultSteps;
  // The service photo is already in the hero, so gallery photos fill the highlight rows.
  const highlightPhotos = photos.filter((photo) => photo.src !== service.image);

  // Sections after the hero alternate page / band, like the reference page.
  let sectionIndex = 0;
  const nextTone = (): Tone => (sectionIndex++ % 2 === 0 ? 'page' : 'band');

  const themeVars = {
    '--accent': theme.accent,
    '--accent-soft': theme.soft,
    '--accent-band': theme.band,
    '--accent-ink': theme.ink,
  } as CSSProperties;

  return (
    <div style={themeVars}>
      {/* Hero: badge, headline, pitch, actions, framed photo, pills */}
      <section data-header-light className="relative overflow-hidden bg-[var(--accent-band)] px-5 pb-20 pt-36 sm:px-8 md:pb-28 md:pt-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(40% 50% at 15% 10%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%), radial-gradient(35% 45% at 90% 25%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%)',
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          {theme.motif.map((Icon, index) => {
            const spot = motifSpots[index % motifSpots.length];
            return (
              <Icon
                key={index}
                size={spot.size}
                strokeWidth={1.3}
                className="float-soft absolute text-[var(--accent)] opacity-25"
                style={{ ...spot.style, '--float-delay': `${index * -1.6}s` } as CSSProperties}
              />
            );
          })}
        </div>

        <div className="relative mx-auto max-w-[1120px] text-center">
          <div className="hero-enter mb-6 flex justify-center" style={enterDelay(80)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-1.5 text-sm font-semibold text-ink backdrop-blur-sm">
              <span className="size-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              {service.title}
            </span>
          </div>
          <h1 className="hero-enter mx-auto max-w-[18ch] font-display text-[2.6rem] leading-[1.06] text-ink md:text-[3.6rem] lg:text-[4.2rem]" style={enterDelay(200)}>
            {service.tagline}
          </h1>
          <p className="hero-enter mx-auto mt-6 max-w-[58ch] text-[15px] leading-7 text-ink-soft md:text-[17px] md:leading-8" style={enterDelay(320)}>
            {service.details}
          </p>
          <div className="hero-enter mt-10 flex flex-wrap justify-center gap-3" style={enterDelay(440)}>
            <a href={whatsappLink(service.title)} target="_blank" rel="noreferrer" className={accentButton}>
              <img src={whatsappIcon} alt="" className="h-5 w-5 rounded-full object-cover" />
              Inquire on WhatsApp
            </a>
            <a href="#how" className={outlineButton}>
              See how it works
            </a>
          </div>

          <div className="hero-enter" style={enterDelay(560)}>
            <FramedImage service={service} />
          </div>

          {service.capabilities.length > 0 && (
            <ul className="mt-14 flex flex-wrap justify-center gap-2">
              {service.capabilities.map((capability) => (
                <li key={capability} className="rounded-full border border-line bg-white/80 px-3.5 py-1.5 text-sm text-ink-soft">
                  {capability}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* How it works: numbered step cards */}
      <Section tone={nextTone()} id="how">
        <SectionHeader title={`How the ${service.title} works`} />
        <ol className={`mt-12 grid gap-5 sm:grid-cols-2 ${steps.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
          {steps.map((step, index) => (
            <li key={step.title} className="h-full">
              <Reveal delay={index * 90} className="h-full">
                <div className="h-full rounded-[1.25rem] border border-line bg-white p-7 transition-transform duration-500 hover:-translate-y-1">
                  <span className="grid size-9 place-items-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-ink)]" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl text-ink">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* What's included: check list */}
      <Section tone={nextTone()}>
        <SectionHeader title="What's included" lead={service.description} />
        <ul className="mx-auto mt-12 grid max-w-[56rem] gap-x-10 gap-y-6 sm:grid-cols-2">
          {service.includes.map((item, index) => (
            <li key={item}>
              <Reveal delay={index * 70} className="flex gap-4">
                <CheckBadge />
                <span className="text-lg text-ink">{item}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* Highlights: picture and text rows that swap sides */}
      {service.highlights.map((highlight, index) => (
        <Section key={highlight.title} tone={nextTone()}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal variant="zoom" className={index % 2 === 1 ? 'lg:order-2' : ''}>
              <HighlightVisual highlight={highlight} photo={highlightPhotos[index]} />
            </Reveal>
            <Reveal delay={90} className="max-w-[30rem]">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="mt-3 font-display text-[1.75rem] leading-tight text-ink md:text-[2.25rem]">{highlight.title}</h2>
              <p className="mt-4 text-[15px] leading-7 text-ink-soft md:text-base">{highlight.body}</p>
            </Reveal>
          </div>
        </Section>
      ))}

      {/* Groups: heading plus a check-list grid */}
      {service.groups.map((group) => (
        <Section key={group.title} tone={nextTone()}>
          <SectionHeader title={group.title} lead={group.lead} />
          <ul className={`mx-auto mt-12 grid max-w-[64rem] gap-x-10 gap-y-8 sm:grid-cols-2 ${group.items.length % 3 === 0 ? 'lg:grid-cols-3' : ''}`}>
            {group.items.map((item, index) => (
              <li key={item.title}>
                <Reveal delay={index * 80} className="flex gap-4">
                  <CheckBadge />
                  <div>
                    <h3 className="font-display text-lg text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      {/* Closing call to action: rounded tinted block */}
      <section className="bg-cream px-5 py-20 sm:px-8 md:py-28">
        <Reveal className="mx-auto max-w-[1120px]">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[var(--accent-soft)] px-6 py-16 text-center md:px-16 md:py-20">
            {theme.motif.slice(0, 2).map((Icon, index) => (
              <Icon
                key={index}
                aria-hidden="true"
                strokeWidth={0.8}
                className={`pointer-events-none absolute size-40 text-[var(--accent)] opacity-10 ${index === 0 ? '-left-8 -top-8' : '-bottom-10 -right-6'}`}
              />
            ))}
            <h2 className="relative mx-auto max-w-[24ch] font-display text-[2rem] leading-[1.15] text-ink md:text-[2.6rem]">{service.cta.title}</h2>
            <p className="relative mx-auto mt-5 max-w-[52ch] text-[15px] leading-7 text-ink-soft md:text-base">{service.cta.lead}</p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-3">
              <a href={whatsappLink(service.title)} target="_blank" rel="noreferrer" className={accentButton}>
                <img src={whatsappIcon} alt="" className="h-5 w-5 rounded-full object-cover" />
                Inquire on WhatsApp
              </a>
              <Link to="/contact#contact-form" className={outlineButton}>
                Send an enquiry
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
