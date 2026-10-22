-- HarOS Hub - POS Advanced Schema Additions (SAFE - IF NOT EXISTS)
-- Jalankan di Supabase SQL Editor

-- Extend products
alter table public.products add column if not exists category text;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists cost numeric default 0;

-- Tables (Meja)
create table if not exists public.tables (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  name text not null,
  capacity integer default 4,
  status text default 'available', -- available, occupied, reserved
  held_order_id uuid,
  created_at timestamptz default now()
);

-- Reservations
create table if not exists public.reservations (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  table_id uuid references public.tables(id) on delete cascade,
  customer_name text,
  phone text,
  reserved_at timestamptz not null,
  party_size integer default 2,
  status text default 'pending', -- pending, confirmed, seated, cancelled
  note text,
  created_at timestamptz default now()
);

-- Promos
create table if not exists public.promos (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  name text not null,
  code text,
  type text check (type in ('percent', 'amount')) default 'percent',
  value numeric not null,
  min_subtotal numeric default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- Settings (tax, service, packing)
create table if not exists public.pos_settings (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade unique,
  tax_percent numeric default 0,
  service_percent numeric default 0,
  default_packing_fee numeric default 0,
  created_at timestamptz default now()
);

-- Held Orders (persistent)
create table if not exists public.held_orders (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  table_id uuid references public.tables(id) on delete set null,
  items jsonb default '[]'::jsonb,
  note text,
  created_by uuid,
  created_at timestamptz default now()
);

-- Shifts
create table if not exists public.shifts (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  opened_by uuid,
  opened_at timestamptz default now(),
  closed_at timestamptz,
  opening_cash numeric default 0,
  closing_cash numeric,
  expected_cash numeric,
  status text default 'open', -- open, closed
  note text
);

-- Product options / toppings
create table if not exists public.product_options (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  price numeric default 0,
  created_at timestamptz default now()
);

-- RLS (simple, allow all for now - adjust later)
alter table public.tables enable row level security;
alter table public.reservations enable row level security;
alter table public.promos enable row level security;
alter table public.pos_settings enable row level security;
alter table public.held_orders enable row level security;
alter table public.shifts enable row level security;
alter table public.product_options enable row level security;

drop policy if exists "all_tables" on public.tables;
create policy "all_tables" on public.tables for all using (true) with check (true);

drop policy if exists "all_reservations" on public.reservations;
create policy "all_reservations" on public.reservations for all using (true) with check (true);

drop policy if exists "all_promos" on public.promos;
create policy "all_promos" on public.promos for all using (true) with check (true);

drop policy if exists "all_pos_settings" on public.pos_settings;
create policy "all_pos_settings" on public.pos_settings for all using (true) with check (true);

drop policy if exists "all_held_orders" on public.held_orders;
create policy "all_held_orders" on public.held_orders for all using (true) with check (true);

drop policy if exists "all_shifts" on public.shifts;
create policy "all_shifts" on public.shifts for all using (true) with check (true);

drop policy if exists "all_product_options" on public.product_options;
create policy "all_product_options" on public.product_options for all using (true) with check (true);
