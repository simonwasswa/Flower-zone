import { footerColumns } from '../../data/content';
import emailIcon from '../../assets/email-icon.png';
import facebookIcon from '../../assets/facebook-icon.png';
import instagramIcon from '../../assets/instagram-icon.png';
import whatsappIcon from '../../assets/whatsapp-icon.png';
import Logo from '../ui/Logo';

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
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#eee5e4] pb-8 pt-14">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-9 min-[480px]:grid-cols-2 md:grid-cols-4 md:gap-10">
          <div className="min-[480px]:col-span-2 md:col-span-1">
            <Logo compact />
            <p className="mt-4 text-sm text-muted leading-relaxed max-w-xs">
              Elevating life's most precious occasions through premium floral artistry and
              concierge delivery services.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-rose-deep transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
              {col.title === 'Connect' && (
                <p className="mt-3 text-sm text-muted">
                  Concierge: 9am &ndash; 9pm
                  <br />
                  WhatsApp: 24/7 Available
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-line pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted">© 2026 Flower Zone Premium Florals. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white transition-transform hover:scale-105"
              >
                <img src={social.image} alt="" className="h-7 w-7 object-contain" />
              </a>
            ))}
            <a href="mailto:tendofiona@yahoo.com" aria-label="Email tendofiona@yahoo.com" className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white transition-transform hover:scale-105">
              <img src={emailIcon} alt="" className="h-7 w-7 object-contain" />
            </a>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted">
            <a href="#" className="hover:text-rose-deep">Privacy Policy</a>
            <a href="#" className="hover:text-rose-deep">Terms of Service</a>
          </div>
        </div>
      </div>
      <a href="https://wa.me/256772262288" aria-label="Chat on WhatsApp" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white shadow-lg transition-transform hover:scale-105 sm:right-5 sm:h-12 sm:w-12">
        <img src={whatsappIcon} alt="" className="h-full w-full object-cover" />
      </a>
    </footer>
  );
}
