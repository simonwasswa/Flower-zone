import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary';

// A small rose dot with a trailing ring. The ring swells over links and buttons and
// turns into a "View" bubble over photos. Only on devices with a precise mouse.
export default function FancyCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!fine || reduced || !dot || !ring) return;

    document.documentElement.classList.add('has-fancy-cursor');
    const target = { x: -100, y: -100 };
    const trail = { x: -100, y: -100 };
    let frame = 0;

    function tick() {
      trail.x += (target.x - trail.x) * 0.18;
      trail.y += (target.y - trail.y) * 0.18;
      ring!.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      frame = Math.abs(target.x - trail.x) + Math.abs(target.y - trail.y) > 0.1 ? requestAnimationFrame(tick) : 0;
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      target.x = event.clientX;
      target.y = event.clientY;
      dot!.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      document.documentElement.classList.add('cursor-active');
      if (!frame) frame = requestAnimationFrame(tick);

      const element = event.target instanceof Element ? event.target : null;
      const state = element?.closest('[data-cursor="view"]') ? 'view' : element?.closest(INTERACTIVE) ? 'link' : '';
      if (ring!.dataset.state !== state) ring!.dataset.state = state;
    }

    function onLeave() {
      document.documentElement.classList.remove('cursor-active');
    }
    function onDown() {
      ring!.dataset.pressed = '';
    }
    function onUp() {
      delete ring!.dataset.pressed;
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('has-fancy-cursor', 'cursor-active');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring">
        <span className="cursor-ring-shape" />
        <span className="cursor-ring-label">View</span>
      </div>
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
    </>
  );
}
