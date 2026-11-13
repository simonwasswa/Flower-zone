import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { navLinks } from '../../data/content';
import { useServices } from '../../lib/useServices';
import { handleImageError } from '../../lib/media';
import Logo from '../ui/Logo';

const SERVICES_HREF = '/services';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeTimer = useRef(0);
  const services = useServices();
  const { pathname } = useLocation();
  // Every page opens with a full-width photo banner, so the header floats over it until you scroll.
  const transparent = !scrolled && !open;

  // Sections marked with data-header-dark switch the see-through header to light text while they sit beneath it.
  // A layout effect sets the right colours before the first paint, so light heroes never flash pale menu text.
  useLayoutEffect(() => {
    function update() {
      setScrolled(window.scrollY > 40);
      const header = headerRef.current;
      if (!header) return;
      const beneath = document
        .elementsFromPoint(window.innerWidth / 2, header.getBoundingClientRect().height / 2)
        // Skip the header and full-screen overlays (page curtain, petals) and look for the section underneath.
        .find((element) => !header.contains(element) && element.closest('[data-header-dark], [data-header-light]'));
      setOnDark(Boolean(beneath?.closest('[data-header-dark]')));
      setOnLight(Boolean(beneath?.closest('[data-header-light]')));
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

  useEffect(() => {
    setMenuOpen(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // A short delay lets the pointer travel from the link into the panel without it closing.
  function openMenu() {
    window.clearTimeout(closeTimer.current);
    setMenuOpen(true);
  }
  function closeMenuSoon() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenuOpen(false), 160);
  }

  // Light heroes (marked data-header-light) keep dark text even while the header is see-through.
  const lightText = onDark || (transparent && !onLight);
  const linkClass = (isActive: boolean) =>
    `nav-underline py-2 transition-colors ${lightText ? 'hover:text-white' : 'hover:text-rose-deep'} ${isActive ? 'font-semibold' : ''}`;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,color] duration-500 ${
        transparent
          ? `border-transparent bg-transparent ${lightText ? 'text-cream' : 'text-ink'}`
          : lightText
            ? 'border-white/15 bg-ink/20 text-cream shadow-[0_8px_30px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md'
            : 'border-black/10 bg-white/25 text-black shadow-[0_8px_30px_-22px_rgba(0,0,0,0.35)] backdrop-blur-md'
      }`}
    >
      <div className={`mx-auto flex max-w-[1200px] items-center justify-between px-5 transition-[height] duration-500 sm:px-8 lg:px-12 ${transparent ? 'h-[92px]' : 'h-[72px]'}`}>
        <Logo compact badge />

        <nav className="hidden items-center gap-7 text-[13px] md:flex lg:gap-9">
          {navLinks.map((link) =>
            link.href === SERVICES_HREF ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={openMenu}
                onMouseLeave={closeMenuSoon}
                onFocus={openMenu}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) closeMenuSoon();
                }}
              >
                <div className="flex items-center gap-1">
                  <NavLink to={link.href} className={({ isActive }) => linkClass(isActive)}>
                    {link.label}
                  </NavLink>
                  <button
                    type="button"
                    aria-label="Show services"
                    aria-expanded={menuOpen}
                    aria-controls="services-menu"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="grid size-6 place-items-center rounded-full"
                  >
                    <ChevronDown size={14} className={`transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <div
                  id="services-menu"
                  className={`absolute left-1/2 top-full w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 pt-4 transition-[opacity,transform,visibility] duration-300 ${
                    menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                  }`}
                >
                  <div className="overflow-hidden rounded-[16px] border border-line bg-cream text-ink shadow-[0_30px_60px_-30px_rgba(48,40,39,0.45)]">
                    <ul className="grid gap-1 p-3 sm:grid-cols-2">
                      {services.map((service) => (
                        <li key={service.id}>
                          <NavLink
                            to={`${SERVICES_HREF}/${service.id}`}
                            className={({ isActive }) =>
                              `group flex items-center gap-3 rounded-[12px] p-2.5 transition-colors hover:bg-blush ${isActive ? 'bg-blush' : ''}`
                            }
                          >
                            <span className="size-12 shrink-0 overflow-hidden rounded-[10px] bg-blush">
                              {service.image && (
                                <img
                                  src={service.image}
                                  alt=""
                                  loading="lazy"
                                  onError={handleImageError}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="flex items-center gap-2 text-[13px] font-semibold text-ink group-hover:text-rose-deep">
                                <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: service.theme.accent }} aria-hidden="true" />
                                {service.title}
                              </span>
                              <span className="mt-0.5 block truncate text-xs text-muted">{service.tagline}</span>
                            </span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                    <NavLink
                      to={SERVICES_HREF}
                      end
                      className="flex items-center justify-between border-t border-line bg-petal px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-rose-deep transition-colors hover:bg-blush"
                    >
                      View all services <ArrowRight size={14} />
                    </NavLink>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={link.href} to={link.href} end={link.href === '/'} className={({ isActive }) => linkClass(isActive)}>
                {link.label}
              </NavLink>
            ),
          )}
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
          {navLinks.map((link) =>
            link.href === SERVICES_HREF ? (
              <div key={link.href}>
                <div className="flex items-center justify-between">
                  <NavLink to={link.href} end onClick={() => setOpen(false)} className={({ isActive }) => `flex min-h-11 flex-1 items-center ${isActive ? 'font-semibold' : ''}`}>
                    {link.label}
                  </NavLink>
                  <button
                    type="button"
                    aria-label="Show services"
                    aria-expanded={mobileServicesOpen}
                    aria-controls="mobile-services"
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    className="grid size-11 place-items-center"
                  >
                    <ChevronDown size={18} className={`transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <div className={`grid transition-[grid-template-rows] duration-300 ${mobileServicesOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <ul id="mobile-services" className="overflow-hidden border-l border-black/10 pl-4">
                    {services.map((service) => (
                      <li key={service.id}>
                        <NavLink
                          to={`${SERVICES_HREF}/${service.id}`}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) => `flex min-h-11 flex-col justify-center py-1 ${isActive ? 'font-semibold text-rose-deep' : ''}`}
                        >
                          {service.title}
                          <span className="text-xs font-normal text-black/55">{service.tagline}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `flex min-h-11 items-center ${isActive ? 'font-semibold' : ''}`}
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
