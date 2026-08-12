export type AdminField = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'list' | 'media';
  required?: boolean;
  options?: { label: string; value: string }[];
  accept?: string;
  placeholder?: string;
};

export type AdminResource = {
  table: string;
  label: string;
  singular: string;
  description: string;
  titleKey: string;
  subtitleKey?: string;
  mediaKey?: string;
  fields: AdminField[];
};

const publishingFields: AdminField[] = [
  { key: 'sort_order', label: 'Display order', type: 'number' },
  { key: 'is_published', label: 'Published', type: 'boolean' },
];

export const adminResources: AdminResource[] = [
  {
    table: 'gallery_items',
    label: 'Gallery',
    singular: 'gallery item',
    description: 'Manage the photographs and videos shown in the gallery.',
    titleKey: 'title',
    subtitleKey: 'category',
    mediaKey: 'source_url',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'text', required: true },
      { key: 'media_type', label: 'Media type', type: 'select', required: true, options: [{ label: 'Photo', value: 'photo' }, { label: 'Video', value: 'video' }] },
      { key: 'source_url', label: 'Photo or video', type: 'media', required: true, accept: 'image/*,video/*' },
      { key: 'poster_url', label: 'Video poster', type: 'media', accept: 'image/*' },
      { key: 'alt_text', label: 'Accessible description', type: 'text' },
      { key: 'layout', label: 'Layout', type: 'select', options: [{ label: 'Standard', value: 'standard' }, { label: 'Wide', value: 'wide' }, { label: 'Portrait', value: 'portrait' }, { label: 'Featured', value: 'featured' }] },
      ...publishingFields,
    ],
  },
  {
    table: 'services',
    label: 'Services',
    singular: 'service',
    description: 'Update service cards, package details, and inclusions.',
    titleKey: 'title',
    subtitleKey: 'slug',
    mediaKey: 'image_url',
    fields: [
      { key: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'wedding' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'summary', label: 'Card summary', type: 'textarea', required: true },
      { key: 'details', label: 'Full description', type: 'textarea' },
      { key: 'image_url', label: 'Service image', type: 'media', required: true, accept: 'image/*' },
      { key: 'inclusions', label: 'Package inclusions', type: 'list', placeholder: 'One inclusion per line' },
      ...publishingFields,
    ],
  },
  {
    table: 'occasions',
    label: 'Occasions',
    singular: 'occasion',
    description: 'Manage the Shop by Occasion cards on the home page.',
    titleKey: 'title',
    subtitleKey: 'subtitle',
    mediaKey: 'image_url',
    fields: [
      { key: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'birthdays' },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'image_url', label: 'Image or video', type: 'media', required: true, accept: 'image/*,video/*' },
      { key: 'is_video', label: 'This media is a video', type: 'boolean' },
      ...publishingFields,
    ],
  },
  {
    table: 'arrangements',
    label: 'Arrangements',
    singular: 'arrangement',
    description: 'Manage the Most Loved floral arrangements.',
    titleKey: 'name',
    subtitleKey: 'tag',
    mediaKey: 'image_url',
    fields: [
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'tag', label: 'Short description', type: 'text' },
      { key: 'image_url', label: 'Arrangement image', type: 'media', required: true, accept: 'image/*' },
      ...publishingFields,
    ],
  },
  {
    table: 'testimonials',
    label: 'Testimonials',
    singular: 'testimonial',
    description: 'Publish client quotes and story imagery.',
    titleKey: 'customer_name',
    subtitleKey: 'customer_role',
    mediaKey: 'image_url',
    fields: [
      { key: 'customer_name', label: 'Client name', type: 'text', required: true },
      { key: 'customer_role', label: 'Client role', type: 'text' },
      { key: 'quote', label: 'Quote', type: 'textarea', required: true },
      { key: 'image_url', label: 'Client story media', type: 'media', accept: 'image/*,video/*' },
      ...publishingFields,
    ],
  },
  {
    table: 'about_stories',
    label: 'About Stories',
    singular: 'story',
    description: 'Manage the real surprise stories used on the About page.',
    titleKey: 'title',
    subtitleKey: 'location',
    mediaKey: 'image_url',
    fields: [
      { key: 'title', label: 'Story title', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'image_url', label: 'Story image', type: 'media', required: true, accept: 'image/*' },
      ...publishingFields,
    ],
  },
  {
    table: 'site_sections',
    label: 'Page Sections',
    singular: 'page section',
    description: 'Edit reusable page headings, copy, calls to action, and imagery.',
    titleKey: 'title',
    subtitleKey: 'section_key',
    mediaKey: 'image_url',
    fields: [
      { key: 'page_key', label: 'Page key', type: 'text', required: true, placeholder: 'home' },
      { key: 'section_key', label: 'Section key', type: 'text', required: true, placeholder: 'hero' },
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'image_url', label: 'Section image', type: 'media', accept: 'image/*,video/*' },
      { key: 'cta_label', label: 'Primary button label', type: 'text' },
      { key: 'cta_href', label: 'Primary button link', type: 'text' },
      { key: 'secondary_cta_label', label: 'Secondary button label', type: 'text' },
      { key: 'secondary_cta_href', label: 'Secondary button link', type: 'text' },
      { key: 'is_published', label: 'Published', type: 'boolean' },
    ],
  },
  {
    table: 'journey_steps',
    label: 'Journey Steps',
    singular: 'journey step',
    description: 'Manage the steps in the Flower Zone customer journey.',
    titleKey: 'title',
    subtitleKey: 'description',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      ...publishingFields,
    ],
  },
];

export function createEmptyRecord(resource: AdminResource) {
  return Object.fromEntries(resource.fields.map((field) => {
    if (field.type === 'boolean') return [field.key, field.key === 'is_published'];
    if (field.type === 'number') return [field.key, 0];
    if (field.type === 'select') return [field.key, field.options?.[0]?.value ?? ''];
    if (field.type === 'list') return [field.key, []];
    return [field.key, ''];
  }));
}
