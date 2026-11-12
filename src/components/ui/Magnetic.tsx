import { useRef, type ReactNode } from 'react';

interface MagneticProps {
  children: ReactNode;
  /** How far (as a share of the cursor offset) the element follows the pointer. */
  strength?: number;
  className?: string;
}

// Buttons lean gently toward the cursor and spring back when it leaves. Mouse only.
export default function Magnetic({ children, strength = 0.28, className = '' }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={ref}
      className={`magnetic inline-flex ${className}`}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return;
        const node = ref.current;
        if (!node) return;
        const box = node.getBoundingClientRect();
        const x = (event.clientX - box.left - box.width / 2) * strength;
        const y = (event.clientY - box.top - box.height / 2) * strength;
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = '';
      }}
    >
      {children}
    </span>
  );
}
