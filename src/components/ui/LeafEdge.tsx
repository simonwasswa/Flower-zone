import { useEffect, useRef, useState, type CSSProperties } from 'react';

type Leaf = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  sway: boolean;
  duration: number;
  delay: number;
};

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function buildLeaves(): Leaf[] {
  const random = seededRandom(20260803);
  const rows = [
    { count: 70, yMin: 38, yRange: 26, scaleMin: 0.9, scaleRange: 0.8 },
    { count: 90, yMin: 62, yRange: 20, scaleMin: 0.7, scaleRange: 0.6 },
  ];

  return rows.flatMap((row) =>
    Array.from({ length: row.count }, (_, index) => ({
      x: (index / row.count) * 1480 - 20 + random() * 14,
      y: row.yMin + random() * row.yRange,
      rotate: -168 + random() * 156,
      scale: row.scaleMin + random() * row.scaleRange,
      sway: random() > 0.75,
      duration: 4 + random() * 4,
      delay: -random() * 6,
    })),
  );
}

function buildBase() {
  let path = 'M0 100 L0 80';
  for (let x = 0; x < 1440; x += 48) {
    path += ` Q${x + 24} ${x % 96 === 0 ? 66 : 72} ${x + 48} 80`;
  }
  return `${path} L1440 100 Z`;
}

const leaves = buildLeaves();
const basePath = buildBase();

interface LeafEdgeProps {
  position?: 'top' | 'bottom';
  className?: string;
}

// A cream band of swaying leaves that softens the edge between a photo section and a light section.
export default function LeafEdge({ position = 'bottom', className = '' }: LeafEdgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Only sway while on screen so off-screen edges cost nothing.
  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-paused={visible ? undefined : ''}
      className={`leaf-edge pointer-events-none absolute inset-x-0 z-10 h-[64px] sm:h-[84px] lg:h-[104px] ${
        position === 'bottom' ? '-bottom-px' : '-top-px -scale-y-100'
      } ${className}`}
    >
      <svg viewBox="0 0 1440 100" preserveAspectRatio="xMidYMax slice" className="block h-full w-full">
        <path d={basePath} fill="var(--color-cream)" />
        {leaves.map((leaf, index) => (
          <g key={index} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate}) scale(${leaf.scale})`}>
            <g
              className={leaf.sway ? 'leaf-sway' : undefined}
              style={{ '--sway-duration': `${leaf.duration}s`, '--sway-delay': `${leaf.delay}s` } as CSSProperties}
            >
              <path d="M0 0 Q11 -9.5 27 0 Q11 9.5 0 0 Z" fill="var(--color-cream)" stroke="var(--color-line)" strokeWidth="0.8" />
              <path d="M2 0 L22 0" stroke="var(--color-line)" strokeWidth="0.6" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
