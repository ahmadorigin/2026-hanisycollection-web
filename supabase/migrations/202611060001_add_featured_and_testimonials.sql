-- Hanisy Collection additive migration.
-- Existing tables, columns, records, Auth and Storage are preserved.
alter table public.products
  add column if not exists is_featured boolean not null default false;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Public can read testimonials" on public.testimonials;
create policy "Public can read testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated admins can manage testimonials" on public.testimonials;
create policy "Authenticated admins can manage testimonials"
  on public.testimonials for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
