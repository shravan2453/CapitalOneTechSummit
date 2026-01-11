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

- Node.js 18+ and npm (or yarn/pnpm)

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

### 3. Start Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

**Note:** After creating or updating `.env.local`, you must restart your dev server for changes to take effect.

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
