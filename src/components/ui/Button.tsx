import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'dark';
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-dark';

const variants: Record<string, string> = {
  primary: 'bg-rose text-white hover:bg-rose-dark',
  outline:
    'border border-ink/30 text-ink bg-transparent hover:border-ink hover:bg-ink hover:text-cream',
  dark: 'bg-ink text-cream hover:bg-ink-soft',
};

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
