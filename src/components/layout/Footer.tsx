import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import emailIcon from '../../assets/email-icon.webp';
import facebookIcon from '../../assets/facebook-icon.webp';
import instagramIcon from '../../assets/instagram-icon.webp';
import whatsappIcon from '../../assets/whatsapp-icon.webp';
import LeafEdge from '../ui/LeafEdge';
import Logo from '../ui/Logo';
import OrnamentTitle from '../ui/OrnamentTitle';
import Reveal from '../ui/Reveal';

const footerLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
];

const socialLinks = [
  {
    label: 'Instagram',
    image: instagramIcon,
    href: 'https://www.instagram.com/flowerzone.ug?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
  },
  {
    label: 'Facebook',
    image: facebookIcon,
    href: 'https://www.facebook.com/FlowerZone-UG',
  },
  {
    label: 'Email tendofiona@yahoo.com',
    image: emailIcon,
    href: 'mailto:tendofiona@yahoo.com',
  },
];

export default function Footer() {
  return (
    <footer data-header-dark className="relative bg-ink pb-8 pt-32 text-cream/80 sm:pt-40">
      <LeafEdge position="top" />

      <OrnamentTitle light>Contacts</OrnamentTitle>

      <Reveal delay={150} className="mx-auto mt-14 grid max-w-[1040px] items-center gap-10 px-5 text-sm sm:px-8 md:grid-cols-[1fr_auto_1fr] md:gap-12">
        <div className="order-2 flex flex-col items-center gap-5 md:order-1 md:items-start">
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link key={link.href} to={link.href} className="nav-underline py-1 transition-colors hover:text-cream">
                {link.label}
              </Link>
            ))}
          </nav>
          <Link to="/contact" className="text-xs text-cream/50 underline underline-offset-4 transition-colors hover:text-cream">
            Contact &amp; enquiries
          </Link>
        </div>

        <div className="order-1 flex flex-col items-center gap-3 md:order-2">
          <Logo badge />
          <p className="font-display text-lg text-cream">Flower Zone</p>
        </div>

        <div className="order-3 flex flex-col items-center gap-4 md:items-end">
          <div className="flex flex-col items-center gap-x-8 gap-y-2 sm:flex-row">
            <a
              href="https://maps.google.com/?q=Kira+Road+Kamwokya+Kampala+Uganda"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-cream"
            >
              <MapPin size={16} className="text-rose" /> Kamwokya, Kampala
            </a>
            <a href="tel:+256772262288" className="inline-flex items-center gap-2 transition-colors hover:text-cream">
              <Phone size={16} className="text-rose" /> +256 772 262288
            </a>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
              >
                <img src={social.image} alt="" className="h-7 w-7 object-contain" />
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <p className="mx-auto mt-14 max-w-[1040px] border-t border-cream/10 px-5 pt-6 text-center text-xs text-cream/45">
        © 2026 Flower Zone Premium Florals. All rights reserved.
      </p>

      <a href="https://wa.me/256772262288" aria-label="Chat on WhatsApp" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white shadow-lg transition-transform hover:scale-105 sm:right-5 sm:h-12 sm:w-12">
        <img src={whatsappIcon} alt="" className="h-full w-full object-cover" />
      </a>
    </footer>
  );
}
