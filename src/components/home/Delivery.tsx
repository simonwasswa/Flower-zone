import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import OrnamentTitle from '../ui/OrnamentTitle';
import Reveal from '../ui/Reveal';
import weddingPhoto from '../../assets/hero-wedding-polished.webp';
import giftBasketPhoto from '../../assets/hero-gift-basket-polished.webp';
import redRosesPhoto from '../../assets/hero-red-roses-polished.webp';
import pinkBouquetPhoto from '../../assets/hero-pink-bouquet-polished.webp';
import bridalGlowPhoto from '../../assets/bridal-glow-clean.webp';
import whatsappIcon from '../../assets/whatsapp-icon.webp';
import instagramIcon from '../../assets/instagram-icon.webp';
import emailIcon from '../../assets/email-icon.webp';

// Photos scattered around the delivery note, like blooms laid around a card on a table.
const blooms = [
  { src: redRosesPhoto, className: 'left-0 top-2 size-28 sm:size-36 lg:size-44', rotate: -8, delay: 0 },
  { src: pinkBouquetPhoto, className: 'right-2 top-0 size-24 sm:size-32 lg:size-40', rotate: 10, delay: -2 },
  { src: bridalGlowPhoto, className: 'hidden sm:block -left-6 top-[42%] size-28 lg:size-32', rotate: 6, delay: -4 },
  { src: giftBasketPhoto, className: 'hidden sm:block -right-8 top-[40%] size-28 lg:size-36', rotate: -6, delay: -1 },
  { src: weddingPhoto, className: 'bottom-0 left-4 size-24 sm:size-32 lg:size-40', rotate: 12, delay: -3 },
  { src: redRosesPhoto, className: 'bottom-4 right-0 size-28 sm:size-36 lg:size-44', rotate: -10, delay: -5 },
];

const orderChannels = [
  { label: 'WhatsApp', icon: whatsappIcon, href: 'https://wa.me/256772262288' },
  { label: 'Instagram', icon: instagramIcon, href: 'https://www.instagram.com/flowerzone.ug' },
  { label: 'Email', icon: emailIcon, href: 'mailto:tendofiona@yahoo.com' },
];

export default function Delivery() {
  return (
    <section className="overflow-hidden bg-cream px-5 pb-28 pt-16 sm:px-8 sm:pb-36 sm:pt-20">
      <OrnamentTitle>Delivery</OrnamentTitle>

      <div className="relative mx-auto mt-10 max-w-[760px] px-6 py-24 sm:px-24 sm:py-24">
        {blooms.map((bloom, index) => (
          <Reveal key={index} variant="zoom" delay={index * 120} className={`absolute ${bloom.className}`}>
            <div
              className="float-soft size-full overflow-hidden rounded-full border-4 border-cream shadow-[0_18px_40px_-18px_rgba(48,40,39,0.55)]"
              style={
                {
                  '--float-rotate': `${bloom.rotate}deg`,
                  '--float-delay': `${bloom.delay}s`,
                  '--float-duration': `${6 + (index % 3)}s`,
                } as CSSProperties
              }
            >
              <img src={bloom.src} alt="" aria-hidden="true" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        ))}

        <Reveal variant="paper" delay={250} className="relative z-10">
          <div className="paper-card mx-auto max-w-[440px] px-7 py-10 text-center sm:px-12 sm:py-12">
            <p className="text-sm leading-7 text-ink-soft">
              We deliver across Kampala at a time that suits you. To order, choose an arrangement from our{' '}
              <Link to="/services" className="text-rose-deep underline decoration-rose/50 underline-offset-4 transition-colors hover:text-ink">
                services
              </Link>{' '}
              or{' '}
              <Link to="/contact#contact-form" className="text-rose-deep underline decoration-rose/50 underline-offset-4 transition-colors hover:text-ink">
                tell us about your occasion
              </Link>
              , and we&apos;ll confirm flowers, timing, and delivery details with you.
            </p>

            <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-muted">Order with us via</p>
            <span aria-hidden="true" className="mx-auto mt-2 block h-px w-16 bg-ink/25" />
            <div className="mt-5 flex items-center justify-center gap-4">
              {orderChannels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center gap-1.5 text-[11px] font-medium text-ink-soft"
                >
                  <span className="grid size-11 place-items-center overflow-hidden rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                    <img src={channel.icon} alt="" className="h-9 w-9 object-contain" />
                  </span>
                  {channel.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
