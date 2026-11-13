import { Cake, Camera, Car, Clock, Feather, Flower2, Gem, Gift, Heart, HeartHandshake, Leaf, MapPin, MessageCircleHeart, Palette, PartyPopper, Ribbon, Sparkles, Star, type LucideIcon } from 'lucide-react';
import giftBasketPhoto from '../assets/hero-gift-basket-polished.webp';
import pinkBouquetPhoto from '../assets/hero-pink-bouquet-polished.webp';
import redRosesPhoto from '../assets/hero-red-roses-polished.webp';
import weddingPhoto from '../assets/hero-wedding-polished.webp';

export type ServiceStep = { title: string; body: string };
export type ServiceHighlight = { title: string; body: string; icon: LucideIcon };
/** Each service page gets its own colours, like the per-product accent on the reference site. */
export type ServiceTheme = {
  /** Buttons, dots and highlights. */
  accent: string;
  /** Tinted panels, number badges and the closing block. */
  soft: string;
  /** Background of the alternating tinted sections. */
  band: string;
  /** Text and icons placed on the soft colour. */
  ink: string;
  /** Small icons scattered across the hero. */
  motif: LucideIcon[];
};

export type ServiceGroup = { title: string; lead: string; items: { title: string; body: string }[] };

export type Service = {
  id: string;
  title: string;
  /** Short line under the name in the Services menu and above the page headline. */
  tagline: string;
  /** One-line summary used on the service cards. */
  description: string;
  /** Longer description shown at the top of the service page. */
  details: string;
  image: string;
  includes: string[];
  /** Small pills under the hero, like the capability chips on the reference site. */
  capabilities: string[];
  steps: ServiceStep[];
  highlights: ServiceHighlight[];
  groups: ServiceGroup[];
  cta: { title: string; lead: string };
  /** Gallery categories containing one of these words show on this service's page. */
  galleryKeywords: string[];
  theme: ServiceTheme;
  className: string;
  buttonClass: string;
};

export const services: Service[] = [
  {
    id: 'birthday',
    title: 'Birthday Zone',
    tagline: 'Flowers that make their day bloom',
    description:
      'Vibrant celebrations and personalized arrangements designed to make their special day bloom with unforgettable joy.',
    details:
      'We create joyful birthday florals around the recipient’s personality, favourite colours, and celebration style. Every design is prepared fresh in our Kampala studio and can be paired with a thoughtful message.',
    image: pinkBouquetPhoto,
    includes: ['Personalised bouquet or vase arrangement', 'Custom colour and flower selection', 'Handwritten message card', 'Scheduled delivery across Kampala'],
    capabilities: ['Same-day options', 'Custom colours', 'Message cards', 'Gift add-ons', 'Kampala delivery'],
    steps: [
      { title: 'Tell us about them', body: 'Share their age, favourite colours and the feeling you want the flowers to give.' },
      { title: 'We design it fresh', body: 'Our florists build the arrangement in our Kampala studio on the day of delivery.' },
      { title: 'Add the extras', body: 'Pair the flowers with a cake, balloons, chocolates or a handwritten card.' },
      { title: 'We deliver the smile', body: 'Pick a delivery time and we bring it to their door, office or party venue.' },
    ],
    highlights: [
      {
        icon: Palette,
        title: 'Designed around their personality',
        body: 'Bold and bright, or soft and pastel. We choose every stem around the person you are celebrating.',
      },
      {
        icon: Gift,
        title: 'Flowers plus the gifts that go with them',
        body: 'Build a full birthday surprise with cakes, balloons, chocolates and keepsakes delivered together.',
      },
      {
        icon: Clock,
        title: 'Delivered when it matters',
        body: 'Schedule a morning surprise, an office delivery or a party drop-off. We confirm the timing with you.',
      },
    ],
    groups: [
      {
        title: 'Birthdays for everyone',
        lead: 'The same care, shaped around who the flowers are for.',
        items: [
          { title: 'For partners', body: 'Romantic roses and luxe arrangements for the person who matters most.' },
          { title: 'For family', body: 'Cheerful bouquets for parents, siblings and grandparents.' },
          { title: 'For friends and colleagues', body: 'Bright, fun designs that turn an ordinary office day into a celebration.' },
        ],
      },
    ],
    cta: { title: 'Plan a birthday surprise', lead: 'Tell us who it is for and when. We will handle the flowers, the extras and the delivery.' },
    galleryKeywords: ['birthday'],
    theme: { accent: '#d9694f', soft: '#fbe3da', band: '#fff6f2', ink: '#9a4330', motif: [Cake, PartyPopper, Star, Gift] },
    className: 'lg:col-span-2',
    buttonClass: 'bg-rose text-ink hover:bg-[#e9aab0]',
  },
  {
    id: 'romance',
    title: 'Romance Zone',
    tagline: 'Velvet roses for every love story',
    description:
      'The language of love spoken through velvet roses and delicate petals. Perfect for anniversaries and whispers of affection.',
    details:
      'Designed for anniversaries, proposals, and meaningful romantic gestures, this package combines expressive flowers with discreet planning for a memorable reveal.',
    image: redRosesPhoto,
    includes: ['Romantic floral arrangement', 'Personal message presentation', 'Surprise delivery coordination', 'Optional room or dinner-table styling'],
    capabilities: ['Proposals', 'Anniversaries', 'Valentine’s', 'Room styling', 'Discreet delivery'],
    steps: [
      { title: 'Share your story', body: 'Tell us the occasion, the person and any details that make it personal.' },
      { title: 'Choose the gesture', body: 'A single bouquet, a rose box, or a full room or dinner-table setup.' },
      { title: 'We plan it quietly', body: 'We coordinate timing and access so the surprise stays a surprise.' },
      { title: 'The reveal', body: 'We deliver and style everything, ready for the moment you planned.' },
    ],
    highlights: [
      {
        icon: Heart,
        title: 'Roses that say it for you',
        body: 'Deep red velvet roses, blush peonies and soft greenery arranged to carry your message.',
      },
      {
        icon: Sparkles,
        title: 'Room and table styling',
        body: 'Petal paths, candles and floral centrepieces turn a room or dinner table into the setting for your moment.',
      },
      {
        icon: MessageCircleHeart,
        title: 'Your words, beautifully presented',
        body: 'We present your message on a handwritten card or as part of the arrangement itself.',
      },
    ],
    groups: [
      {
        title: 'Made for every romantic moment',
        lead: 'From a quiet “thinking of you” to the biggest question of your life.',
        items: [
          { title: 'Proposals', body: 'Floral setups planned around the place and moment you pop the question.' },
          { title: 'Anniversaries', body: 'Arrangements that celebrate the years you have shared together.' },
          { title: 'Just because', body: 'A spontaneous bouquet to remind them they are loved.' },
        ],
      },
    ],
    cta: { title: 'Plan a romantic gesture', lead: 'Tell us about your moment. We will keep it discreet and make it unforgettable.' },
    galleryKeywords: ['romance', 'romantic', 'valentine', 'proposal', 'anniversary'],
    theme: { accent: '#9b2c3e', soft: '#f6dde1', band: '#fdf3f4', ink: '#761f2f', motif: [Heart, Sparkles, Heart, Flower2] },
    className: '',
    buttonClass: 'bg-wine text-white hover:bg-wine-deep',
  },
  {
    id: 'wedding',
    title: 'Wedding Zone',
    tagline: 'Bridal flowers and venue styling',
    description:
      'Bridal bouquets and venue styling that turn your forever promise into a living botanical masterpiece.',
    details:
      'Our wedding service brings a consistent floral story to every part of your day, from personal flowers to ceremony and reception styling.',
    image: weddingPhoto,
    includes: ['Bride and bridal-party bouquets', 'Buttonholes and corsages', 'Ceremony and reception florals', 'Venue setup and floral styling'],
    capabilities: ['Bridal bouquets', 'Bridal party', 'Ceremony décor', 'Reception styling', 'Car décor', 'Introductions'],
    steps: [
      { title: 'Consultation', body: 'We meet to understand your theme, colours, venue and budget.' },
      { title: 'Design proposal', body: 'We share a floral plan covering personal flowers, ceremony and reception.' },
      { title: 'Preparation', body: 'Flowers are sourced and prepared fresh in the days before your wedding.' },
      { title: 'Setup on the day', body: 'Our team delivers, installs and styles everything at your venue.' },
    ],
    highlights: [
      {
        icon: Gem,
        title: 'Personal flowers for the bridal party',
        body: 'Bouquets, buttonholes, corsages and flower-girl baskets designed as one matching set.',
      },
      {
        icon: Flower2,
        title: 'Ceremony and reception florals',
        body: 'Aisle arrangements, arches, head-table runners and centrepieces that carry one floral story.',
      },
      {
        icon: Car,
        title: 'Car décor and introduction ceremonies',
        body: 'We style wedding cars and traditional introduction (kwanjula) venues to match your day.',
      },
    ],
    groups: [
      {
        title: 'Packages for every wedding',
        lead: 'Start with what you need. We scale the design to your guest list and venue.',
        items: [
          { title: 'Intimate', body: 'Bridal bouquet, buttonholes and a few statement arrangements for smaller ceremonies.' },
          { title: 'Classic', body: 'Full bridal party flowers plus ceremony and reception styling.' },
          { title: 'Grand', body: 'Complete venue transformation with arches, installations and car décor.' },
        ],
      },
    ],
    cta: { title: 'Book a wedding consultation', lead: 'Share your date and venue. We will propose a floral plan around your vision.' },
    galleryKeywords: ['wedding', 'bridal', 'introduction', 'kwanjula'],
    theme: { accent: '#a8834e', soft: '#f2e9d8', band: '#fbf8f1', ink: '#715730', motif: [Gem, Sparkles, Flower2, Star] },
    className: '',
    buttonClass: 'bg-petal text-rose-deep hover:bg-blush',
  },
  {
    id: 'sympathy',
    title: 'Sympathy Zone',
    tagline: 'Graceful tributes and remembrance',
    description:
      'Graceful tributes and floral arrangements that offer a silent, beautiful embrace during times of loss and remembrance.',
    details:
      'Created with sensitivity and care, our tribute arrangements help families express remembrance, comfort, and respect through flowers.',
    // No sympathy photo yet: add one in the admin dashboard rather than reusing another service's photo.
    image: '',
    includes: ['Wreaths, sprays, or casket flowers', 'Family colour and flower preferences', 'Message ribbon or sympathy card', 'Timely delivery to the selected venue'],
    capabilities: ['Wreaths', 'Casket sprays', 'Standing tributes', 'Sympathy bouquets', 'Venue delivery'],
    steps: [
      { title: 'Reach out', body: 'Call or message us. We will guide you gently through the options.' },
      { title: 'Choose the tribute', body: 'Select a wreath, spray, standing tribute or home bouquet.' },
      { title: 'Add your words', body: 'We print your message on a ribbon or write it on a sympathy card.' },
      { title: 'Delivered on time', body: 'We deliver to the home, church or venue at the time you need.' },
    ],
    highlights: [
      {
        icon: Feather,
        title: 'Tributes made with care',
        body: 'White lilies, roses and soft greenery arranged with quiet dignity and respect.',
      },
      {
        icon: Ribbon,
        title: 'Your message on a ribbon',
        body: 'A printed ribbon or handwritten card carries your words of comfort and remembrance.',
      },
      {
        icon: MapPin,
        title: 'Punctual venue delivery',
        body: 'We coordinate with the family or venue so tributes arrive before the service begins.',
      },
    ],
    groups: [
      {
        title: 'Ways to show you care',
        lead: 'Flowers for the service and for the family at home.',
        items: [
          { title: 'Funeral tributes', body: 'Wreaths, casket sprays and standing arrangements for the service.' },
          { title: 'Sympathy at home', body: 'Gentle bouquets and baskets sent to comfort the family.' },
          { title: 'Remembrance', body: 'Anniversary and memorial flowers to honour a loved one.' },
        ],
      },
    ],
    cta: { title: 'Send a tribute', lead: 'We are here to help. Tell us the venue and time, and we will take care of the rest.' },
    galleryKeywords: ['sympathy', 'funeral', 'tribute', 'memorial'],
    theme: { accent: '#6f6480', soft: '#e9e5ef', band: '#f7f5f9', ink: '#4f4560', motif: [Feather, Leaf, Feather, Flower2] },
    className: '',
    buttonClass: 'bg-mauve text-white hover:bg-[#674a52]',
  },
  {
    id: 'surprise',
    title: 'Surprise Zone',
    tagline: '“Just because” moments of delight',
    description:
      'Eclectic “Just Because” arrangements designed to deliver a spontaneous moment of pure, unadulterated delight.',
    details:
      'For moments that deserve an unexpected burst of happiness, we plan the flowers, presentation, and timing around the person you want to celebrate.',
    image: giftBasketPhoto,
    includes: ['Bespoke surprise arrangement', 'Gift and message coordination', 'Discreet delivery planning', 'Optional reveal setup and photography'],
    capabilities: ['Gift baskets', 'Secret delivery', 'Reveal setups', 'Photography', 'Corporate gifts'],
    steps: [
      { title: 'Tell us the plan', body: 'Who are we surprising, where and when? Share as much or as little as you like.' },
      { title: 'We build the surprise', body: 'Flowers, gifts and a message combined into one bespoke package.' },
      { title: 'Secret coordination', body: 'We plan access and timing quietly so nothing gives it away.' },
      { title: 'Capture the moment', body: 'Optional photography so you can see their reaction.' },
    ],
    highlights: [
      {
        icon: PartyPopper,
        title: 'Surprises with no reason needed',
        body: 'Brighten a normal day with an unexpected arrangement that says “I was thinking of you”.',
      },
      {
        icon: Camera,
        title: 'See their reaction',
        body: 'Add a reveal setup and photography so you can share in the moment, even from far away.',
      },
      {
        icon: HeartHandshake,
        title: 'Corporate and client gifting',
        body: 'Thank clients and celebrate teams with branded flower and gift deliveries.',
      },
    ],
    groups: [
      {
        title: 'Surprise ideas',
        lead: 'A few places to start. Every surprise is built around the person.',
        items: [
          { title: 'Get well soon', body: 'Bright, uplifting flowers to lift spirits at home or in hospital.' },
          { title: 'Congratulations', body: 'Celebrate a new job, graduation, new baby or new home.' },
          { title: 'Thank you', body: 'Show appreciation to friends, family, clients and colleagues.' },
        ],
      },
    ],
    cta: { title: 'Plan a surprise', lead: 'Tell us who you want to surprise. We will plan the flowers, the gift and the perfect timing.' },
    galleryKeywords: ['surprise'],
    theme: { accent: '#cf3f78', soft: '#fadbe7', band: '#fff3f8', ink: '#9c2556', motif: [Sparkles, Gift, PartyPopper, Star] },
    className: '',
    buttonClass: 'bg-[#e88f98] text-ink hover:bg-[#f0a9af]',
  },
];

/** Used for services added through the admin dashboard that have no local page content yet. */
export const defaultTheme: ServiceTheme = { accent: '#a75f60', soft: '#f8ecea', band: '#fdf5f3', ink: '#7e4146', motif: [Flower2, Leaf, Sparkles, Flower2] };

export const defaultSteps: ServiceStep[] = [
  { title: 'Tell us your moment', body: 'Share the occasion, the recipient and the feeling you want the flowers to give.' },
  { title: 'We design it fresh', body: 'Our florists prepare your arrangement in our Kampala studio.' },
  { title: 'We deliver the smile', body: 'We schedule delivery across Kampala at a time that suits you.' },
];
