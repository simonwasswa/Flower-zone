import type { CSSProperties, ReactNode } from 'react';
import LeafEdge from './LeafEdge';

interface PageBannerProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  image: string;
  children?: ReactNode;
}

function enterDelay(ms: number) {
  return { '--enter-delay': `${ms}ms` } as CSSProperties;
}

// Full-width photo banner that opens each page; the see-through header floats over it.
export default function PageBanner({ eyebrow, title, subtitle, image, children }: PageBannerProps) {
  return (
    <section
      data-header-dark
      className="relative isolate flex min-h-[460px] items-center justify-center overflow-hidden px-5 pb-28 pt-32 text-center sm:min-h-[540px] sm:px-8 sm:pb-32 sm:pt-36"
    >
      <img src={image} alt="" aria-hidden="true" decoding="async" className="slow-zoom absolute inset-0 -z-20 h-full w-full object-cover" />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, rgba(48,40,39,0.7) 0%, rgba(48,40,39,0.5) 45%, rgba(48,40,39,0.62) 100%)' }}
      />

      <div className="mx-auto max-w-3xl">
        <p className="hero-enter text-xs font-medium uppercase tracking-[0.28em] text-[#f6d3d6]" style={enterDelay(100)}>
          {eyebrow}
        </p>
        <h1 className="hero-enter mt-4 font-display text-4xl font-normal leading-[1.1] text-cream sm:text-5xl lg:text-[3.6rem]" style={enterDelay(250)}>
          {title}
        </h1>
        <p className="hero-enter mx-auto mt-6 max-w-2xl text-[15px] leading-7 text-cream/85 sm:text-base" style={enterDelay(400)}>
          {subtitle}
        </p>
        {children && (
          <div className="hero-enter mt-9 flex flex-wrap justify-center gap-4" style={enterDelay(550)}>
            {children}
          </div>
        )}
      </div>

      <LeafEdge position="bottom" />
    </section>
  );
}
