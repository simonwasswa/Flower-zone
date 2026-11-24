import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check, Mail, MessageCircle } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import supportBanner from '../assets/hero-pink-bouquet-polished.webp';

const fieldClass =
  'mt-2 w-full rounded-[8px] border border-transparent bg-field px-4 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-rose focus:bg-petal focus:ring-2 focus:ring-rose/20 sm:text-sm';

const WHATSAPP_NUMBER = '256772262288';
const SUPPORT_EMAIL = 'tendofiona@yahoo.com';
const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Flower Zone, I need help with my order.')}`;
const emailLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Flower Zone support request')}`;

const TOPICS = [
  { value: 'order_problem', label: 'Problem with my order' },
  { value: 'delivery', label: 'Delivery question' },
  { value: 'question', label: 'General question' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'other', label: 'Something else' },
];

async function postJson(url: string, body: Record<string, unknown>, fallbackError: string) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = (await response.json().catch(() => ({}))) as { error?: string };
    return response.ok ? '' : result.error || fallbackError;
  } catch {
    return fallbackError;
  }
}

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? '').trim();
  return value || null;
}

export default function Support() {
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;
    const formData = new FormData(form);

    const customerEmail = text(formData, 'customer_email');
    const customerPhone = text(formData, 'customer_phone');
    if (!customerEmail && !customerPhone) {
      setError('Please leave an email address or phone number so we can reply.');
      return;
    }

    setSending(true);
    const failure = await postJson('/api/support', {
      topic: text(formData, 'topic') ?? 'other',
      customer_name: text(formData, 'customer_name'),
      customer_email: customerEmail,
      customer_phone: customerPhone,
      message: text(formData, 'message'),
      website: text(formData, 'website'),
    }, 'We could not send your request. Please try again, or message us on WhatsApp.');
    setSending(false);

    if (failure) {
      setError(failure);
      return;
    }
    form.reset();
    setSubmitted(true);
  }

  return (
    <div className="bloom-wash">
      <PageBanner
        eyebrow="Customer Support"
        title={<>We&apos;re Here to <em className="text-rose">Help</em></>}
        subtitle="Something not quite right with your order, or just have a question? Reach us whichever way suits you."
        image={supportBanner}
      />

      <section className="mx-auto grid max-w-[1220px] gap-5 px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[1.42fr_1fr] lg:gap-6">
        <div className="rounded-[8px] border border-line/60 bg-petal/70 p-5 shadow-[0_24px_60px_-40px_rgba(154,84,88,0.5)] sm:p-10 lg:p-12">
          {submitted ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-blush text-rose-deep">
                <Check size={24} />
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold text-ink">Request Received</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
                Thank you. Our team will get back to you within one business day. For anything urgent, message us on WhatsApp.
              </p>
              <button type="button" onClick={() => setSubmitted(false)} className="mt-7 text-sm font-medium text-rose-deep underline underline-offset-4">
                Send another request
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-3xl font-semibold text-ink">Send a Support Request</h2>
              <form onSubmit={(event) => void handleSubmit(event)} className="mt-9 space-y-6">
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <label className="block text-sm font-medium text-ink-soft">
                  What do you need help with?
                  <select name="topic" defaultValue="order_problem" className={`${fieldClass} appearance-auto`}>
                    {TOPICS.map((topic) => <option key={topic.value} value={topic.value}>{topic.label}</option>)}
                  </select>
                </label>

                <label className="block text-sm font-medium text-ink-soft">
                  Your name
                  <input name="customer_name" autoComplete="name" required maxLength={120} placeholder="Rose Miller" className={fieldClass} />
                </label>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="text-sm font-medium text-ink-soft">
                    Email address
                    <input name="customer_email" type="email" autoComplete="email" maxLength={254} placeholder="rose@example.com" className={fieldClass} />
                  </label>
                  <label className="text-sm font-medium text-ink-soft">
                    Phone / WhatsApp
                    <input name="customer_phone" type="tel" autoComplete="tel" maxLength={40} placeholder="+256 7XX XXX XXX" className={fieldClass} />
                  </label>
                </div>
                <p className="-mt-3 text-xs text-muted">Leave at least one so we can reply.</p>

                <label className="block text-sm font-medium text-ink-soft">
                  Tell us what happened
                  <textarea name="message" required rows={5} maxLength={4000} placeholder="Include your order date and the recipient's name if it's about an order." className={`${fieldClass} resize-none`} />
                </label>

                {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

                <button disabled={sending} type="submit" className="inline-flex w-full min-w-44 items-center justify-center rounded-full bg-wine px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-wine-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep disabled:cursor-wait disabled:opacity-60 sm:w-auto">
                  {sending ? 'Sending...' : 'Send Request'}
                </button>
              </form>
            </>
          )}
        </div>

        <aside className="h-fit rounded-[28px] bg-blush p-7 sm:p-9">
          <h2 className="font-display text-2xl font-semibold text-rose-deep">Prefer to talk?</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">WhatsApp is the quickest way to reach us during studio hours.</p>
          <div className="mt-6 space-y-3">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl bg-petal p-4 transition-colors hover:bg-rose-deep hover:text-white">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-rose-deep"><MessageCircle size={19} /></span>
              <span>
                <strong className="block text-sm font-semibold">Message us on WhatsApp</strong>
                <span className="text-sm opacity-80">+256 772 262288</span>
              </span>
            </a>
            <a href={emailLink} className="group flex items-center gap-4 rounded-2xl bg-petal p-4 transition-colors hover:bg-rose-deep hover:text-white">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-rose-deep"><Mail size={19} /></span>
              <span className="min-w-0">
                <strong className="block text-sm font-semibold">Email us</strong>
                <span className="block truncate text-sm opacity-80">{SUPPORT_EMAIL}</span>
              </span>
            </a>
          </div>
          <div className="mt-7 border-t border-blush-dark pt-6 text-sm text-ink-soft">
            <h3 className="font-semibold text-ink">Studio Hours</h3>
            <dl className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2">
              <dt>Mon - Fri</dt><dd>9:00 AM - 6:00 PM</dd>
              <dt>Saturday</dt><dd>10:00 AM - 4:00 PM</dd>
              <dt>Sunday</dt><dd>Closed</dd>
            </dl>
            <p className="mt-6">Happy with your flowers? <Link to="/feedback" className="font-medium text-rose-deep underline underline-offset-4">Leave us feedback</Link>.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
