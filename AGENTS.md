# koszy.moe

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build (outputs to dist/)
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Required Setup

1. Create `.env` in root with Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key
   ```
2. Run `npm install`

## Project Structure

- `src/` - React source code
  - `pages/` - Route pages (Home, Settings, genshin/)
  - `components/` - Reusable components
  - `context/` - React contexts (Auth, Planner, Settings)
  - `lib/supabase.js` - Supabase client
  - `data/` - Data fetching and static data
- `supabase/` - Local Supabase config (config.toml, migrations)
- `dist/` - Build output (gitignored)

## Notes

- No test framework configured
- ESLint allows unused vars starting with uppercase (`^[A-Z_]`) for React components
- `.env` is gitignored but `.env.example` doesn't exist yet - consider creating one
- Supabase local dev available via `supabase` CLI (ports: API 54321, DB 54322, Studio 54323)