import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import '@videojs/react/video/skin.css';
import { Video, VideoPlayer, VideoSkin } from '@videojs/react/video';

export type ReelVideo = {
  id: string;
  title: string;
  category: string;
  src: string;
  poster?: string;
};

const FADE_MS = 280;

function useColumns() {
  const pick = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  };
  const [columns, setColumns] = useState(pick);
  useEffect(() => {
    const onResize = () => setColumns(pick());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return columns;
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * Dark editorial video index: category filter row, small thumbnail grid,
 * hovered tile grows and plays while its neighbours dim and make room.
 */
export default function VideoReel({ videos }: { videos: ReelVideo[] }) {
  const columns = useColumns();
  const [category, setCategory] = useState('all');
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [gridKey, setGridKey] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [playing, setPlaying] = useState<ReelVideo | null>(null);
  // Width / height of the open video; our clips are mostly portrait phone videos.
  const [aspect, setAspect] = useState(9 / 16);
  const videoRefs = useRef(new Map<string, HTMLVideoElement>());

  const categories = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    for (const video of videos) {
      const key = video.category.trim().toLowerCase();
      const entry = counts.get(key) ?? { label: titleCase(video.category.trim()), count: 0 };
      entry.count += 1;
      counts.set(key, entry);
    }
    return [
      { key: 'all', label: 'All', count: videos.length },
      ...[...counts].map(([key, value]) => ({ key, ...value })),
    ];
  }, [videos]);

  const visible = videos.filter(
    (video) => category === 'all' || video.category.trim().toLowerCase() === category,
  );

  const rows: (ReelVideo | null)[][] = [];
  for (let index = 0; index < visible.length; index += columns) {
    const row: (ReelVideo | null)[] = visible.slice(index, index + columns);
    while (row.length < columns) row.push(null); // keep column widths even on the last row
    rows.push(row);
  }

  function chooseCategory(key: string) {
    if (key === category || pendingCategory) return;
    setHovered(null);
    setPendingCategory(key);
    window.setTimeout(() => {
      setCategory(key);
      setPendingCategory(null);
      setGridKey((value) => value + 1);
    }, FADE_MS);
  }

  function startPreview(video: ReelVideo) {
    setHovered(video.id);
    void videoRefs.current.get(video.id)?.play().catch(() => {});
  }

  function stopPreview(video: ReelVideo) {
    setHovered((current) => (current === video.id ? null : current));
    const element = videoRefs.current.get(video.id);
    if (element) {
      element.pause();
      element.currentTime = 0.1;
    }
  }

  useEffect(() => {
    if (!playing) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setPlaying(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing]);

  let tileNumber = 0;

  return (
    <div className="text-ink">
      <div
        className="grid gap-y-3 border-b border-line pb-4"
        style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, columns + 1)}, minmax(0, 1fr))` }}
        role="tablist"
        aria-label="Filter videos by category"
      >
        {categories.map((option) => {
          const active = (pendingCategory ?? category) === option.key;
          return (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => chooseCategory(option.key)}
              className={`${active ? 'text-rose-deep' : 'text-muted hover:text-ink'} group flex items-start justify-between pr-4 text-left text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors sm:text-[11px]`}
            >
              <span>
                {option.label}
                <sup className="ml-0.5 text-[8px] font-medium">({option.count})</sup>
              </span>
              <span aria-hidden="true" className={`transition-transform duration-500 ${active ? 'rotate-45' : 'group-hover:rotate-90'}`}>+</span>
            </button>
          );
        })}
      </div>

      <div
        key={gridKey}
        className="mt-10 flex flex-col gap-10 transition-opacity sm:mt-12 sm:gap-12"
        style={{ opacity: pendingCategory ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
      >
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-start gap-4 sm:gap-6">
            {row.map((video, cellIndex) => {
              if (!video) {
                return <div key={`spacer-${cellIndex}`} className="min-w-0" style={{ flex: '1 1 0' }} aria-hidden="true" />;
              }
              tileNumber += 1;
              const number = tileNumber;
              const isHovered = hovered === video.id;
              const dimmed = hovered !== null && !isHovered;

              return (
                <div
                  key={video.id}
                  className="reel-tile relative min-w-0"
                  style={{
                    flex: `${isHovered ? 1.9 : 1} 1 0`,
                    animationDelay: `${(number - 1) * 70}ms`,
                  }}
                >
                  <span aria-hidden="true" className="absolute -right-3 -top-3 text-xs font-light text-rose/70 sm:-right-4">+</span>
                  <button
                    type="button"
                    onMouseEnter={() => startPreview(video)}
                    onMouseLeave={() => stopPreview(video)}
                    onFocus={() => startPreview(video)}
                    onBlur={() => stopPreview(video)}
                    onClick={() => {
                      setAspect(9 / 16);
                      setPlaying(video);
                    }}
                    className={`${dimmed ? 'opacity-35' : 'opacity-100'} block w-full text-left transition-opacity duration-500`}
                    aria-label={`Play ${video.title}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-blush-dark">
                      <video
                        ref={(element) => {
                          if (element) videoRefs.current.set(video.id, element);
                          else videoRefs.current.delete(video.id);
                        }}
                        src={video.poster ? video.src : `${video.src}#t=0.1`}
                        poster={video.poster}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className={`h-full w-full object-cover transition-transform duration-[1200ms] ease-out ${isHovered ? 'scale-[1.04]' : 'scale-100'}`}
                      />
                    </div>
                    <p className="mt-2.5 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-soft sm:text-[10px]">
                      <sup className="mr-1 text-[7px] text-muted">{String(number).padStart(2, '0')}</sup>
                      {video.title}
                    </p>
                    <p
                      className={`overflow-hidden font-display font-semibold text-rose-deep transition-all duration-500 ${isHovered ? 'mt-2 max-h-16 text-lg opacity-100 sm:text-xl' : 'mt-0 max-h-0 text-sm opacity-0'}`}
                      aria-hidden={!isHovered}
                    >
                      {titleCase(video.category)}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
        {visible.length === 0 && <p className="py-16 text-center text-sm text-muted">No videos in this category yet.</p>}
      </div>

      {playing && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={playing.title}
          onClick={() => setPlaying(null)}
        >
          <button type="button" onClick={() => setPlaying(null)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close video">
            <X size={22} />
          </button>
          <figure className="flex max-h-full flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <VideoPlayer key={playing.id} poster={playing.poster}>
              <VideoSkin
                style={{
                  width: `min(92vw, calc(78vh * ${aspect}))`,
                  aspectRatio: String(aspect),
                  '--media-accent-color': '#db9899',
                  '--media-accent-text-color': '#302827',
                  '--media-border-radius': '12px',
                } as React.CSSProperties}
              >
                <Video
                  src={playing.src}
                  autoPlay
                  playsInline
                  onLoadedMetadata={(event) => {
                    const { videoWidth, videoHeight } = event.currentTarget;
                    if (videoWidth && videoHeight) setAspect(videoWidth / videoHeight);
                  }}
                />
              </VideoSkin>
            </VideoPlayer>
            <figcaption className="mt-4 text-center text-white">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">{titleCase(playing.category)}</span>
              <span className="font-display text-xl">{playing.title}</span>
            </figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </div>
  );
}
