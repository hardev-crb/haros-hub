# HarOS Hub

Platform modular bisnis untuk UMKM. Setiap modul seperti aplikasi di dalam aplikasi induk (Har-POS, Har-Inventory, Har-Finance, dll).

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS
- Supabase (PostgreSQL + Auth + Realtime)
- Deploy: **Netlify**

## Live
- https://haros-hub.netlify.app

## Setup Lokal
1. `npm install`
2. Copy `.env.example` → `.env` dan isi:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. `npm run dev`

## Deploy ke Netlify
1. Push ke GitHub
2. Di Netlify → Add new site → Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy

## Modul
| Modul | Status |
|-------|--------|
| Har-POS | Transaksi + history |
| Har-Inventory | Produk & stok |
| Har-Finance | Pemasukan/pengeluaran |
| Har-Customer | Data pelanggan |
| Har-Sewa | Monitoring sewa |
| Har-Tenggat | Deadline & tugas |
| Har-AI | Asisten AI (dasar) |
| Har-Sale, Staff, Promo, Report, Purchase | Dalam pengembangan |

## Struktur
- `src/pages/` — Semua halaman & modul
- `src/lib/` — Supabase client
- `netlify.toml` — Konfigurasi deploy Netlify
