import type { CSSProperties } from 'react';

type Blossom = { x: number; y: number; scale: number; breathe?: boolean };
type Petal = { left: number; size: number; duration: number; delay: number; drift: number; whole: boolean };

const branches = [
  { d: 'M540 6 C460 38 390 58 310 88 S175 128 105 152', width: 7 },
  { d: 'M505 18 C488 80 474 150 432 252', width: 5 },
  { d: 'M432 46 C421 92 438 140 470 172', width: 3.5 },
  { d: 'M335 80 C305 52 262 40 218 46', width: 3 },
  { d: 'M252 110 C232 140 204 160 168 176', width: 2.5 },
  { d: 'M470 150 C492 186 500 222 492 262', width: 2.5 },
];

const blossoms: Blossom[] = [
  { x: 500, y: 30, scale: 1.3, breathe: true },
  { x: 458, y: 50, scale: 1.05 },
  { x: 408, y: 64, scale: 1 },
  { x: 360, y: 78, scale: 0.9, breathe: true },
  { x: 302, y: 96, scale: 0.85 },
  { x: 242, y: 114, scale: 0.75 },
  { x: 182, y: 134, scale: 0.68, breathe: true },
  { x: 126, y: 148, scale: 0.55 },
  { x: 444, y: 110, scale: 0.9 },
  { x: 468, y: 168, scale: 1.2, breathe: true },
  { x: 272, y: 48, scale: 0.7 },
  { x: 226, y: 46, scale: 0.58 },
  { x: 206, y: 158, scale: 0.6 },
  { x: 170, y: 176, scale: 0.5 },
  { x: 492, y: 104, scale: 1.45 },
  { x: 458, y: 206, scale: 1.55, breathe: true },
  { x: 432, y: 254, scale: 1.15 },
  { x: 494, y: 258, scale: 1.25 },
];

const buds = [
  [382, 58], [328, 70], [288, 112], [214, 124], [150, 150], [436, 80], [250, 42], [190, 170], [482, 232], [418, 150],
];

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

// Petals mostly start under the branch on the right, like blossoms shaken loose from it.
const petals: Petal[] = (() => {
  const random = seededRandom(1405);
  return Array.from({ length: 26 }, () => {
    const duration = 11 + random() * 10;
    return {
      left: 30 + random() * 68,
      size: 16 + random() * 12,
      duration,
      delay: -random() * duration,
      drift: 30 + random() * 70,
      whole: random() > 0.75,
    };
  });
})();

const petalPath = 'M0 0 C-7 -6 -8 -15 -3 -18 C-1 -16 1 -16 3 -18 C8 -15 7 -6 0 0 Z';

// A cherry-blossom branch in the top corner with petals drifting down, shown behind the page content.
export default function BlossomBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="blossom-paper absolute inset-0" />
      <svg width="0" height="0" className="absolute">
        <defs>
          <radialGradient id="fz-petal" cx="50%" cy="100%" r="100%">
            <stop offset="0%" stopColor="var(--color-rose-deep)" />
            <stop offset="22%" stopColor="var(--color-rose-dark)" />
            <stop offset="60%" stopColor="var(--color-rose)" />
            <stop offset="100%" stopColor="#f6d3d6" />
          </radialGradient>
          <g id="fz-blossom">
            {[0, 72, 144, 216, 288].map((angle) => (
              <path key={angle} d={petalPath} transform={`rotate(${angle})`} fill="url(#fz-petal)" stroke="var(--color-rose)" strokeWidth="0.4" />
            ))}
            {[20, 80, 140, 200, 260, 320].map((angle) => (
              <line key={angle} x1="0" y1="0" x2="0" y2="-6.5" transform={`rotate(${angle})`} stroke="var(--color-rose-deep)" strokeWidth="0.7" strokeLinecap="round" />
            ))}
            <circle r="2.4" fill="var(--color-rose-deep)" />
          </g>
        </defs>
      </svg>

      <svg
        viewBox="0 0 540 300"
        className="blossom-branch absolute right-0 top-[64px] w-[min(78vw,560px)] sm:top-[72px]"
      >
        {branches.map((branch) => (
          <path key={branch.d} d={branch.d} fill="none" stroke="#7b4a57" strokeWidth={branch.width} strokeLinecap="round" />
        ))}
        {buds.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill="var(--color-rose)" stroke="#ffffff" strokeWidth="1" />
        ))}
        {blossoms.map((blossom, index) => (
          <g key={index} transform={`translate(${blossom.x} ${blossom.y}) scale(${blossom.scale}) rotate(${index * 23})`}>
            <use
              href="#fz-blossom"
              className={blossom.breathe ? 'blossom-breathe' : undefined}
              style={{ animationDelay: `${-index * 0.7}s` }}
            />
          </g>
        ))}
      </svg>

      {petals.map((petal, index) => (
        <span
          key={index}
          className="petal-fall absolute top-0"
          style={
            {
              left: `${petal.left}%`,
              '--petal-duration': `${petal.duration}s`,
              '--petal-delay': `${petal.delay}s`,
              '--petal-drift': `${petal.drift}px`,
            } as CSSProperties
          }
        >
          <svg
            viewBox={petal.whole ? '-20 -20 40 40' : '-9 -19 18 20'}
            width={petal.whole ? petal.size * 1.5 : petal.size}
            height={petal.whole ? petal.size * 1.5 : petal.size}
            className="petal-flutter block"
          >
            {petal.whole ? <use href="#fz-blossom" /> : <path d={petalPath} fill="url(#fz-petal)" />}
          </svg>
        </span>
      ))}
    </div>
  );
}
