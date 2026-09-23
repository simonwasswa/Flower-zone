import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navLinks } from '../../data/content';
import Logo from '../ui/Logo';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const { pathname } = useLocation();
  // Every page opens with a full-width photo banner, so the header floats over it until you scroll.
  const transparent = !scrolled && !open;

  // Sections marked with data-header-dark switch the see-through header to light text while they sit beneath it.
  useEffect(() => {
    function update() {
      setScrolled(window.scrollY > 40);
      const header = headerRef.current;
      if (!header) return;
      const beneath = document
        .elementsFromPoint(window.innerWidth / 2, header.getBoundingClientRect().height / 2)
        .find((element) => !header.contains(element));
      setOnDark(Boolean(beneath?.closest('[data-header-dark]')));
    }

    let frame = 0;
    function scheduleUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    }

    update();
    const settleTimer = window.setTimeout(update, 400);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.clearTimeout(settleTimer);
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [pathname]);

  const lightText = transparent || onDark;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,color] duration-500 ${
        transparent
          ? 'border-transparent bg-transparent text-cream'
          : lightText
            ? 'border-white/15 bg-ink/20 text-cream shadow-[0_8px_30px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md'
            : 'border-black/10 bg-white/25 text-black shadow-[0_8px_30px_-22px_rgba(0,0,0,0.35)] backdrop-blur-md'
      }`}
    >
      <div className={`mx-auto flex max-w-[1200px] items-center justify-between px-5 transition-[height] duration-500 sm:px-8 lg:px-12 ${transparent ? 'h-[92px]' : 'h-[72px]'}`}>
        <Logo compact badge />

        <nav className="hidden items-center gap-7 text-[13px] md:flex lg:gap-9">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) =>
                `nav-underline py-2 transition-colors ${lightText ? 'hover:text-white' : 'hover:text-rose-deep'} ${isActive ? 'font-semibold' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end md:w-[75px]">
          <button
            className={`grid h-11 w-11 place-items-center rounded-full transition-colors md:hidden ${lightText ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
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
        <nav id="mobile-navigation" className="flex flex-col border-t border-black/10 bg-white/60 px-5 py-3 text-sm text-black backdrop-blur-xl md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `flex min-h-11 items-center ${isActive ? 'font-semibold' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
