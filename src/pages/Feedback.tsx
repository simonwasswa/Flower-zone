import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';
import feedbackBanner from '../assets/hero-pink-bouquet-polished.webp';

const fieldClass =
  'mt-2 w-full rounded-[8px] border border-transparent bg-field px-4 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-rose focus:bg-petal focus:ring-2 focus:ring-rose/20 sm:text-sm';

const SERVICES = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'romance', label: 'Romance' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'sympathy', label: 'Sympathy' },
  { value: 'surprise', label: 'Surprise' },
  { value: 'other', label: 'Something else' },
];

const DELIVERY = [
  { value: 'yes', label: 'Yes, on time' },
  { value: 'late', label: 'It arrived late' },
  { value: 'not_delivered', label: 'I collected it / no delivery' },
];

const RECOMMEND = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'no', label: 'No' },
];

const RATING_WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

function StarRating({ name, label, value, onChange, required }: { name: string; label: string; value: number; onChange: (value: number) => void; required?: boolean }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink-soft">
        {label} {required && <span className="text-rose-deep">*</span>}
      </legend>
      <div className="mt-2 flex items-center gap-1" role="radiogroup">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer rounded-full p-1 focus-within:ring-2 focus-within:ring-rose/40">
            <input type="radio" name={name} value={n} checked={value === n} onChange={() => onChange(n)} className="sr-only" aria-label={`${n} star${n > 1 ? 's' : ''} – ${RATING_WORDS[n]}`} />
            <Star size={30} strokeWidth={1.6} className={`transition-colors ${n <= value ? 'fill-rose text-rose' : 'text-line hover:text-rose/60'}`} />
          </label>
        ))}
        <span className="ml-2 text-sm text-muted">{value ? RATING_WORDS[value] : ''}</span>
      </div>
    </fieldset>
  );
}

function ChoiceGroup({ name, label, options }: { name: string; label: string; options: { value: string; label: string }[] }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink-soft">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input type="radio" name={name} value={option.value} className="peer sr-only" />
            <span className="inline-flex min-h-10 items-center rounded-full border border-line bg-petal px-4 text-sm text-ink-soft transition-colors peer-checked:border-rose-deep peer-checked:bg-rose-deep peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-rose/40">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

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

export default function Feedback() {
  const [overall, setOverall] = useState(0);
  const [quality, setQuality] = useState(0);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!overall) {
      setError('Please choose an overall rating.');
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSending(true);
    const failure = await postJson('/api/feedback', {
      overall_rating: overall,
      flower_quality: quality || null,
      service_used: text(formData, 'service_used'),
      delivery_on_time: text(formData, 'delivery_on_time'),
      would_recommend: text(formData, 'would_recommend'),
      liked_most: text(formData, 'liked_most'),
      improve: text(formData, 'improve'),
      customer_name: text(formData, 'customer_name'),
      customer_email: text(formData, 'customer_email'),
      can_quote: formData.get('can_quote') === 'on',
      website: text(formData, 'website'),
    }, 'We could not send your feedback. Please try again in a moment.');
    setSending(false);

    if (failure) {
      setError(failure);
      return;
    }
    form.reset();
    setOverall(0);
    setQuality(0);
    setSubmitted(true);
  }

  return (
    <div className="bloom-wash">
      <PageBanner
        eyebrow="Your Feedback"
        title={<>How Did We <em className="text-rose">Do</em>?</>}
        subtitle="Tell us about your Flower Zone experience. It takes about a minute and helps us make every bouquet better."
        image={feedbackBanner}
      />

      <section className="mx-auto max-w-[820px] px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="rounded-[8px] border border-line/60 bg-petal/70 p-5 shadow-[0_24px_60px_-40px_rgba(154,84,88,0.5)] sm:p-10 lg:p-12">
          {submitted ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-blush text-rose-deep">
                <Check size={24} />
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold text-ink">Thank You!</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
                Your feedback has reached our studio team. We read every response.
              </p>
              <Link to="/" className="mt-7 text-sm font-medium text-rose-deep underline underline-offset-4">
                Back to the home page
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-display text-3xl font-semibold text-ink">Customer Survey</h2>
              <p className="mt-2 text-sm text-muted">Only the overall rating is required.</p>
              <form onSubmit={(event) => void handleSubmit(event)} className="mt-9 space-y-8">
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <StarRating name="overall_rating" label="Overall, how happy were you with Flower Zone?" value={overall} onChange={setOverall} required />
                <StarRating name="flower_quality" label="How would you rate the quality and freshness of the flowers?" value={quality} onChange={setQuality} />

                <label className="block text-sm font-medium text-ink-soft">
                  Which service did you use?
                  <select name="service_used" defaultValue="" className={`${fieldClass} appearance-auto`}>
                    <option value="">Choose one (optional)</option>
                    {SERVICES.map((service) => <option key={service.value} value={service.value}>{service.label}</option>)}
                  </select>
                </label>

                <ChoiceGroup name="delivery_on_time" label="Did your order arrive on time?" options={DELIVERY} />
                <ChoiceGroup name="would_recommend" label="Would you recommend us to a friend?" options={RECOMMEND} />

                <label className="block text-sm font-medium text-ink-soft">
                  What did you love most?
                  <textarea name="liked_most" rows={3} maxLength={2000} placeholder="The colours, the wrapping, the surprise on their face…" className={`${fieldClass} resize-none`} />
                </label>

                <label className="block text-sm font-medium text-ink-soft">
                  Is there anything we could do better?
                  <textarea name="improve" rows={3} maxLength={2000} placeholder="Be honest — it helps us grow." className={`${fieldClass} resize-none`} />
                </label>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="text-sm font-medium text-ink-soft">
                    Your name (optional)
                    <input name="customer_name" autoComplete="name" maxLength={120} placeholder="Rose Miller" className={fieldClass} />
                  </label>
                  <label className="text-sm font-medium text-ink-soft">
                    Email (optional)
                    <input name="customer_email" type="email" autoComplete="email" maxLength={254} placeholder="So we can follow up" className={fieldClass} />
                  </label>
                </div>

                <label className="flex items-start gap-3 text-sm text-ink-soft">
                  <input type="checkbox" name="can_quote" className="mt-0.5 h-4 w-4 accent-rose-deep" />
                  Flower Zone may share my comments (with my first name) on the website.
                </label>

                {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

                <button disabled={sending} type="submit" className="inline-flex w-full min-w-44 items-center justify-center rounded-full bg-wine px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-wine-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep disabled:cursor-wait disabled:opacity-60 sm:w-auto">
                  {sending ? 'Sending...' : 'Send Feedback'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
