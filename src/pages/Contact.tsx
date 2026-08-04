import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, MapPin, Phone, type LucideIcon } from 'lucide-react';
import Eyebrow from '../components/ui/Eyebrow';
import emailIcon from '../assets/email-icon.png';
import { supabase } from '../lib/supabase';
import { handleImageError, resolveMediaUrl } from '../lib/media';

const fieldClass =
  'mt-2 w-full rounded-[8px] border border-transparent bg-[#faf5f3] px-4 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-[#c1b4b0] focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20 sm:text-sm';

const fallbackEventImage =
  'https://images.pexels.com/photos/5414007/pexels-photo-5414007.jpeg?auto=compress&cs=tinysrgb&w=1200';

type ContactDetail = {
  label: string;
  value: string;
  href: string;
  icon?: LucideIcon;
  image?: string;
};

const contactDetails: ContactDetail[] = [
  {
    label: 'Address',
    value: 'Plot 24, Kira Road, Kamwokya\nKampala, Uganda',
    href: 'https://maps.google.com/?q=Kira+Road+Kamwokya+Kampala+Uganda',
    icon: MapPin,
  },
  {
    label: 'Phone',
    value: '+256 772 262288',
    href: 'tel:+256772262288',
    icon: Phone,
  },
  {
    label: 'Email',
    value: 'hello@flowerzone.com',
    href: 'mailto:hello@flowerzone.com',
    image: emailIcon,
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [eventImage, setEventImage] = useState(fallbackEventImage);

  useEffect(() => {
    let cancelled = false;

    async function loadEventImage() {
      const { data, error: queryError } = await supabase
        .from('site_sections')
        .select('image_url,updated_at')
        .eq('page_key', 'contact')
        .eq('section_key', 'events')
        .eq('is_published', true)
        .maybeSingle();
      if (!cancelled && !queryError && data?.image_url) {
        setEventImage(resolveMediaUrl(data.image_url, data.updated_at));
      }
    }

    void loadEventImage();
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'contact',
          name: formData.get('name'),
          email: formData.get('email'),
          occasion: formData.get('occasion'),
          message: formData.get('message'),
          website: formData.get('website'),
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(result.error || 'We could not send your message.');
      setSubmitted(true);
      form.reset();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'We could not send your message.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-[#fffaf8]">
      <section className="px-5 pb-14 pt-12 text-center sm:px-8 sm:pb-16 sm:pt-14">
        <Eyebrow align="center">Get in Touch</Eyebrow>
        <h1 className="mx-auto mt-5 max-w-[1120px] font-display text-[2.1rem] font-semibold leading-[1.1] text-ink min-[380px]:text-[2.35rem] sm:text-[2.7rem] lg:text-[2.9rem]">
          Let&apos;s Create Something{' '}
          <em className="font-medium text-rose-deep">Beautiful</em> Together
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
          Whether it&apos;s a simple bouquet or a grand celebration, our floral designers are
          ready to bring your vision to life.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1220px] gap-5 px-5 pb-16 sm:px-8 lg:grid-cols-[1.42fr_1fr] lg:gap-6 lg:pb-20">
        <div id="contact-form" className="rounded-[8px] border border-line/30 bg-white/50 p-5 sm:min-h-[650px] sm:p-10 lg:p-12">
          {submitted ? (
            <div className="flex h-full min-h-[470px] flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-blush text-rose-deep">
                <Check size={24} />
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold text-ink">Message Received</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
                Thank you for sharing your plans. Our studio team will be in touch within one business day.
              </p>
              <button type="button" onClick={() => setSubmitted(false)} className="mt-7 text-sm font-medium text-rose-deep underline underline-offset-4">
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-3xl font-semibold text-ink">Send a Message</h2>
              <form onSubmit={handleSubmit} className="mt-9 space-y-6">
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="text-sm font-medium text-ink-soft">
                    Full Name
                    <input name="name" autoComplete="name" required placeholder="Rose Miller" className={fieldClass} />
                  </label>
                  <label className="text-sm font-medium text-ink-soft">
                    Email Address
                    <input name="email" type="email" autoComplete="email" required placeholder="rose@example.com" className={fieldClass} />
                  </label>
                </div>

                <label className="block text-sm font-medium text-ink-soft">
                  Occasion Type
                  <select name="occasion" defaultValue="just-because" className={`${fieldClass} appearance-auto`}>
                    <option value="just-because">Just Because</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="sympathy">Sympathy</option>
                    <option value="corporate">Corporate Event</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-ink-soft">
                  How can we help?
                  <textarea name="message" required rows={5} placeholder="Tell us about your floral needs..." className={`${fieldClass} resize-none`} />
                </label>

                {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

                <button disabled={sending} type="submit" className="inline-flex w-full min-w-44 items-center justify-center rounded-full bg-[#9d4f52] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep disabled:cursor-wait disabled:opacity-60 sm:w-auto">
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </div>

        <div>
          <aside className="rounded-[28px] bg-[#f0e8e7] p-7 sm:p-9">
            <h2 className="font-display text-2xl font-semibold text-rose-deep">The Studio</h2>
            <div className="mt-7 space-y-5">
              {contactDetails.map((detail) => (
                <a key={detail.label} href={detail.href} className="group flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-rose-deep transition-colors group-hover:bg-rose-deep group-hover:text-white">
                    {detail.image ? (
                      <img src={detail.image} alt="" className="h-7 w-7 object-contain" />
                    ) : detail.icon ? (
                      <detail.icon size={18} strokeWidth={1.8} />
                    ) : null}
                  </span>
                  <span className="pt-0.5">
                    <strong className="block text-sm font-semibold text-ink">{detail.label}</strong>
                    <span className="whitespace-pre-line text-sm leading-6 text-ink-soft">{detail.value}</span>
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-7 border-t border-[#d9c4c2] pt-6">
              <h3 className="text-sm font-semibold text-ink">Studio Hours</h3>
              <dl className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 text-sm text-ink-soft sm:gap-x-5">
                <dt>Mon - Fri</dt><dd>9:00 AM - 6:00 PM</dd>
                <dt>Saturday</dt><dd>10:00 AM - 4:00 PM</dd>
                <dt>Sunday</dt><dd>Closed</dd>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-[1220px] px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="relative min-h-[340px] overflow-hidden rounded-[24px] sm:min-h-[380px] sm:rounded-[34px]">
          {eventImage && <img src={eventImage} alt="Elegant floral setting prepared for a major event" onError={handleImageError} className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative flex min-h-[340px] max-w-2xl flex-col justify-center px-6 py-10 text-white sm:min-h-[380px] sm:px-14 sm:py-12">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Major Events &amp; Bespoke Services</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/90">
              Planning a wedding, gala, or a heartfelt farewell? Our lead designers offer private consultations to ensure every petal reflects your story perfectly.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#contact-form" className="inline-flex w-full min-w-48 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-rose-deep transition-colors hover:bg-blush min-[420px]:w-auto">
                Book a Consultation
              </a>
              <Link to="/services" className="inline-flex w-full min-w-40 items-center justify-center rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-ink min-[420px]:w-auto">
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
