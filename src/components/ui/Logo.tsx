import { Link } from 'react-router-dom';
import flowerZoneLogo from '../../assets/flower-zone-logo-2026.png';

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className={`${compact ? 'h-14 w-[75px]' : 'h-16 w-[86px]'} relative block shrink-0`}
      aria-label="Flower Zone home"
    >
      <img
        src={flowerZoneLogo}
        alt="Flower Zone"
        className="h-full w-full object-contain"
      />
    </Link>
  );
}
