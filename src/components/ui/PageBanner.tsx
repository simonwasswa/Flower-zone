import Eyebrow from './Eyebrow';

interface PageBannerProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export default function PageBanner({ eyebrow, title, subtitle }: PageBannerProps) {
  return (
    <section className="bg-blush/50 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <Eyebrow align="center">{eyebrow}</Eyebrow>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-ink">{title}</h1>
        <p className="mt-4 text-ink-soft leading-relaxed">{subtitle}</p>
      </div>
    </section>
  );
}
