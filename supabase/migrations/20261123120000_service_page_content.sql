-- Service pages: move the rich page content (tagline, pills, steps, highlight rows,
-- check-list groups, closing call to action) from src/data/services.ts into the database
-- so it can be edited from the admin dashboard. Safe to run more than once.

alter table public.services
  add column if not exists tagline text,
  add column if not exists capabilities text[] not null default '{}',
  -- One step per entry, written "Title: description".
  add column if not exists steps text[] not null default '{}',
  add column if not exists cta_title text,
  add column if not exists cta_lead text;

-- Picture-and-text rows on each service page.
create table if not exists public.service_highlights (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null,
  title text not null,
  body text not null,
  image_url text,
  icon text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Heading + check-list sections on each service page.
create table if not exists public.service_groups (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null,
  title text not null,
  lead text,
  -- One item per entry, written "Title: description".
  items text[] not null default '{}',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_highlights_slug_idx on public.service_highlights (service_slug, sort_order);
create index if not exists service_groups_slug_idx on public.service_groups (service_slug, sort_order);

-- Same access rules as the other content tables: the public reads published rows,
-- only the Flower Zone admin can change anything.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['service_highlights', 'service_groups']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('grant select on table public.%I to anon, authenticated', table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);

    execute format('drop policy if exists "Published rows are public" on public.%I', table_name);
    execute format('create policy "Published rows are public" on public.%I for select to anon, authenticated using (is_published = true)', table_name);

    execute format('drop policy if exists "Flower Zone admin can view all" on public.%I', table_name);
    execute format('create policy "Flower Zone admin can view all" on public.%I for select to authenticated using ((select public.is_flower_zone_admin()))', table_name);

    execute format('drop policy if exists "Flower Zone admin can create" on public.%I', table_name);
    execute format('create policy "Flower Zone admin can create" on public.%I for insert to authenticated with check ((select public.is_flower_zone_admin()))', table_name);

    execute format('drop policy if exists "Flower Zone admin can update" on public.%I', table_name);
    execute format('create policy "Flower Zone admin can update" on public.%I for update to authenticated using ((select public.is_flower_zone_admin())) with check ((select public.is_flower_zone_admin()))', table_name);

    execute format('drop policy if exists "Flower Zone admin can delete" on public.%I', table_name);
    execute format('create policy "Flower Zone admin can delete" on public.%I for delete to authenticated using ((select public.is_flower_zone_admin()))', table_name);
  end loop;
end
$$;

-- Seed with the content the pages show today (only fills empty fields / missing rows).
update public.services set tagline = 'Flowers that make their day bloom', capabilities = array['Same-day options', 'Custom colours', 'Message cards', 'Gift add-ons', 'Kampala delivery']::text[], steps = array['Tell us about them: Share their age, favourite colours and the feeling you want the flowers to give.', 'We design it fresh: Our florists build the arrangement in our Kampala studio on the day of delivery.', 'Add the extras: Pair the flowers with a cake, balloons, chocolates or a handwritten card.', 'We deliver the smile: Pick a delivery time and we bring it to their door, office or party venue.']::text[], cta_title = 'Plan a birthday surprise', cta_lead = 'Tell us who it is for and when. We will handle the flowers, the extras and the delivery.' where slug = 'birthday' and tagline is null;
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'birthday', 'Designed around their personality', 'Bold and bright, or soft and pastel. We choose every stem around the person you are celebrating.', 'Palette', null, 10 where not exists (select 1 from public.service_highlights where service_slug = 'birthday' and title = 'Designed around their personality');
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'birthday', 'Flowers plus the gifts that go with them', 'Build a full birthday surprise with cakes, balloons, chocolates and keepsakes delivered together.', 'Gift', null, 20 where not exists (select 1 from public.service_highlights where service_slug = 'birthday' and title = 'Flowers plus the gifts that go with them');
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'birthday', 'Delivered when it matters', 'Schedule a morning surprise, an office delivery or a party drop-off. We confirm the timing with you.', 'Clock', null, 30 where not exists (select 1 from public.service_highlights where service_slug = 'birthday' and title = 'Delivered when it matters');
insert into public.service_groups (service_slug, title, lead, items, sort_order) select 'birthday', 'Birthdays for everyone', 'The same care, shaped around who the flowers are for.', array['For partners: Romantic roses and luxe arrangements for the person who matters most.', 'For family: Cheerful bouquets for parents, siblings and grandparents.', 'For friends and colleagues: Bright, fun designs that turn an ordinary office day into a celebration.']::text[], 10 where not exists (select 1 from public.service_groups where service_slug = 'birthday' and title = 'Birthdays for everyone');
update public.services set tagline = 'Velvet roses for every love story', capabilities = array['Proposals', 'Anniversaries', 'Valentine’s', 'Room styling', 'Discreet delivery']::text[], steps = array['Share your story: Tell us the occasion, the person and any details that make it personal.', 'Choose the gesture: A single bouquet, a rose box, or a full room or dinner-table setup.', 'We plan it quietly: We coordinate timing and access so the surprise stays a surprise.', 'The reveal: We deliver and style everything, ready for the moment you planned.']::text[], cta_title = 'Plan a romantic gesture', cta_lead = 'Tell us about your moment. We will keep it discreet and make it unforgettable.' where slug = 'romance' and tagline is null;
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'romance', 'Roses that say it for you', 'Deep red velvet roses, blush peonies and soft greenery arranged to carry your message.', 'Heart', 'pro7.jpeg', 10 where not exists (select 1 from public.service_highlights where service_slug = 'romance' and title = 'Roses that say it for you');
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'romance', 'Room and table styling', 'Petal paths, candles and floral centrepieces turn a room or dinner table into the setting for your moment.', 'Sparkles', null, 20 where not exists (select 1 from public.service_highlights where service_slug = 'romance' and title = 'Room and table styling');
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'romance', 'Your words, beautifully presented', 'We present your message on a handwritten card or as part of the arrangement itself.', 'MessageCircleHeart', null, 30 where not exists (select 1 from public.service_highlights where service_slug = 'romance' and title = 'Your words, beautifully presented');
insert into public.service_groups (service_slug, title, lead, items, sort_order) select 'romance', 'Made for every romantic moment', 'From a quiet “thinking of you” to the biggest question of your life.', array['Proposals: Floral setups planned around the place and moment you pop the question.', 'Anniversaries: Arrangements that celebrate the years you have shared together.', 'Just because: A spontaneous bouquet to remind them they are loved.']::text[], 10 where not exists (select 1 from public.service_groups where service_slug = 'romance' and title = 'Made for every romantic moment');
update public.services set tagline = 'Bridal flowers and venue styling', capabilities = array['Bridal bouquets', 'Bridal party', 'Ceremony décor', 'Reception styling', 'Car décor', 'Introductions']::text[], steps = array['Consultation: We meet to understand your theme, colours, venue and budget.', 'Design proposal: We share a floral plan covering personal flowers, ceremony and reception.', 'Preparation: Flowers are sourced and prepared fresh in the days before your wedding.', 'Setup on the day: Our team delivers, installs and styles everything at your venue.']::text[], cta_title = 'Book a wedding consultation', cta_lead = 'Share your date and venue. We will propose a floral plan around your vision.' where slug = 'wedding' and tagline is null;
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'wedding', 'Personal flowers for the bridal party', 'Bouquets, buttonholes, corsages and flower-girl baskets designed as one matching set.', 'Gem', 'pro4.jpeg', 10 where not exists (select 1 from public.service_highlights where service_slug = 'wedding' and title = 'Personal flowers for the bridal party');
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'wedding', 'Ceremony and reception florals', 'Aisle arrangements, arches, head-table runners and centrepieces that carry one floral story.', 'Flower2', null, 20 where not exists (select 1 from public.service_highlights where service_slug = 'wedding' and title = 'Ceremony and reception florals');
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'wedding', 'Car décor and introduction ceremonies', 'We style wedding cars and traditional introduction (kwanjula) venues to match your day.', 'Car', null, 30 where not exists (select 1 from public.service_highlights where service_slug = 'wedding' and title = 'Car décor and introduction ceremonies');
insert into public.service_groups (service_slug, title, lead, items, sort_order) select 'wedding', 'Packages for every wedding', 'Start with what you need. We scale the design to your guest list and venue.', array['Intimate: Bridal bouquet, buttonholes and a few statement arrangements for smaller ceremonies.', 'Classic: Full bridal party flowers plus ceremony and reception styling.', 'Grand: Complete venue transformation with arches, installations and car décor.']::text[], 10 where not exists (select 1 from public.service_groups where service_slug = 'wedding' and title = 'Packages for every wedding');
update public.services set tagline = 'Graceful tributes and remembrance', capabilities = array['Wreaths', 'Casket sprays', 'Standing tributes', 'Sympathy bouquets', 'Venue delivery']::text[], steps = array['Reach out: Call or message us. We will guide you gently through the options.', 'Choose the tribute: Select a wreath, spray, standing tribute or home bouquet.', 'Add your words: We print your message on a ribbon or write it on a sympathy card.', 'Delivered on time: We deliver to the home, church or venue at the time you need.']::text[], cta_title = 'Send a tribute', cta_lead = 'We are here to help. Tell us the venue and time, and we will take care of the rest.' where slug = 'sympathy' and tagline is null;
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'sympathy', 'Tributes made with care', 'White lilies, roses and soft greenery arranged with quiet dignity and respect.', 'Feather', null, 10 where not exists (select 1 from public.service_highlights where service_slug = 'sympathy' and title = 'Tributes made with care');
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'sympathy', 'Your message on a ribbon', 'A printed ribbon or handwritten card carries your words of comfort and remembrance.', 'Ribbon', null, 20 where not exists (select 1 from public.service_highlights where service_slug = 'sympathy' and title = 'Your message on a ribbon');
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'sympathy', 'Punctual venue delivery', 'We coordinate with the family or venue so tributes arrive before the service begins.', 'MapPin', null, 30 where not exists (select 1 from public.service_highlights where service_slug = 'sympathy' and title = 'Punctual venue delivery');
insert into public.service_groups (service_slug, title, lead, items, sort_order) select 'sympathy', 'Ways to show you care', 'Flowers for the service and for the family at home.', array['Funeral tributes: Wreaths, casket sprays and standing arrangements for the service.', 'Sympathy at home: Gentle bouquets and baskets sent to comfort the family.', 'Remembrance: Anniversary and memorial flowers to honour a loved one.']::text[], 10 where not exists (select 1 from public.service_groups where service_slug = 'sympathy' and title = 'Ways to show you care');
update public.services set tagline = '“Just because” moments of delight', capabilities = array['Gift baskets', 'Secret delivery', 'Reveal setups', 'Photography', 'Corporate gifts']::text[], steps = array['Tell us the plan: Who are we surprising, where and when? Share as much or as little as you like.', 'We build the surprise: Flowers, gifts and a message combined into one bespoke package.', 'Secret coordination: We plan access and timing quietly so nothing gives it away.', 'Capture the moment: Optional photography so you can see their reaction.']::text[], cta_title = 'Plan a surprise', cta_lead = 'Tell us who you want to surprise. We will plan the flowers, the gift and the perfect timing.' where slug = 'surprise' and tagline is null;
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'surprise', 'Surprises with no reason needed', 'Brighten a normal day with an unexpected arrangement that says “I was thinking of you”.', 'PartyPopper', null, 10 where not exists (select 1 from public.service_highlights where service_slug = 'surprise' and title = 'Surprises with no reason needed');
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'surprise', 'See their reaction', 'Add a reveal setup and photography so you can share in the moment, even from far away.', 'Camera', null, 20 where not exists (select 1 from public.service_highlights where service_slug = 'surprise' and title = 'See their reaction');
insert into public.service_highlights (service_slug, title, body, icon, image_url, sort_order) select 'surprise', 'Corporate and client gifting', 'Thank clients and celebrate teams with branded flower and gift deliveries.', 'HeartHandshake', null, 30 where not exists (select 1 from public.service_highlights where service_slug = 'surprise' and title = 'Corporate and client gifting');
insert into public.service_groups (service_slug, title, lead, items, sort_order) select 'surprise', 'Surprise ideas', 'A few places to start. Every surprise is built around the person.', array['Get well soon: Bright, uplifting flowers to lift spirits at home or in hospital.', 'Congratulations: Celebrate a new job, graduation, new baby or new home.', 'Thank you: Show appreciation to friends, family, clients and colleagues.']::text[], 10 where not exists (select 1 from public.service_groups where service_slug = 'surprise' and title = 'Surprise ideas');
