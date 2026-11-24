import { useEffect, useState } from 'react';
import {
  defaultSteps,
  defaultTheme,
  serviceIcons,
  services as localServices,
  type Service,
  type ServiceGroup,
  type ServiceHighlight,
  type ServiceStep,
} from '../data/services';
import { resolveMediaUrl } from './media';
import { supabase } from './supabase';

type ServiceRow = {
  slug: string;
  title: string;
  summary: string;
  details: string | null;
  image_url: string | null;
  inclusions: string[] | null;
  updated_at: string | null;
  // Added by migration 20261123120000; undefined until it has been run.
  tagline?: string | null;
  capabilities?: string[] | null;
  steps?: string[] | null;
  cta_title?: string | null;
  cta_lead?: string | null;
};

type HighlightRow = {
  service_slug: string;
  title: string;
  body: string;
  image_url: string | null;
  icon: string | null;
  updated_at: string | null;
};

type GroupRow = {
  service_slug: string;
  title: string;
  lead: string | null;
  items: string[] | null;
};

/** Admin lists store "Title: description" per line. */
function splitTitled(line: string) {
  const index = line.indexOf(':');
  if (index < 0) return { title: line.trim(), body: '' };
  return { title: line.slice(0, index).trim(), body: line.slice(index + 1).trim() };
}

function bySlug<T extends { service_slug: string }>(rows: T[] | null) {
  const map = new Map<string, T[]>();
  for (const row of rows ?? []) map.set(row.service_slug, [...(map.get(row.service_slug) ?? []), row]);
  return map;
}

// Database content wins; src/data/services.ts fills anything the database leaves empty
// (and supplies the per-service colours, which are design rather than content).
function mergeRow(row: ServiceRow, highlightRows: HighlightRow[] = [], groupRows: GroupRow[] = []): Service {
  const local = localServices.find((service) => service.id === row.slug);
  const base: Service = local ?? {
    id: row.slug,
    title: row.title,
    tagline: row.summary,
    description: row.summary,
    details: row.details || row.summary,
    image: '',
    includes: [],
    capabilities: [],
    steps: defaultSteps,
    highlights: [],
    groups: [],
    cta: { title: `Enquire about ${row.title}`, lead: 'Tell us about your moment and we will confirm flowers, timing and delivery with you.' },
    galleryKeywords: [row.slug],
    theme: defaultTheme,
    className: '',
    buttonClass: 'bg-rose text-ink hover:bg-[#e9aab0]',
  };

  const steps: ServiceStep[] = (row.steps ?? []).filter(Boolean).map(splitTitled);
  const highlights: ServiceHighlight[] = highlightRows.map((highlight, index) => ({
    title: highlight.title,
    body: highlight.body,
    icon: serviceIcons[highlight.icon ?? ''] ?? base.highlights[index]?.icon ?? serviceIcons.Sparkles,
    image: resolveMediaUrl(highlight.image_url, highlight.updated_at ?? undefined) || undefined,
  }));
  const groups: ServiceGroup[] = groupRows.map((group) => ({
    title: group.title,
    lead: group.lead ?? '',
    items: (group.items ?? []).filter(Boolean).map(splitTitled),
  }));

  return {
    ...base,
    id: row.slug,
    title: row.title,
    tagline: row.tagline?.trim() || base.tagline,
    description: row.summary,
    details: row.details || row.summary,
    image: resolveMediaUrl(row.image_url, row.updated_at ?? undefined) || base.image,
    includes: row.inclusions?.length ? row.inclusions : base.includes,
    capabilities: row.capabilities?.length ? row.capabilities : base.capabilities,
    steps: steps.length ? steps : base.steps,
    highlights: highlights.length ? highlights : base.highlights,
    groups: groups.length ? groups : base.groups,
    cta: {
      title: row.cta_title?.trim() || base.cta.title,
      lead: row.cta_lead?.trim() || base.cta.lead,
    },
  };
}

let cache: Service[] = localServices;
let pending: Promise<Service[]> | null = null;
const listeners = new Set<(services: Service[]) => void>();

function fetchServices() {
  pending ??= (async () => {
    const [services, highlights, groups] = await Promise.all([
      // select('*') keeps working whether or not the newer columns exist yet.
      supabase.from('services').select('*').eq('is_published', true).order('sort_order'),
      supabase
        .from('service_highlights')
        .select('service_slug,title,body,image_url,icon,updated_at')
        .eq('is_published', true)
        .order('sort_order'),
      supabase.from('service_groups').select('service_slug,title,lead,items').eq('is_published', true).order('sort_order'),
    ]);

    if (services.error) console.warn('Using local service content:', services.error.message);
    else if (services.data?.length) {
      // A missing table (migration not run yet) just means local highlights / groups are used.
      const highlightMap = bySlug(highlights.error ? null : (highlights.data as HighlightRow[]));
      const groupMap = bySlug(groups.error ? null : (groups.data as GroupRow[]));
      cache = (services.data as ServiceRow[]).map((row) => mergeRow(row, highlightMap.get(row.slug), groupMap.get(row.slug)));
      listeners.forEach((listener) => listener(cache));
    }
    return cache;
  })().finally(() => {
    pending = null;
  });
  return pending;
}

let lastFetch = 0;

/** Published services, shared by the header menu, the Services page and each service page. */
export function useServices() {
  const [list, setList] = useState(cache);

  useEffect(() => {
    listeners.add(setList);
    setList(cache);

    function refresh() {
      // The header and page both mount this hook; avoid fetching twice in a row.
      if (Date.now() - lastFetch < 5000) return;
      lastFetch = Date.now();
      void fetchServices();
    }

    refresh();
    window.addEventListener('focus', refresh);
    return () => {
      listeners.delete(setList);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return list;
}
