export interface Occasion {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export const occasions: Occasion[] = [
  {
    id: 'birthdays',
    title: 'Birthdays',
    subtitle: 'Celebrate Joy',
    image: '',
  },
  {
    id: 'valentines',
    title: "Valentine's",
    subtitle: 'Romance Redefined',
    image: '',
  },
  {
    id: 'weddings',
    title: 'Weddings',
    subtitle: 'Timeless Vows',
    image: '',
  },
  {
    id: 'burials',
    title: 'Burials',
    subtitle: 'Respect & Grace',
    image: '',
  },
  {
    id: 'surprises',
    title: 'Surprises',
    subtitle: 'Magical Moments',
    image: '',
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'The surprise delivery for my anniversary was beyond words. The arrangement was a masterpiece, and the joy on my partner\u2019s face was priceless. Thank you, Flower Zone!',
    name: 'James O.',
    role: 'Anniversary Client',
  },
  {
    id: 't2',
    quote:
      'They handled our wedding florals with such care and professionalism. Every detail matched our vision perfectly. Truly the best in the business.',
    name: 'Sarah C.',
    role: 'Wedding Client',
  },
];

export interface Product {
  id: string;
  name: string;
  tag: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: 'anniversary-heart',
    name: 'The Anniversary Heart',
    tag: 'Premium Red Rose Box',
    price: 120,
    image: '',
  },
  {
    id: 'bridal-glow',
    name: 'Bridal Glow',
    tag: 'Peonies & Lace',
    price: 150,
    image: '',
  },
  {
    id: 'tribute-wreath',
    name: 'Tribute Wreath',
    tag: 'Lilies & Ferns',
    price: 110,
    image: '',
  },
  {
    id: 'birthday-brights',
    name: 'Birthday Brights',
    tag: 'Sunflower & Joy',
    price: 85,
    image: '',
  },
];

export const stats = [
  { value: '5k+', label: 'Events Managed' },
  { value: '100%', label: 'Premium Grade' },
  { value: '24/7', label: 'Surprise Team' },
];

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact' },
];

export const footerColumns = [
  {
    title: 'Occasions',
    links: ['Luxury Weddings', 'Romantic Surprises', 'Sympathy Tributes', 'Corporate Galas'],
  },
  {
    title: 'Concierge',
    links: ['Priority Delivery', 'Event Styling', 'Bespoke Requests', 'Corporate Accounts'],
  },
  {
    title: 'Connect',
    links: ['Flower Zone Studio', 'Kira Road, Kamwokya, Kampala'],
  },
];
