# Fix Environment Variables

## The Problem

Your `.env.local` file is using `NEXT_PUBLIC_` prefix, but this is a **Vite** project, not Next.js. Vite requires `VITE_` prefix.

## The Solution

Update your `.env.local` file to use `VITE_` prefix:

**Change from:**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**To:**
```
VITE_SUPABASE_URL=https://jtqcwhxjkjnwphheisbg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cWN3aHhqa2pud3BoaGVpc2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MjU0MDEsImV4cCI6MjA4MzQwMTQwMX0.U5RGcGzq93-GnHOtJMUE_lJSAirQ7552E5ja3ZhNT7k
```

## Also Install the Package

Run this command in your terminal:
```bash
npm install @supabase/supabase-js
```

If you get permission errors, try:
```bash
npm install @supabase/supabase-js --legacy-peer-deps
```

Or install it manually in your terminal outside of this environment.

## After Fixing:

1. Update `.env.local` with `VITE_` prefix
2. Install the package: `npm install @supabase/supabase-js`
3. **Restart your dev server** (stop and run `npm run dev` again)

The error should be resolved!
