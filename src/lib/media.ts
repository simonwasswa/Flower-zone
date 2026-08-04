import { supabase } from './supabase';

export function resolveMediaUrl(value: string | null | undefined, version?: string | number) {
  if (!value?.trim()) return '';

  const trimmed = value.trim();
  const baseUrl = /^(https?:|data:|blob:|\/)/i.test(trimmed)
    ? trimmed
    : supabase.storage.from('media').getPublicUrl(trimmed).data.publicUrl;

  if (!version || baseUrl.startsWith('data:') || baseUrl.startsWith('blob:')) return baseUrl;

  try {
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set('fzv', String(version));
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
) {
  const image = event.currentTarget;
  image.onerror = null;
  image.hidden = true;
}
