# Setup Guide

This file is the quick reference for getting the app running locally. For full feature/architecture docs, see [`README.md`](./README.md).

## Architecture (TL;DR)

**There is no local backend to start.** This is a single-page React app talking directly to **Supabase** (Postgres + Auth), which is fully cloud-hosted at https://supabase.com. Once the Supabase project is provisioned, it runs 24/7 on Supabase's servers — you do **not** run a backend process locally.

```
┌────────────────────────┐         HTTPS          ┌──────────────────────┐
│  Vite dev server       │ ─────────────────────► │  Supabase (cloud)    │
│  http://localhost:5173 │                        │  - Auth              │
│  (the only thing you   │ ◄───────────────────── │  - Postgres DB       │
│   run locally)         │                        │    users, loans,     │
└────────────────────────┘                        │    loans_form        │
                                                  └──────────────────────┘
```

So the daily workflow is just:

```bash
npm run dev
```

That's it. Open http://localhost:5173/.

---

## First-Time Setup

Do these **once per machine**.

### 1. Prerequisites

- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)
- A Supabase account (free tier is fine) — https://supabase.com

### 2. Clone & install

```bash
git clone https://github.com/shravan2453/CapitalOneTechSummit.git
cd CapitalOneTechSummit
npm install
```

### 3. Supabase project (one-time)

If you don't already have a Supabase project for this app:

1. Sign in to https://supabase.com → **New project** (free tier).
2. Wait ~1–2 min for provisioning.
3. Open **SQL Editor** → **New query** → paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) → **Run**. This creates the `users`, `loans`, and `loans_form` tables with row-level security policies.
4. **Authentication** → **Sign In / Up** → uncheck **Confirm email** (so you don't need to click an email link every signup during testing).
5. **Settings** → **API** → copy:
   - **Project URL**
   - **anon / publishable key**

> The currently configured project is `hnefktdmtpmqjqzmbmlc` (Tech Summit). If you're working on the same one, skip to step 4.

### 4. Environment variables

Copy [`.env.example`](./.env.example) to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

```env
# Required - frontend
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key

# Optional - only needed if you want the Luna chatbot (Education page) to work.
# This key is used by the /api/gemini serverless function and must NEVER be
# prefixed with VITE_ (Vite would inline it into the browser bundle).
OPENAI_API_KEY=sk-proj-your-openai-key-here
```

- The `VITE_` prefix is required for any var the browser needs — Vite ignores any other prefix.
- `OPENAI_API_KEY` is **server-side only**. Locally it's read by `/api/gemini` if you run via `vercel dev`; on Vercel/Netlify, add it under the project's Environment Variables settings.
- `.env.local` is gitignored. Never commit it.

### 5. Run

```bash
npm run dev
```

Open http://localhost:5173/, click **Create Account**, sign up, log in. Done.

---

## Daily Workflow

```bash
npm run dev      # start the dev server (the only thing you run locally)
```

Stop with `Ctrl+C`. There is no backend process to manage — Supabase is always running in the cloud.

## Other Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Type-check with `tsc` and bundle to `dist/` for deployment |
| `npm run preview` | Serve the production build on http://localhost:4173 |
| `npm run lint` | Run ESLint |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `command not found: vite` | Run `npm install` |
| Page stuck on "Loading…" / Supabase 401 | Wrong env prefix — must be `VITE_`, not `NEXT_PUBLIC_`. Restart dev server after fixing `.env.local`. |
| `Could not find the table 'public.users'` | You haven't run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor yet. |
| Signup says "Email confirmation required" | In Supabase: **Authentication → Sign In / Up → uncheck Confirm email**, then sign up again. |
| "User profile not found. Please complete your profile first." | Expected on first login — go to the **Profile** page and fill it out. That creates your `users` row. |
| Port 5173 busy | `npm run dev -- --port 3000` (or kill the old vite process: `lsof -i :5173 -t \| xargs kill`) |
| `npm run build` fails on `tsc` errors | These are pre-existing TypeScript issues in `CalculatorPage`, `ComparisonPage`, `LoansForm`, etc. `npm run dev` works fine without fixing them; fix before deploying. |

## Deploying

`vercel.json` is already in the repo, so `vercel --prod` (after `vercel login`) works out of the box once `npm run build` is clean.

For Netlify, the equivalent settings are:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

You may also need a `_redirects` file in `public/` containing `/* /index.html 200` so client-side routing works.
