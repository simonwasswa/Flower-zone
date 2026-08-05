import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Images, Play, X } from 'lucide-react';
import Eyebrow from '../components/ui/Eyebrow';
import { supabase } from '../lib/supabase';
import { handleImageError, resolveMediaUrl } from '../lib/media';

type Filter = 'all' | 'photos' | 'videos';

type GalleryItem = {
  id: string;
  type: 'photo' | 'video';
  title: string;
  category: string;
  src: string;
  poster?: string;
};

// Repeats the editorial rhythm from the reference: 1+2, 3, 2+1, 1+1+1.
// On tablet the same set becomes 1+1, 2, 1+1, 1+1, 2.
const galleryPattern = [
  '',
  'md:col-span-2',
  'sm:col-span-2 md:col-span-3',
  'md:col-span-2',
  '',
  '',
  '',
  'sm:col-span-2 md:col-span-1',
];

const galleryVideoReplacements: Record<string, string> = {
  'Bouquet in the Making': 'WhatsApp Video 2026-08-04 at 10.51.47 AM.mp4',
  'Inside the Flower Studio': 'WhatsApp Video 2026-08-04 at 10.51.48 AM.mp4',
};

function isVideoFile(value: string) {
  return /\.(mp4|webm|mov)(?:[?#].*)?$/i.test(value.trim());
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const photoItems = items.filter((item) => item.type === 'photo');
  const visibleItems = items.filter((item) => {
    if (filter === 'photos') return item.type === 'photo';
    if (filter === 'videos') return item.type === 'video';
    return true;
  });

  const activeIndex = photoItems.findIndex((item) => item.id === activePhoto);

  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('id,title,category,media_type,source_url,poster_url,alt_text,layout,sort_order,updated_at')
        .eq('is_published', true)
        .order('sort_order');

      if (cancelled) return;
      if (error) {
        console.warn('Using local gallery content:', error.message);
        return;
      }
      if (!data?.length) return;

      setItems(
        data.map((row) => {
          const sourceUrl = row.media_type === 'video' && !isVideoFile(row.source_url)
            ? galleryVideoReplacements[row.title] || row.source_url
            : row.source_url;

          return {
            id: row.id,
            type: row.media_type as GalleryItem['type'],
            title: row.title,
            category: row.category,
            src: resolveMediaUrl(sourceUrl, row.updated_at),
            poster: row.poster_url
              ? resolveMediaUrl(row.poster_url, row.updated_at)
              : undefined,
          };
        }),
      );
    }

    void loadGallery();
    window.addEventListener('focus', loadGallery);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadGallery);
    };
  }, []);

  function movePhoto(direction: number) {
    if (activeIndex < 0) return;
    const nextIndex = (activeIndex + direction + photoItems.length) % photoItems.length;
    setActivePhoto(photoItems[nextIndex].id);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!activePhoto) return;
      if (event.key === 'Escape') setActivePhoto(null);
      if (event.key === 'ArrowLeft') movePhoto(-1);
      if (event.key === 'ArrowRight') movePhoto(1);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const selectedPhoto = photoItems.find((item) => item.id === activePhoto);

  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <section className="px-5 pb-12 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-20">
        <Eyebrow align="center">Moments in Bloom</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          The Flower Zone Gallery
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          Explore floral stories from intimate surprises, milestone celebrations, weddings, and the hands that bring every arrangement to life.
        </p>

        <div className="mx-auto mt-8 flex w-full max-w-sm rounded-full border border-line bg-white p-1" aria-label="Filter gallery">
          {(['all', 'photos', 'videos'] as Filter[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`${filter === option ? 'bg-rose-deep text-white' : 'text-ink-soft hover:text-rose-deep'} min-h-11 min-w-0 flex-1 rounded-full px-2 py-2.5 text-sm font-medium capitalize transition-colors sm:px-5`}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:px-12">
        {visibleItems.length === 0 ? (
          <div className="py-20 text-center text-muted">
            <Images className="mx-auto mb-4" />
            No gallery items found.
          </div>
        ) : (
          <div className="grid auto-rows-[300px] gap-3 sm:grid-cols-2 sm:auto-rows-[320px] sm:gap-4 md:grid-cols-3 md:auto-rows-[clamp(310px,40vw,560px)]">
            {visibleItems.map((item, index) => (
              <article key={item.id} className={`${galleryPattern[index % galleryPattern.length]} group relative min-h-0 overflow-hidden rounded-[16px] bg-blush-dark`}>
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    controls
                    playsInline
                    preload="metadata"
                    poster={item.poster}
                    className="h-full w-full object-cover"
                  >
                    Your browser does not support embedded video.
                  </video>
                ) : (
                  <button type="button" onClick={() => setActivePhoto(item.id)} className="block h-full w-full text-left" aria-label={`Open ${item.title}`}>
                    <img src={item.src} alt={item.title} onError={handleImageError} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </button>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-14 text-white">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">{item.category}</p>
                      <h2 className="mt-1 font-display text-xl font-semibold">{item.title}</h2>
                    </div>
                    {item.type === 'video' && <Play size={20} className="mb-1 fill-white" />}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedPhoto && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-3 pb-20 pt-16 sm:p-10" role="dialog" aria-modal="true" aria-label={selectedPhoto.title}>
          <button type="button" onClick={() => setActivePhoto(null)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close image">
            <X size={22} />
          </button>
          <button type="button" onClick={() => movePhoto(-1)} className="absolute bottom-4 left-[calc(50%_-_3.5rem)] grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:bottom-auto sm:left-6 sm:top-1/2 sm:-translate-y-1/2" aria-label="Previous image">
            <ArrowLeft size={22} />
          </button>
          <figure className="max-h-full max-w-6xl text-center">
            <img src={selectedPhoto.src} alt={selectedPhoto.title} onError={handleImageError} className="max-h-[78vh] max-w-full rounded-[8px] object-contain" />
            <figcaption className="mt-4 flex flex-col items-center gap-1 text-white sm:block">
              <span className="font-display text-lg sm:text-xl">{selectedPhoto.title}</span>
              <span className="text-xs uppercase tracking-[0.12em] text-white/55 sm:ml-3">{selectedPhoto.category}</span>
            </figcaption>
          </figure>
          <button type="button" onClick={() => movePhoto(1)} className="absolute bottom-4 right-[calc(50%_-_3.5rem)] grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:bottom-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2" aria-label="Next image">
            <ArrowRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
