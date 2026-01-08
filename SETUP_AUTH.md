# Authentication Setup Instructions

## Step 1: Install Dependencies

Run the following command to install Supabase:

```bash
npm install @supabase/supabase-js
```

## Step 2: Create Environment File

Create a `.env.local` file in the root directory with the following content:

```
VITE_SUPABASE_URL=https://jtqcwhxjkjnwphheisbg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cWN3aHhqa2pud3BoaGVpc2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MjU0MDEsImV4cCI6MjA4MzQwMTQwMX0.U5RGcGzq93-GnHOtJMUE_lJSAirQ7552E5ja3ZhNT7k
```

## Step 3: Restart Development Server

After creating the `.env.local` file, restart your Vite development server:

```bash
npm run dev
```

## Features Implemented

✅ **Authentication Context** - Global auth state management
✅ **Login Page** - User sign-in with email/password
✅ **Signup Page** - User registration with first name, last name, email, and password
✅ **Protected Routes** - Dashboard, Comparison, Calculator, Optimizer, and Profile pages require authentication
✅ **Auto-redirect** - Unauthenticated users are redirected to login
✅ **Sign Out** - Logout functionality in the navbar
✅ **Session Management** - Automatic session persistence and restoration

## How It Works

1. Users can sign up with email and password
2. User metadata (first name, last name) is stored in Supabase
3. After successful signup/login, users are redirected to the dashboard
4. All app pages (except landing, login, signup) require authentication
5. Users can sign out from the navbar (click the avatar icon)

## Supabase Setup

### Email Authentication
Make sure your Supabase project has:
- Email authentication enabled
- User metadata fields configured (first_name, last_name are optional)

### Google OAuth Setup

1. **Enable Google Provider in Supabase:**
   - Go to your Supabase Dashboard
   - Navigate to Authentication > Providers
   - Enable the Google provider

2. **Configure Google OAuth:**
   - You'll need to create a Google OAuth application:
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new project or select an existing one
     - Enable Google+ API
     - Go to "Credentials" > "Create Credentials" > "OAuth client ID"
     - Choose "Web application"
     - Add authorized redirect URIs:
       - `https://jtqcwhxjkjnwphheisbg.supabase.co/auth/v1/callback`
       - For local development: `http://localhost:5173/auth/v1/callback` (if using Vite default port)
   - Copy the Client ID and Client Secret
   - Paste them into Supabase Dashboard > Authentication > Providers > Google

3. **Set Redirect URL:**
   - In Supabase Dashboard > Authentication > URL Configuration
   - Add your site URL: `http://localhost:5173` (for development)
   - Add redirect URL: `http://localhost:5173/dashboard` (or your production URL)

## Features

✅ **Email/Password Authentication** - Traditional sign up and sign in
✅ **Google OAuth** - One-click sign in with Google account
✅ **User Metadata** - Stores first name and last name
✅ **Session Management** - Automatic session persistence
✅ **Protected Routes** - All app pages require authentication
