import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Check, Eye, EyeOff, LoaderCircle, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { resolveMediaUrl } from '../lib/media';
import { supabase } from '../lib/supabase';
import { createEmptyRecord, type AdminField, type AdminResource } from './config';

type AdminRecord = Record<string, unknown> & { id?: string | number };

type ResourceManagerProps = {
  resource: AdminResource;
  onChanged: () => void;
};

const inputClass = 'mt-2 w-full rounded-xl border border-[#e7d9d7] bg-white px-3.5 py-3 text-sm text-[#302827] outline-none transition focus:border-[#a75f60] focus:ring-2 focus:ring-[#a75f60]/15';

function isVideo(value: string) {
  return /\.(mp4|webm|mov)(?:[?#].*)?$/i.test(value);
}

function getDisplayValue(record: AdminRecord, key?: string) {
  if (!key) return '';
  const value = record[key];
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

function normalizePayload(resource: AdminResource, record: AdminRecord) {
  return Object.fromEntries(resource.fields.map((field) => {
    const value = record[field.key];
    if (field.type === 'number') return [field.key, Number(value) || 0];
    if (field.type === 'boolean') return [field.key, Boolean(value)];
    if (field.type === 'list') {
      if (Array.isArray(value)) return [field.key, value.map(String).map((item) => item.trim()).filter(Boolean)];
      return [field.key, String(value ?? '').split('\n').map((item) => item.trim()).filter(Boolean)];
    }
    return [field.key, typeof value === 'string' ? value.trim() || null : value ?? null];
  }));
}

export default function ResourceManager({ resource, onChanged }: ResourceManagerProps) {
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState('');
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hasSortOrder = useMemo(
    () => resource.fields.some((field) => field.key === 'sort_order'),
    [resource],
  );

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    let query = supabase.from(resource.table).select('*');
    if (hasSortOrder) query = query.order('sort_order');
    const { data, error: queryError } = await query;
    if (queryError) setError(queryError.message);
    setRecords((data ?? []) as AdminRecord[]);
    setLoading(false);
  }, [hasSortOrder, resource.table]);

  useEffect(() => {
    setEditing(null);
    setSuccess('');
    void loadRecords();
  }, [loadRecords]);

  function startCreate() {
    setError('');
    setSuccess('');
    setEditing(createEmptyRecord(resource));
  }

  function updateField(key: string, value: unknown) {
    setEditing((current) => current ? { ...current, [key]: value } : current);
  }

  async function uploadMedia(field: AdminField, file?: File) {
    if (!file) return;
    setError('');
    setUploadingField(field.key);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
    const path = `${resource.table}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from('media').upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) {
      setError(uploadError.message);
    } else {
      updateField(field.key, path);
    }
    setUploadingField('');
  }

  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    setSuccess('');
    const payload = normalizePayload(resource, editing);
    const request = editing.id === undefined
      ? supabase.from(resource.table).insert(payload)
      : supabase.from(resource.table).update(payload).eq('id', editing.id);
    const { error: saveError } = await request;
    if (saveError) {
      setError(saveError.message);
    } else {
      setEditing(null);
      setSuccess(`${resource.singular[0].toUpperCase()}${resource.singular.slice(1)} saved.`);
      await loadRecords();
      onChanged();
    }
    setSaving(false);
  }

  async function togglePublished(record: AdminRecord) {
    if (record.id === undefined) return;
    const nextValue = !record.is_published;
    const { error: updateError } = await supabase
      .from(resource.table)
      .update({ is_published: nextValue })
      .eq('id', record.id);
    if (updateError) setError(updateError.message);
    else {
      setRecords((current) => current.map((item) => item.id === record.id ? { ...item, is_published: nextValue } : item));
      onChanged();
    }
  }

  async function deleteRecord(record: AdminRecord) {
    if (record.id === undefined) return;
    const title = getDisplayValue(record, resource.titleKey) || resource.singular;
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from(resource.table).delete().eq('id', record.id);
    if (deleteError) setError(deleteError.message);
    else {
      setRecords((current) => current.filter((item) => item.id !== record.id));
      onChanged();
    }
  }

  function renderField(field: AdminField) {
    if (!editing) return null;
    const rawValue = editing[field.key];

    if (field.type === 'boolean') {
      return (
        <label key={field.key} className="flex items-center justify-between gap-4 rounded-xl border border-[#e7d9d7] bg-[#fffaf8] px-4 py-3 text-sm font-medium text-[#514543]">
          {field.label}
          <input
            type="checkbox"
            checked={Boolean(rawValue)}
            onChange={(event) => updateField(field.key, event.target.checked)}
            className="h-5 w-5 accent-[#a75f60]"
          />
        </label>
      );
    }

    if (field.type === 'media') {
      const value = typeof rawValue === 'string' ? rawValue : '';
      const previewUrl = resolveMediaUrl(value);
      return (
        <div key={field.key} className="sm:col-span-2">
          <label className="text-sm font-medium text-[#514543]">
            {field.label}{field.required ? ' *' : ''}
            <input
              value={value}
              required={field.required}
              onChange={(event) => updateField(field.key, event.target.value)}
              className={inputClass}
              placeholder="Upload a file or paste a URL/path"
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[#f3e5e4] px-4 py-2 text-sm font-semibold text-[#925255] hover:bg-[#ead6d5]">
              {uploadingField === field.key ? <LoaderCircle size={17} className="animate-spin" /> : <Upload size={17} />}
              {uploadingField === field.key ? 'Uploading…' : 'Choose file'}
              <input
                type="file"
                accept={field.accept}
                className="sr-only"
                disabled={uploadingField !== ''}
                onChange={(event) => void uploadMedia(field, event.target.files?.[0])}
              />
            </label>
            {previewUrl && (
              <div className="h-20 w-28 overflow-hidden rounded-lg border border-[#e7d9d7] bg-[#f7eeee]">
                {isVideo(value) ? (
                  <video src={previewUrl} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={previewUrl} alt="Media preview" className="h-full w-full object-cover" />
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    const stringValue = field.type === 'list'
      ? (Array.isArray(rawValue) ? rawValue.join('\n') : String(rawValue ?? ''))
      : String(rawValue ?? '');

    return (
      <label key={field.key} className={`${field.type === 'textarea' || field.type === 'list' ? 'sm:col-span-2' : ''} text-sm font-medium text-[#514543]`}>
        {field.label}{field.required ? ' *' : ''}
        {field.type === 'textarea' || field.type === 'list' ? (
          <textarea
            value={stringValue}
            required={field.required}
            rows={field.type === 'list' ? 5 : 4}
            onChange={(event) => updateField(field.key, event.target.value)}
            className={`${inputClass} resize-y`}
            placeholder={field.placeholder}
          />
        ) : field.type === 'select' ? (
          <select value={stringValue} required={field.required} onChange={(event) => updateField(field.key, event.target.value)} className={inputClass}>
            {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        ) : (
          <input
            type={field.type === 'number' ? 'number' : 'text'}
            value={stringValue}
            required={field.required}
            onChange={(event) => updateField(field.key, field.type === 'number' ? Number(event.target.value) : event.target.value)}
            className={inputClass}
            placeholder={field.placeholder}
          />
        )}
      </label>
    );
  }

  return (
    <section>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#a75f60]">Content manager</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-[#302827] sm:text-4xl">{resource.label}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#796b68]">{resource.description}</p>
        </div>
        <button type="button" onClick={startCreate} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#9d5558] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#87474a]">
          <Plus size={17} /> Add {resource.singular}
        </button>
      </div>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</div>}
      {success && <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><Check size={17} />{success}</div>}

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#e7d9d7] bg-white shadow-sm">
        {loading ? (
          <div className="grid min-h-64 place-items-center text-[#a75f60]"><LoaderCircle className="animate-spin" /></div>
        ) : records.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-xl text-[#302827]">No {resource.label.toLowerCase()} yet</p>
            <p className="mt-2 text-sm text-[#8b7d7a]">Add the first {resource.singular} to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#eee3e1]">
            {records.map((record, index) => {
              const title = getDisplayValue(record, resource.titleKey) || `Untitled ${resource.singular}`;
              const subtitle = getDisplayValue(record, resource.subtitleKey);
              const mediaValue = resource.mediaKey ? getDisplayValue(record, resource.mediaKey) : '';
              const mediaUrl = resolveMediaUrl(mediaValue);
              return (
                <article key={String(record.id ?? index)} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:px-5">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="grid h-16 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#f4e8e6] text-sm font-semibold text-[#a75f60]">
                      {mediaUrl ? (
                        isVideo(mediaValue) ? <video src={mediaUrl} className="h-full w-full object-cover" muted /> : <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
                      ) : String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-[#302827]">{title}</h2>
                      {subtitle && <p className="mt-1 line-clamp-1 text-sm text-[#8b7d7a]">{subtitle}</p>}
                      <span className={`${record.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'} mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold`}>
                        {record.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    {Object.hasOwn(record, 'is_published') && (
                      <button type="button" onClick={() => void togglePublished(record)} title={record.is_published ? 'Unpublish' : 'Publish'} className="grid h-10 w-10 place-items-center rounded-full text-[#756765] hover:bg-[#f5e8e7] hover:text-[#9d5558]">
                        {record.is_published ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    )}
                    <button type="button" onClick={() => { setError(''); setSuccess(''); setEditing({ ...record }); }} title="Edit" className="grid h-10 w-10 place-items-center rounded-full text-[#756765] hover:bg-[#f5e8e7] hover:text-[#9d5558]"><Pencil size={17} /></button>
                    <button type="button" onClick={() => void deleteRecord(record)} title="Delete" className="grid h-10 w-10 place-items-center rounded-full text-[#756765] hover:bg-red-50 hover:text-red-700"><Trash2 size={17} /></button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#231d1c]/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="editor-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
          <div className="max-h-[95dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-[#fffaf8] shadow-2xl sm:max-h-[92vh] sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfdd] bg-[#fffaf8]/95 px-5 py-4 backdrop-blur sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a75f60]">{editing.id === undefined ? 'Create' : 'Edit'}</p>
                <h2 id="editor-title" className="mt-1 font-display text-2xl font-semibold text-[#302827]">{resource.singular[0].toUpperCase()}{resource.singular.slice(1)}</h2>
              </div>
              <button type="button" onClick={() => setEditing(null)} className="grid h-10 w-10 place-items-center rounded-full text-[#665b59] hover:bg-[#f2e5e3]" aria-label="Close editor"><X size={20} /></button>
            </div>
            <form onSubmit={(event) => void saveRecord(event)} className="p-5 sm:p-7">
              <div className="grid gap-5 sm:grid-cols-2">{resource.fields.map(renderField)}</div>
              {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#eadfdd] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setEditing(null)} className="min-h-11 rounded-full border border-[#d8c6c3] px-5 text-sm font-semibold text-[#665b59] hover:bg-white">Cancel</button>
                <button type="submit" disabled={saving || Boolean(uploadingField)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#9d5558] px-6 text-sm font-semibold text-white hover:bg-[#87474a] disabled:cursor-wait disabled:opacity-60">
                  {saving && <LoaderCircle size={17} className="animate-spin" />}{saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
