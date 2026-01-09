# Capital One Tech Summit - Loan Comparison App
<img width="2560" height="919" alt="Capital_One_logo svg-1" src="https://github.com/user-attachments/assets/7fdc2249-a91e-41d9-9e71-5c4a3e150ae9" />

A React web application that helps students compare loan options, calculate repayment scenarios, and optimize their loan strategy based on their personal financial situation.

## Feature Overview

- **Dashboard** - Overview of financial metrics, loan balances, and payoff trajectory
- **Loan Comparison** - Compare federal, private, and state loan options side-by-side with detailed scenarios
- **Calculator** - Calculate loan payments, total cost, and view full amortization schedules with extra payment options
- **Optimizer** - Get personalized loan recommendations based on your profile and goals
- **My Loans** - Manage your personal loan portfolio with detailed loan information
- **Education** - Comprehensive guide to understanding student loans, repayment options, and optimization strategies, supported by an AI chatbot assistant.
- **Profile** - Manage your personal details, financial context, and loan preferences

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
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── Footer.tsx       # Footer component
│   │   ├── Icon.tsx        # Icon wrapper component
│   │   ├── InfoTooltip.tsx # Educational tooltips
│   │   └── shared.tsx      # Shared components (Card, Button, PageHeader)
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── data/               # Static data
│   │   ├── loans.ts        # Loan product definitions
│   │   └── loanProducts.ts # Raw loan product data
│   ├── lib/                # Library configurations
│   │   └── supabase.ts     # Supabase client
│   ├── pages/              # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ComparisonPage.tsx
│   │   ├── CalculatorPage.tsx
│   │   ├── OptimizerPage.tsx
│   │   ├── MyLoansPage.tsx
│   │   ├── EducationPage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/           # API services
│   │   ├── userService.ts  # User profile management
│   │   └── loanService.ts  # Loan CRUD operations
│   ├── styles/             # Global styles
│   │   └── globals.css     # Tailwind directives and custom styles
│   ├── utils/              # Utility functions
│   │   ├── calculations.ts # Loan calculation functions
│   │   └── export.ts       # Data export utilities
│   ├── App.tsx             # Main app component with routing
│   └── main.tsx            # Entry point
├── index.html              # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## Feature Descriptions

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
- Access to AI chatbot Luna to help answer questions

## Development

This is a Single Page Application (SPA) built with React and Vite. All code is written in TypeScript for type safety.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Schema

The application uses Supabase with two main tables:

- **users** - User profiles with financial information and preferences
- **loans** - User's personal loan records

## License

See LICENSE file for details.
