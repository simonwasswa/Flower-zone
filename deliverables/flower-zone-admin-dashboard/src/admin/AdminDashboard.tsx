import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ExternalLink,
  Flower2,
  Images,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Menu,
  PanelsTopLeft,
  Quote,
  Route,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';
import flowerZoneLogo from '../assets/flower-zone-logo-2026.png';
import { supabase } from '../lib/supabase';
import { adminResources, type AdminResource } from './config';
import ResourceManager from './ResourceManager';

const adminEmail = 'simonwasswa33@gmail.com';
const publicWebsiteUrl = import.meta.env.VITE_PUBLIC_WEBSITE_URL || '/';

const resourceIcons: Record<string, LucideIcon> = {
  gallery_items: Images,
  services: BriefcaseBusiness,
  occasions: Sparkles,
  arrangements: Flower2,
  testimonials: Quote,
  about_stories: BookOpen,
  site_sections: PanelsTopLeft,
  journey_steps: Route,
};

type ResourceCount = Record<string, number>;

function LoginScreen() {
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError('');
    if (email.trim().toLowerCase() !== adminEmail) {
      setError('This account is not authorized to manage Flower Zone.');
      setSending(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (signInError) setError(signInError.message);
    setSending(false);
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f7edeb] px-5 py-12">
      <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#e7c8c6]/45 blur-3xl" />
      <div className="absolute -bottom-36 -right-24 h-96 w-96 rounded-full bg-[#dbaeb0]/35 blur-3xl" />
      <div className="relative w-full max-w-md rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_28px_80px_rgba(91,52,53,.14)] backdrop-blur sm:p-9">
        <a href={publicWebsiteUrl} className="mx-auto block h-20 w-28" aria-label="Return to Flower Zone">
          <img src={flowerZoneLogo} alt="Flower Zone" className="h-full w-full object-contain" />
        </a>
        <div className="mt-5 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#f5e4e3] text-[#9d5558]"><LockKeyhole size={19} /></span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[#302827]">Admin sign in</h1>
          <p className="mt-2 text-sm leading-6 text-[#796b68]">Manage the content and media displayed across the Flower Zone website.</p>
        </div>
        <form onSubmit={(event) => void signIn(event)} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-[#514543]">
            Admin email
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#e4d5d3] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a75f60] focus:ring-2 focus:ring-[#a75f60]/15" />
          </label>
          <label className="block text-sm font-semibold text-[#514543]">
            Password
            <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#e4d5d3] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#a75f60] focus:ring-2 focus:ring-[#a75f60]/15" />
          </label>
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
          <button type="submit" disabled={sending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#9d5558] px-6 text-sm font-bold text-white hover:bg-[#87474a] disabled:cursor-wait disabled:opacity-60">
            {sending ? <LoaderCircle size={18} className="animate-spin" /> : <>Sign in <ArrowRight size={17} /></>}
          </button>
        </form>
        <a href={publicWebsiteUrl} className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#9d5558] hover:text-[#302827]">Return to website <ExternalLink size={15} /></a>
      </div>
    </main>
  );
}

function Overview({ reloadKey, onOpen }: { reloadKey: number; onOpen: (resource: AdminResource) => void }) {
  const [counts, setCounts] = useState<ResourceCount>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCounts = useCallback(async () => {
    setLoading(true);
    setError('');
    const results = await Promise.all(adminResources.map(async (resource) => {
      const { count, error: countError } = await supabase.from(resource.table).select('*', { count: 'exact', head: true });
      return { resource, count: count ?? 0, error: countError };
    }));
    const failed = results.find((result) => result.error);
    if (failed?.error) setError(failed.error.message);
    setCounts(Object.fromEntries(results.map((result) => [result.resource.table, result.count])));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadCounts();
  }, [loadCounts, reloadKey]);

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#a75f60]">Overview</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-[#302827] sm:text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm leading-6 text-[#796b68]">Everything you publish here updates the content used by your public website.</p>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</div>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl bg-[#9d5558] p-5 text-white shadow-sm">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><LayoutDashboard size={19} /></span>
          <p className="mt-6 text-3xl font-semibold">{loading ? '—' : total}</p>
          <p className="mt-1 text-sm text-white/70">Total content records</p>
        </article>
        {adminResources.slice(0, 3).map((resource) => {
          const Icon = resourceIcons[resource.table];
          return (
            <button key={resource.table} type="button" onClick={() => onOpen(resource)} className="rounded-2xl border border-[#eadfdd] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f5e5e4] text-[#9d5558]"><Icon size={19} /></span>
              <p className="mt-6 text-3xl font-semibold text-[#302827]">{loading ? '—' : counts[resource.table] ?? 0}</p>
              <p className="mt-1 text-sm text-[#8b7d7a]">{resource.label}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-[#eadfdd] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#302827]">Content areas</h2>
            <p className="mt-1 text-sm text-[#8b7d7a]">Open an area to add, edit, publish, or remove content.</p>
          </div>
          <a href={publicWebsiteUrl} target="_blank" rel="noreferrer" className="hidden min-h-10 items-center gap-2 rounded-full border border-[#dbc8c5] px-4 text-sm font-semibold text-[#9d5558] hover:bg-[#fff8f7] sm:inline-flex">View site <ExternalLink size={15} /></a>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {adminResources.map((resource) => {
            const Icon = resourceIcons[resource.table];
            return (
              <button key={resource.table} type="button" onClick={() => onOpen(resource)} className="flex items-center gap-4 rounded-xl border border-[#eee3e1] p-4 text-left transition hover:border-[#d9bcba] hover:bg-[#fffaf8]">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f5e5e4] text-[#9d5558]"><Icon size={18} /></span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm text-[#302827]">{resource.label}</strong>
                  <span className="mt-0.5 block text-xs text-[#8b7d7a]">{loading ? 'Loading…' : `${counts[resource.table] ?? 0} records`}</span>
                </span>
                <ArrowRight size={16} className="text-[#a75f60]" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activeResource, setActiveResource] = useState<AdminResource | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setCheckingSession(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user.email?.toLowerCase() !== adminEmail) void supabase.auth.signOut();
  }, [session]);

  function openResource(resource: AdminResource | null) {
    setActiveResource(resource);
    setMobileMenuOpen(false);
  }

  if (checkingSession) {
    return <div className="grid min-h-screen place-items-center bg-[#fffaf8] text-[#a75f60]"><LoaderCircle size={28} className="animate-spin" /></div>;
  }

  if (!session || session.user.email?.toLowerCase() !== adminEmail) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-[#f8f3f2] text-[#302827]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#e7d9d7] bg-white/95 px-4 backdrop-blur lg:hidden">
        <button type="button" onClick={() => setMobileMenuOpen(true)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#f5e8e7]" aria-label="Open admin menu"><Menu size={21} /></button>
        <img src={flowerZoneLogo} alt="Flower Zone" className="h-12 w-20 object-contain" />
        <a href={publicWebsiteUrl} className="grid h-10 w-10 place-items-center rounded-full text-[#9d5558] hover:bg-[#f5e8e7]" aria-label="View website"><ExternalLink size={18} /></a>
      </header>

      {mobileMenuOpen && <button type="button" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-label="Close admin menu" />}

      <aside className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 flex w-[285px] flex-col border-r border-[#e7d9d7] bg-white transition-transform lg:translate-x-0`}>
        <div className="flex h-24 items-center justify-between border-b border-[#eee3e1] px-5">
          <button type="button" onClick={() => openResource(null)} className="flex items-center gap-3 text-left">
            <img src={flowerZoneLogo} alt="Flower Zone" className="h-16 w-20 object-contain" />
            <span><strong className="block font-display text-lg">Admin</strong><span className="text-[11px] uppercase tracking-[0.12em] text-[#a75f60]">Content studio</span></span>
          </button>
          <button type="button" onClick={() => setMobileMenuOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#f5e8e7] lg:hidden" aria-label="Close menu"><X size={19} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <button type="button" onClick={() => openResource(null)} className={`${!activeResource ? 'bg-[#9d5558] text-white' : 'text-[#665b59] hover:bg-[#f7eceb]'} flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold`}>
            <LayoutDashboard size={18} /> Overview
          </button>
          <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a89996]">Manage content</p>
          <div className="space-y-1">
            {adminResources.map((resource) => {
              const Icon = resourceIcons[resource.table];
              const isActive = activeResource?.table === resource.table;
              return (
                <button key={resource.table} type="button" onClick={() => openResource(resource)} className={`${isActive ? 'bg-[#f2e2e1] text-[#8d4a4d]' : 'text-[#665b59] hover:bg-[#f8efee]'} flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm font-medium`}>
                  <Icon size={17} /> {resource.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#eee3e1] p-4">
          <p className="truncate px-2 text-xs font-semibold text-[#514543]">{session.user.email}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={publicWebsiteUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#e0d0ce] text-xs font-semibold text-[#756765] hover:bg-[#fff8f7]"><ExternalLink size={14} /> Website</a>
            <button type="button" onClick={() => void supabase.auth.signOut()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#f5e8e7] text-xs font-semibold text-[#9d5558] hover:bg-[#edd9d7]"><LogOut size={14} /> Sign out</button>
          </div>
        </div>
      </aside>

      <main className="p-5 sm:p-8 lg:ml-[285px] lg:p-10 xl:p-12">
        <div className="mx-auto max-w-6xl">
          {activeResource ? (
            <ResourceManager resource={activeResource} onChanged={() => setReloadKey((value) => value + 1)} />
          ) : (
            <Overview reloadKey={reloadKey} onOpen={(resource) => openResource(resource)} />
          )}
        </div>
      </main>
    </div>
  );
}
