# Capital One Tech Summit - Loan Comparison App

A Next.js web application that allows students to compare loan options, customize repayment plans, and optimize their loan strategy based on their personal financial situation.

## Features

- **Dashboard** - Overview of financial metrics and recent activity
- **Comparison** - Compare different credit card options
- **Calculator** - Calculate interest on loans and investments
- **Optimizer** - Get recommendations to optimize your credit score
- **Profile** - Manage your account settings and preferences
## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Prerequisites

- Node.js 18+ and npm (or yarn/ppm)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase_anon_key
```

**To get the Supabase credentials:**
1. Go to the Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key
4. Paste them into your `.env.local` file

### 3. Install Supabase Package

If you get import errors, make sure the Supabase package is installed:

```bash
npm install @supabase/supabase-js
```

### 4. Start Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

**Note:** After creating or updating `.env.local`, you must restart your dev server for changes to take effect.

## Project Structure

```
├── src/
│   ├── components/       # Reusable React components
│   │   └── Navbar.tsx
│   ├── pages/           # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── ComparisonPage.tsx
│   │   ├── CalculatorPage.tsx
│   │   ├── OptimizerPage.tsx
│   │   └── ProfilePage.tsx
│   ├── styles/          # Global styles
│   │   └── globals.css
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vercel.json          # Vercel deployment configuration
```

## Development

All code is written in pure React with TypeScript. There are no Next.js dependencies or server-side rendering. The app is a Single Page Application (SPA) that can be easily hosted on Vercel or any static hosting service.

## License

See LICENSE file for details.
