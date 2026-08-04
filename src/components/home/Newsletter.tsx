import { useState } from 'react';
import Button from '../ui/Button';

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
    <section className="relative overflow-hidden bg-[#fffaf8] py-16 sm:py-20">
      <span className="absolute -bottom-10 -right-8 h-36 w-36 rounded-full border-[12px] border-blush/80" aria-hidden="true" />
      <div className="mx-auto max-w-2xl px-5 sm:px-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">The Exclusive Circle</h2>
        <p className="mt-3 text-sm text-muted">
          Join our mailing list for priority booking on seasonal collections and expert floral
          styling advice.
        </p>

        {submitted ? (
          <p className="mt-6 text-sm font-medium text-rose-deep">
            You're on the list &mdash; welcome to the Exclusive Circle.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full sm:w-72 rounded-full border border-line bg-white px-5 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-rose"
            />
            <Button type="submit" variant="dark" disabled={sending}>
              {sending ? 'Sending...' : 'Subscribe'}
            </Button>
          </form>
        )}
        {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
      </div>
    </section>
  );
}
