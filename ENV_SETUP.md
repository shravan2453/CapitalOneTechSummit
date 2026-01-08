# Environment Variables Setup

## Important: Vite uses `VITE_` prefix, NOT `NEXT_PUBLIC_`

Since this is a Vite React app (not Next.js), you need to use `VITE_` prefix for environment variables.

## Create `.env.local` file

Create a file named `.env.local` in the root directory with the following content:

```
VITE_SUPABASE_URL=https://jtqcwhxjkjnwphheisbg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cWN3aHhqa2pud3BoaGVpc2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MjU0MDEsImV4cCI6MjA4MzQwMTQwMX0.U5RGcGzq93-GnHOtJMUE_lJSAirQ7552E5ja3ZhNT7k
```

**Note:** The prefix must be `VITE_` not `NEXT_PUBLIC_` because this is a Vite project.

## After creating the file:

1. **Restart your development server** (stop and run `npm run dev` again)
2. The environment variables will be available as `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`
