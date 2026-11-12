const occasions = ['Weddings', 'Birthdays', 'Anniversaries', "Valentine's", 'Corporate Events', 'Gift Baskets', 'Sympathy & Burials', 'Surprises'];

function Flower() {
  return (
    <svg viewBox="-12 -12 24 24" aria-hidden="true" className="ribbon-flower size-5 shrink-0 fill-rose">
      {Array.from({ length: 5 }, (_, index) => (
        <ellipse key={index} cx="0" cy="-5.5" rx="3.6" ry="5.5" transform={`rotate(${index * 72})`} />
      ))}
      <circle r="2.6" className="fill-cream" />
    </svg>
  );
}

// Two slanted ribbons of occasion names drifting past each other in opposite directions.
export default function OccasionRibbon() {
  const row = [...occasions, ...occasions];

  return (
    <section aria-label="Occasions we style" className="relative overflow-hidden bg-cream py-14 sm:py-20">
      <div className="-mx-[5vw] -rotate-2 border-y border-rose/30 ribbon-ink py-4 shadow-[0_20px_40px_-30px_rgba(48,40,39,0.8)]">
        <ul className="ribbon-track flex w-max items-center gap-8 pr-8">
          {row.map((name, index) => (
            <li key={index} className="flex items-center gap-8 font-display text-2xl italic text-cream sm:text-4xl" aria-hidden={index >= occasions.length}>
              {name}
              <Flower />
            </li>
          ))}
        </ul>
      </div>
      <div className="-mx-[5vw] -mt-3 rotate-1 border-y border-rose/40 bg-blush py-3" aria-hidden="true">
        <ul className="ribbon-track ribbon-track-reverse flex w-max items-center gap-8 pr-8">
          {row.map((name, index) => (
            <li key={index} className="flex items-center gap-8 text-xs font-medium uppercase tracking-[0.35em] text-rose-deep sm:text-sm">
              {name}
              <span className="size-1.5 rounded-full bg-rose" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
