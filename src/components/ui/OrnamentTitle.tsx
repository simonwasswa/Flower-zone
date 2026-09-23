import Reveal from './Reveal';

interface OrnamentTitleProps {
  children: string;
  light?: boolean;
}

export default function OrnamentTitle({ children, light = false }: OrnamentTitleProps) {
  return (
    <Reveal className="text-center">
      <h2 className={`font-display text-3xl font-normal tracking-wide sm:text-4xl ${light ? 'text-cream' : 'text-ink'}`}>
        {children}
      </h2>
      <span
        aria-hidden="true"
        className={`ornament-line relative mx-auto mt-4 block h-px w-28 ${light ? 'bg-cream/60' : 'bg-ink/35'}`}
      >
        <span className={`ornament-dot absolute left-1/2 top-1/2 size-1.5 rounded-full ${light ? 'bg-cream' : 'bg-rose-deep'}`} />
      </span>
    </Reveal>
  );
}
