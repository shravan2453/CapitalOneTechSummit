# Capital One Tech Summit - Loan Comparison App

A React web application that helps students compare loan options, calculate repayment scenarios, and optimize their loan strategy based on their personal financial situation.

## Feature Overview

- **Dashboard** - Overview of financial metrics, loan balances, and payoff trajectory
- **Loan Comparison** - Compare federal, private, and state loan options side-by-side with detailed scenarios
- **Calculator** - Calculate loan payments, total cost, and view full amortization schedules with extra payment options
- **Loan Optimizer** - Advanced multi-year loan allocation engine with personalized recommendations
- **My Loans** - Manage your personal loan portfolio with detailed loan information
- **Education** - Comprehensive guide to understanding student loans, repayment options, and optimization strategies
- **Profile** - Manage your personal details, financial context, and loan preferences

## Loan Optimizer

The **Loan Optimizer** is an advanced tool that helps students create optimal loan strategies based on their unique financial situation.

### How It Works

The optimizer uses a **"Federal First"** strategy that prioritizes loan sources in this order:

1. **Federal Subsidized** - Best rates, government pays interest while in school
2. **Federal Unsubsidized** - Same rates as subsidized, but interest accrues
3. **State Loans** - Often lower rates than private (e.g., NC Assist, CA Dream)
4. **Private Loans** - Selected based on credit score and cosigner availability

### Key Features

- **Multi-Year Planning**: Projects your loan needs across all remaining school years
- **Tuition Growth**: Accounts for expected annual increases in costs
- **Annual/Aggregate Limits**: Automatically respects federal loan limits by year level
- **Multiple Plan Options**: Generates 3-5 alternative strategies to compare
- **In-School Payment Modeling**: Shows how different payment strategies affect total cost
- **IDR Estimates**: Calculates Income-Driven Repayment amounts based on expected salary

### Profile Inputs

| Field | Description |
|-------|-------------|
| Year Level | Freshman through Senior (affects loan limits) |
| State of Residence | Determines state loan eligibility (NC, CA, NY) |
| Dependency Status | Dependent or Independent (affects federal limits) |
| Annual Funding Gap | COA minus grants/scholarships/savings per year |
| Expected Salary | Post-graduation income for IDR calculations |
| Credit Score | Affects private loan interest rates |
| Cosigner | Improves private loan rates if available |
| Subsidized Eligibility | Based on FAFSA financial need |
| Target Payoff Years | 5-25 years (shorter = higher payments, less interest) |
| Max Monthly Payment | Optional budget cap |
| In-School Payment | Defer, Interest-Only, Fixed $25, or Full |

### Supported Loan Products

**Federal Loans:**
- Direct Subsidized (6.53% for 2024-25)
- Direct Unsubsidized (6.53% for 2024-25)
- Parent PLUS (9.08% for 2024-25)

**State Loans:**
- NC Student Assist (7.75%)
- NC Parent Assist (6.95%)
- NC FELS (Forgivable - 0%)
- California Dream Loan (5.5%)
- NY HESC Loan (6.0%)

**Private Lenders:**
- Sallie Mae
- SoFi
- College Ave
- Discover
- Earnest
- Citizens Bank
- ELFI

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Supabase** - Backend database and authentication

## Prerequisites

- **Node.js 18+** (tested with Node 20 and 22) — check with `node --version`
- **npm 9+** — check with `npm --version`
- macOS, Linux, or Windows (WSL recommended on Windows)

If you don't have Node installed, get it from [nodejs.org](https://nodejs.org/) or via `nvm`:

```bash
# install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20
```

## Local Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd CapitalOneTechSummit
```

### 2. Install dependencies

```bash
npm install
```

If you hit peer-dependency conflicts, retry with:

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

Create a `.env.local` file in the project root. **This project uses Vite, so env vars must be prefixed with `VITE_`** (not `NEXT_PUBLIC_`):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

**To get the Supabase credentials:**
1. Go to the [Supabase dashboard](https://supabase.com/dashboard)
2. Open your project → **Settings** → **API**
3. Copy the **Project URL** → paste as `VITE_SUPABASE_URL`
4. Copy the **anon public** key → paste as `VITE_SUPABASE_ANON_KEY`

> **Note:** `src/lib/supabase.ts` also ships with hard-coded fallback values, so the app will boot even without `.env.local`, but you should set your own credentials for real use. Always restart the dev server after editing `.env.local`.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**. Vite supports hot module replacement, so edits update instantly.

### 5. Build for production (optional)

```bash
npm run build      # outputs to dist/
npm run preview    # serves the production build locally on http://localhost:4173
```

## Available Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start the Vite dev server (port 5173) |
| `npm run build` | Type-check with `tsc` and bundle to `dist/` |
| `npm run preview` | Serve the built `dist/` locally for a final check |
| `npm run lint` | Run ESLint on all `.ts` / `.tsx` files |

## Troubleshooting

**`npm run dev` fails with "command not found: vite"**
Run `npm install` first — `node_modules` is gitignored.

**Page loads but shows "Loading..." forever or Supabase errors**
Your env vars are wrong. Make sure `.env.local` uses the `VITE_` prefix (not `NEXT_PUBLIC_`) and restart the dev server.

**`npm run build` fails with TypeScript errors**
The build runs `tsc` in strict mode. Use `npm run dev` for development — Vite skips full type-checking and is far more forgiving. Fix `tsc` errors before deploying.

**Port 5173 is already in use**
Either stop the other process or run `npm run dev -- --port 3000` to pick a different port.

**Changes to `.env.local` aren't picked up**
Stop the dev server (`Ctrl+C`) and run `npm run dev` again — Vite only reads env files at startup.

## Project Structure

```
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Footer.tsx       # Footer component
│   │   ├── Icon.tsx         # Icon wrapper component
│   │   ├── InfoTooltip.tsx  # Educational tooltips
│   │   └── shared.tsx       # Shared components (Card, Button, PageHeader)
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── data/                # Static data
│   │   ├── loans.ts         # Loan product definitions
│   │   └── loanProducts.ts  # Raw loan product data (federal, state, private)
│   ├── lib/                 # Library configurations
│   │   └── supabase.ts      # Supabase client
│   ├── pages/               # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ComparisonPage.tsx
│   │   ├── CalculatorPage.tsx
│   │   ├── OptimizerPage.tsx    # Loan optimizer UI
│   │   ├── MyLoansPage.tsx
│   │   ├── EducationPage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/            # API services
│   │   ├── userService.ts   # User profile management
│   │   └── loanService.ts   # Loan CRUD operations
│   ├── styles/              # Global styles
│   │   └── globals.css      # Tailwind directives and custom styles
│   ├── utils/               # Utility functions
│   │   ├── calculations.ts  # Basic loan calculation functions
│   │   ├── loanOptimizer.ts # Multi-year loan optimization engine
│   │   └── export.ts        # Data export utilities
│   ├── App.tsx              # Main app component with routing
│   └── main.tsx             # Entry point
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## Feature Descriptions

### Loan Optimizer
- Input your profile: year level, state, financial gap, credit score
- Generates multi-year loan allocation plans respecting all limits
- Compares aggressive vs. extended payoff strategies
- Shows year-by-year breakdown of recommended loans
- Calculates total cost, interest, and monthly payments
- Supports in-school payment strategy modeling

### Loan Comparison
- Compare multiple loan scenarios side-by-side
- Build custom "what-if" scenarios with different loan mixes
- Visual cumulative cost analysis chart
- Real-time calculation updates

### Calculator
- Interactive loan calculator with sliders and inputs
- Full amortization schedule preview
- Support for extra payments
- Download calculation results

### Profile Management
- Comprehensive user profile with financial details
- Dependency status, year level, and eligibility tracking
- Repayment preferences and optimization goals
- In-school payment strategy selection

### My Loans
- Add and manage personal loans
- Track loan details, limits, and calculated metrics
- Edit and delete loan records

### Education
- Comprehensive guide to student loans
- Information about federal, state, and private loans
- Repayment strategies and optimization tips

## Development

This is a Single Page Application (SPA) built with React and Vite. All code is written in TypeScript for type safety.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Loan Optimizer Algorithm

The optimizer uses a greedy allocation algorithm:

```
For each year remaining in school:
  1. Calculate funding gap (with tuition growth)
  2. Allocate federal subsidized (up to annual/aggregate limits)
  3. Allocate federal unsubsidized (remaining annual limit)
  4. Allocate state loans if eligible (NC, CA, NY)
  5. Fill remaining gap with best private lender
  6. Track aggregate usage for next year
```

Plans are scored by:
- **Total Cost** (50% weight) - Lower is better
- **Monthly Payment** (30% weight) - Lower is better
- **Payoff Speed** (20% weight) - Faster is better
- **Budget Penalties** - If payment exceeds max budget
- **Term Penalties** - If payoff doesn't match target

## Database Schema

The application uses Supabase with two main tables:

- **users** - User profiles with financial information and preferences
- **loans** - User's personal loan records

## License

See LICENSE file for details.
