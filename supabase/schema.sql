-- HarOS Hub Schema (Updated for POS, Inventory, Finance)
create extension if not exists "uuid-ossp";

-- Drop existing if any
drop table if exists public.finance_entries cascade;
drop table if exists public.transactions cascade;
drop table if exists public.products cascade;
drop table if exists public.profiles cascade;
drop table if exists public.businesses cascade;
drop function if exists public.handle_new_user() cascade;

-- Tables
create table public.businesses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  business_type text,
  owner_id uuid,
  supabase_url text,
  supabase_anon_key text,
  is_dedicated boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  business_id uuid references public.businesses(id) on delete set null,
  full_name text,
  role text default 'staff',
  phone text,
  created_at timestamptz default now()
);

create table public.products (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  name text not null,
  price numeric default 0,
  stock integer default 0,
  created_at timestamptz default now()
);

create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references public.businesses(id) on delete cascade,
  total numeric default 0,
  discount numeric default 0,
  items jsonb default '[]'::jsonb,
  status text default 'completed',
  created_by uuid,
  created_at timestamptz default now()
);

create table public.finance_entries (
  id uuid primary key default uuid_generate_v4(),
  type text check (type in ('in', 'out')) not null,
  amount numeric not null,
  note text,
  created_by uuid,
  created_at timestamptz default now()
);

-- Function to create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'owner')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.businesses enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;
alter table public.finance_entries enable row level security;

-- Policies: open for testing (SELECT/INSERT/UPDATE)
create policy "select_businesses" on public.businesses for select using (true);
create policy "select_profiles" on public.profiles for select using (true);
create policy "select_products" on public.products for select using (true);
create policy "select_transactions" on public.transactions for select using (true);
create policy "select_finance" on public.finance_entries for select using (true);

create policy "insert_businesses" on public.businesses for insert with check (true);
create policy "insert_profiles" on public.profiles for insert with check (true);
create policy "insert_products" on public.products for insert with check (true);
create policy "insert_transactions" on public.transactions for insert with check (true);
create policy "insert_finance" on public.finance_entries for insert with check (true);

create policy "update_businesses" on public.businesses for update using (true);
create policy "update_profiles" on public.profiles for update using (true);
create policy "update_products" on public.products for update using (true);
create policy "update_transactions" on public.transactions for update using (true);
create policy "update_finance" on public.finance_entries for update using (true);