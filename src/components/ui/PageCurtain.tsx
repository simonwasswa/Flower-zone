import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// When you move to another page, a blush curtain with a blooming flower sweeps
// up and off the screen, revealing the new page underneath.
export default function PageCurtain() {
  const { pathname } = useLocation();
  const firstRender = useRef(true);
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setPlayKey((key) => key + 1);
  }, [pathname]);

  if (!playKey) return null;

  return (
    <div key={playKey} aria-hidden="true" className="page-curtain" onAnimationEnd={(event) => {
      if (event.target === event.currentTarget) setPlayKey(0);
    }}>
      <svg viewBox="-50 -50 100 100" className="page-curtain-bloom">
        {Array.from({ length: 5 }, (_, index) => (
          <ellipse key={index} cx="0" cy="-20" rx="13" ry="22" transform={`rotate(${index * 72})`} />
        ))}
        <circle r="8" className="page-curtain-heart" />
      </svg>
    </div>
  );
}
