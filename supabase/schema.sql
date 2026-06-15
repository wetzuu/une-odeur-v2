-- Run this in the Supabase SQL editor to align the `fragrances` table
-- with what src/lib/fragranceService.js expects.

create table if not exists public.fragrances (
  id text primary key,
  name text not null,
  brand text not null,
  image text not null,
  tags text[] not null default '{}',
  description text not null default '',
  created_at timestamptz not null default now()
);

-- If the table already exists with a different shape, align it:
alter table public.fragrances
  add column if not exists id text,
  add column if not exists name text,
  add column if not exists brand text,
  add column if not exists image text,
  add column if not exists tags text[] default '{}',
  add column if not exists description text default '',
  add column if not exists created_at timestamptz default now();

-- Public read access (anon key), writes restricted to authenticated users.
alter table public.fragrances enable row level security;

drop policy if exists "Fragrances are viewable by everyone" on public.fragrances;
create policy "Fragrances are viewable by everyone"
  on public.fragrances for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can manage fragrances" on public.fragrances;
create policy "Authenticated users can manage fragrances"
  on public.fragrances for all
  to authenticated
  using (true)
  with check (true);
