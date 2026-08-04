import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navLinks } from '../../data/content';
import whatsappIcon from '../../assets/whatsapp-icon.png';
import Logo from '../ui/Logo';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />

        <nav className="hidden items-center gap-7 text-[13px] text-ink-soft md:flex lg:gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `relative py-2 transition-colors hover:text-rose-deep ${isActive ? 'font-medium text-rose-deep' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/256772262288"
            aria-label="Chat on WhatsApp"
            className="hidden h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-transform hover:scale-105 sm:flex"
          >
            <img src={whatsappIcon} alt="" className="h-8 w-8 object-cover" />
          </a>
          <button
            className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-blush md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-navigation" className="flex flex-col border-t border-line bg-cream px-5 py-3 text-sm text-ink-soft md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `flex min-h-11 items-center ${isActive ? 'font-medium text-ink' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
