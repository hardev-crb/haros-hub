# HarOS Hub - Skema Database Supabase (Draft Awal)

## Tabel Utama

### 1. profiles
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'staff', -- owner, manager, staff, accountant
  business_type text, -- retail, fnb, jasa
  business_name text,
  onboarding_completed boolean default false,
  created_at timestamptz default now()
);
```

### 2. modules
```sql
create table modules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text,
  description text,
  suggested_for text[], -- array: retail, fnb, jasa
  is_active boolean default true
);
```

### 3. user_modules (modul yang diaktifkan per bisnis)
```sql
create table user_modules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  module_id uuid references modules(id),
  enabled boolean default true,
  created_at timestamptz default now()
);
```

### 4. products (untuk POS & Gudang)
```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  name text not null,
  sku text,
  stock integer default 0,
  buy_price numeric,
  sell_price numeric,
  category text,
  created_at timestamptz default now()
);
```

### 5. transactions (POS)
```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  customer_name text,
  total numeric,
  payment_method text,
  status text default 'completed',
  created_at timestamptz default now()
);
```

## Catatan
- Gunakan Row Level Security (RLS) di semua tabel.
- Owner hanya bisa akses data miliknya.
- Sinkronisasi offline nanti menggunakan tabel local + queue sync.
