# HarOS Hub

Platform modular bisnis untuk UMKM (PWA).

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS
- Supabase (PostgreSQL + Auth + Realtime)
- Deploy: Vercel

## Setup Lokal (Opsional)
1. `npm install`
2. Copy `.env.example` → `.env` dan isi URL & Key Supabase
3. `npm run dev`

## Deploy ke Vercel
1. Push ke GitHub
2. Import project di vercel.com
3. Set Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## Struktur
- `src/pages/` — Onboarding, Launcher, POSDashboard, POSTransaction
- `src/lib/` — Supabase client & utils
- `supabase/schema.sql` — Schema database + RLS
