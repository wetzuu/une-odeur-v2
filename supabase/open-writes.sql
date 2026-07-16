-- ⚠ SUPERSEDED by admin-delete.sql — run that instead. It keeps
-- insert/update open to everyone but restricts delete to admins.
--
-- Stage: open catalog management (no auth yet).
-- Run this in the Supabase SQL editor AFTER schema.sql.
--
-- Lets anonymous visitors create, update, and delete fragrances so the
-- Stockroom works without accounts. When authentication/ownership lands,
-- drop "Anyone can manage fragrances" and restore the authenticated-only
-- policy from schema.sql.

drop policy if exists "Authenticated users can manage fragrances" on public.fragrances;
drop policy if exists "Anyone can manage fragrances" on public.fragrances;

create policy "Anyone can manage fragrances"
  on public.fragrances for all
  to anon, authenticated
  using (true)
  with check (true);
