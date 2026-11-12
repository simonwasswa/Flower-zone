import type { CSSProperties } from 'react';
import Reveal from './Reveal';

interface OrnamentTitleProps {
  children: string;
  light?: boolean;
}

export default function OrnamentTitle({ children, light = false }: OrnamentTitleProps) {
  // Words stay unbroken; each letter blooms in from a soft blur, one after another.
  let charIndex = 0;
  const words = children.split(' ');

  return (
    <Reveal className="text-center">
      <h2 aria-label={children} className={`font-display text-3xl font-normal tracking-wide sm:text-4xl ${light ? 'text-cream' : 'text-ink'}`}>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} aria-hidden="true" className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, index) => (
              <span key={index} className="title-char" style={{ '--i': charIndex++ } as CSSProperties}>
                {char}
              </span>
            ))}
            {wordIndex < words.length - 1 && <span className="inline-block w-[0.28em]" />}
          </span>
        ))}
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
