import Eyebrow from './Eyebrow';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  rightSlot?: React.ReactNode;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  rightSlot,
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  return (
    <div
      className={`flex ${
        isCenter ? 'flex-col items-center text-center' : 'flex-col sm:flex-row sm:items-end sm:justify-between'
      } gap-4`}
    >
      <div>
        {eyebrow && <Eyebrow align={align}>{eyebrow}</Eyebrow>}
        <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">{title}</h2>
        {subtitle && <p className="mt-2 text-muted max-w-xl">{subtitle}</p>}
      </div>
      {rightSlot}
    </div>
  );
}
