import { useState } from 'react';
import Reveal from '../ui/Reveal';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'newsletter', email }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(result.error || 'We could not add your email.');
      setSubmitted(true);
      setEmail('');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'We could not add your email.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-24">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">Join The Exclusive Circle</h2>
        <p className="mt-3 text-sm text-ink-soft">
          Priority booking on seasonal collections and expert floral styling advice, straight to your inbox.
        </p>

        {submitted ? (
          <p className="mt-8 text-sm font-medium text-rose-deep" role="status">
            You&apos;re on the list &mdash; welcome to the Exclusive Circle.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-2xl flex-col shadow-[0_18px_40px_-24px_rgba(48,40,39,0.45)] sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="min-h-14 flex-1 bg-white px-5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose"
            />
            <button
              type="submit"
              disabled={sending}
              className="min-h-14 bg-rose-deep px-10 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-ink disabled:opacity-70"
            >
              {sending ? 'Sending…' : 'Subscribe'}
            </button>
          </form>
        )}
        {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
      </Reveal>
    </section>
  );
}
