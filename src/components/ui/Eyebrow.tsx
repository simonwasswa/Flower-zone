interface EyebrowProps {
  children: string;
  align?: 'left' | 'center';
  light?: boolean;
}

export default function Eyebrow({ children, align = 'left', light = false }: EyebrowProps) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.2em] ${
        light ? 'text-rose-dark' : 'text-rose-deep'
      } ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {children}
    </p>
  );
}
