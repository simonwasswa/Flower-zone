import type { CSSProperties } from 'react';

interface SplitTextProps {
  text: string;
  /** Delay before the first word starts, in ms. */
  delay?: number;
  /** Gap between each word, in ms. */
  stagger?: number;
  /** Words (lower-case, punctuation ignored) rendered in rose italic as an accent. */
  accentWords?: string[];
}

// Each word rises out of its own mask, one after another, like a title card in a film.
export default function SplitText({ text, delay = 0, stagger = 70, accentWords = [] }: SplitTextProps) {
  const accents = new Set(accentWords.map((word) => word.toLowerCase()));
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span aria-label={text} role="text">
      {words.map((word, index) => {
        const bare = word.replace(/[^\p{L}\p{N}']/gu, '').toLowerCase();
        return (
          <span key={`${word}-${index}`} aria-hidden="true" className="split-mask">
            <span
              className={`split-word ${accents.has(bare) ? 'italic text-rose' : ''}`}
              style={{ '--word-delay': `${delay + index * stagger}ms` } as CSSProperties}
            >
              {word}
            </span>
            {index < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}
