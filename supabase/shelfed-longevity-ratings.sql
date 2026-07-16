-- Adds "shelfed by", longevity, and community ratings.
-- Run this in the Supabase SQL editor (after schema.sql / open-writes.sql).

-- ── Fragrance columns ──────────────────────────────────────────
alter table public.fragrances
  add column if not exists shelfed_by text,
  add column if not exists longevity_hours integer;

-- ── Ratings ────────────────────────────────────────────────────
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  fragrance_id text not null references public.fragrances(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  -- Reserved for auth: stamp auth.uid() on insert once accounts land,
  -- then enforce one rating per person with:
  --   alter table public.ratings add constraint one_rating_per_user
  --     unique (fragrance_id, user_id);
  user_id uuid,
  created_at timestamptz not null default now()
);

alter table public.ratings enable row level security;

drop policy if exists "Ratings are viewable by everyone" on public.ratings;
create policy "Ratings are viewable by everyone"
  on public.ratings for select
  to anon, authenticated
  using (true);

-- Open stage: anyone can rate, duplicates allowed. When auth lands,
-- restrict this to authenticated users and add the unique constraint above.
drop policy if exists "Anyone can add ratings" on public.ratings;
create policy "Anyone can add ratings"
  on public.ratings for insert
  to anon, authenticated
  with check (true);

-- ── Average + count per fragrance ──────────────────────────────
create or replace view public.fragrance_rating_summary
  with (security_invoker = true) as
select
  fragrance_id,
  avg(rating)::numeric(4, 2) as average,
  count(*)::integer as ratings_count
from public.ratings
group by fragrance_id;
