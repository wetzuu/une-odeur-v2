-- Restricts UPDATE and DELETE on fragrances to shop administrators.
-- Run this in the Supabase SQL editor. It supersedes open-writes.sql
-- (insert stays open to everyone; editing and deleting existing
-- items become admin-only).

-- ── Admin check ────────────────────────────────────────────────
-- Temporary hardcoded allowlist. When full auth + roles land, replace
-- this function's body with a proper role lookup (e.g. a user_roles
-- table or a custom JWT claim) — the policies below won't need to change.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') in (
    'wetzuxd@gmail.com',
    'matthewsean1104@gmail.com'
  );
$$;

-- ── Split the old catch-all write policies ─────────────────────
drop policy if exists "Authenticated users can manage fragrances" on public.fragrances;
drop policy if exists "Anyone can manage fragrances" on public.fragrances;

drop policy if exists "Anyone can add fragrances" on public.fragrances;
create policy "Anyone can add fragrances"
  on public.fragrances for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can update fragrances" on public.fragrances;
drop policy if exists "Only admins can update fragrances" on public.fragrances;
create policy "Only admins can update fragrances"
  on public.fragrances for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Only admins can delete fragrances" on public.fragrances;
create policy "Only admins can delete fragrances"
  on public.fragrances for delete
  to authenticated
  using (public.is_admin());
