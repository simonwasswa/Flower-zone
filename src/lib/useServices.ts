import { useEffect, useState } from 'react';
import { defaultSteps, defaultTheme, services as localServices, type Service } from '../data/services';
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
};

// Admin-managed fields (title, summary, image, inclusions) come from Supabase;
// the richer page content (steps, highlights, groups) comes from src/data/services.ts.
function mergeRow(row: ServiceRow): Service {
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

  return {
    ...base,
    id: row.slug,
    title: row.title,
    description: row.summary,
    details: row.details || row.summary,
    image: resolveMediaUrl(row.image_url, row.updated_at ?? undefined) || base.image,
    includes: row.inclusions?.length ? row.inclusions : base.includes,
  };
}

let cache: Service[] = localServices;
let pending: Promise<Service[]> | null = null;
const listeners = new Set<(services: Service[]) => void>();

function fetchServices() {
  pending ??= (async () => {
    const { data, error } = await supabase
      .from('services')
      .select('slug,title,summary,details,image_url,inclusions,sort_order,updated_at')
      .eq('is_published', true)
      .order('sort_order');

    if (error) console.warn('Using local service content:', error.message);
    else if (data?.length) {
      cache = (data as ServiceRow[]).map(mergeRow);
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
