import { useEffect, useRef } from 'react';
import { Award, Clock, Flower2, Truck, Users, type LucideIcon } from 'lucide-react';
import OrnamentTitle from '../ui/OrnamentTitle';
import Reveal from '../ui/Reveal';

const reasons: { icon: LucideIcon; text: string }[] = [
  { icon: Truck, text: 'Scheduled delivery across Kampala' },
  { icon: Flower2, text: 'Bespoke designs by our master florists' },
  { icon: Award, text: '5k+ events styled and managed' },
  { icon: Users, text: 'A dedicated 24/7 surprise team' },
  { icon: Clock, text: 'Concierge 9am – 9pm, WhatsApp 24/7' },
];

function DrawnIcon({ icon: Icon }: { icon: LucideIcon }) {
  const ref = useRef<HTMLSpanElement>(null);

  // Normalise every stroke to length 1 so the CSS draw-on animation works for any icon shape.
  useEffect(() => {
    ref.current
      ?.querySelectorAll('path, circle, line, polyline, polygon, rect, ellipse')
      .forEach((shape) => shape.setAttribute('pathLength', '1'));
  }, []);

  return (
    <span ref={ref} className="draw-icon grid size-20 place-items-center rounded-full text-ink transition-all duration-500 group-hover:-translate-y-1.5 group-hover:bg-blush group-hover:text-rose-deep">
      <Icon size={52} strokeWidth={1} aria-hidden="true" />
    </span>
  );
}

export default function WhyUs() {
  return (
    <section className="bg-cream px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-20">
      <OrnamentTitle>Why Flower Zone?</OrnamentTitle>

      <ul className="mx-auto mt-14 grid max-w-[1040px] grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
        {reasons.map((reason, index) => (
          <li key={reason.text} className={index === reasons.length - 1 ? 'col-span-2 sm:col-span-1' : ''}>
            <Reveal delay={index * 140} className="group flex flex-col items-center text-center">
              <DrawnIcon icon={reason.icon} />
              <p className="mt-4 max-w-[170px] text-[13px] leading-5 text-ink-soft">{reason.text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
