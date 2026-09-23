import { Link } from 'react-router-dom';
import flowerZoneLogo from '../../assets/flower-zone-logo-2026.webp';

interface LogoProps {
  compact?: boolean;
  badge?: boolean;
}

export default function Logo({ compact = false, badge = false }: LogoProps) {
  return (
    <Link
      to="/"
      className={`${compact ? 'h-14 w-[75px]' : 'h-16 w-[86px]'} ${
        badge ? 'overflow-hidden rounded-[50%] bg-white shadow-lg ring-1 ring-white/70 transition-transform duration-500 hover:scale-105' : ''
      } relative block shrink-0`}
      aria-label="Flower Zone home"
    >
      <img
        src={flowerZoneLogo}
        alt="Flower Zone"
        className={`h-full w-full ${badge ? 'object-cover' : 'object-contain'}`}
      />
    </Link>
  );
}
