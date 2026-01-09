# ONE LOAN - Student Loan Optimization Platform

<img width="2560" height="919" alt="Capital_One_logo svg-1" src="https://github.com/user-attachments/assets/7fdc2249-a91e-41d9-9e71-5c4a3e150ae9" />

A modern React web application that helps students compare loan options, calculate repayment scenarios, and optimize their loan strategy based on their personal financial situation. Features an interactive 3D background, glassmorphism design, and an AI-powered educational chatbot.

## ✨ Features

### Core Functionality
- **Dashboard** - Overview of financial metrics, loan balances, and payoff trajectory
- **Loan Comparison** - Compare federal, private, and state loan options side-by-side with detailed scenarios
- **Calculator** - Calculate loan payments, total cost, and view full amortization schedules with extra payment options
- **Optimizer** - Get personalized loan recommendations based on your profile and goals
- **My Loans** - Manage your personal loan portfolio with detailed loan information
- **Education** - Comprehensive guide to understanding student loans with interactive AI chatbot assistant (Luna)
- **Profile** - Manage your personal details, financial context, and loan preferences

### Design Features
- **3D Spline Background** - Interactive 3D scene on the landing page
- **Glassmorphism UI** - Modern glass-textured cards and components throughout
- **Responsive Design** - Mobile-first design that works on all devices
- **Custom Logo** - Red crescent logo with ONE/LOAN branding

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Supabase** - Backend database and authentication
- **Spline 3D** - Interactive 3D backgrounds
- **OpenAI API** - AI chatbot functionality

## 📋 Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Supabase account (for database and authentication)
- OpenAI API key (for chatbot functionality)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CapitalOneTechSummit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

**To get Supabase credentials:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key
4. Paste them into your `.env.local` file

**To get OpenAI API key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Navigate to **API Keys** section
3. Create a new API key
4. Add it to your `.env.local` file

### 4. Start Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

**Note:** After creating or updating `.env.local`, you must restart your dev server for changes to take effect.

## 📁 Project Structure

```
├── api/
│   └── gemini.ts              # Serverless function for OpenAI API proxy
├── src/
│   ├── components/            # Reusable React components
│   │   ├── Navbar.tsx         # Navigation bar with logo
│   │   ├── Footer.tsx         # Footer component
│   │   ├── Icon.tsx           # Icon wrapper component
│   │   ├── InfoTooltip.tsx    # Educational tooltips
│   │   ├── EducationChatbot.tsx # AI chatbot component (Luna)
│   │   └── shared.tsx         # Shared components (Card, Button, PageHeader)
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── data/                  # Static data
│   │   ├── loans.ts           # Loan product definitions
│   │   └── loanProducts.ts    # Raw loan product data
│   ├── lib/                   # Library configurations
│   │   └── supabase.ts        # Supabase client
│   ├── pages/                 # Page components
│   │   ├── LandingPage.tsx    # Landing page with Spline 3D background
│   │   ├── LoginPage.tsx      # Login page
│   │   ├── SignupPage.tsx     # Signup page
│   │   ├── DashboardPage.tsx  # Dashboard overview
│   │   ├── ComparisonPage.tsx # Loan comparison tool
│   │   ├── CalculatorPage.tsx # Loan calculator
│   │   ├── OptimizerPage.tsx  # Loan optimizer
│   │   ├── MyLoansPage.tsx    # Personal loans management
│   │   ├── EducationPage.tsx  # Education content with chatbot
│   │   └── ProfilePage.tsx    # User profile management
│   ├── services/              # API services
│   │   ├── userService.ts      # User profile management
│   │   └── loanService.ts     # Loan CRUD operations
│   ├── styles/                # Global styles
│   │   └── globals.css        # Tailwind directives and custom styles
│   ├── utils/                 # Utility functions
│   │   ├── calculations.ts    # Loan calculation functions
│   │   └── export.ts          # Data export utilities
│   ├── App.tsx                # Main app component with routing
│   └── main.tsx               # Entry point
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── vercel.json                # Vercel deployment configuration
└── package.json               # Dependencies and scripts
```

## 🔄 Application Workflow

### User Authentication Flow

```
┌─────────────────┐
│  Landing Page   │
└────────┬────────┘
         │
         ├─── User clicks "Sign Up" ───┐
         │                               │
         └─── User clicks "Sign In" ────┤
                                         │
                    ┌────────────────────▼────────────────────┐
                    │     LoginPage / SignupPage              │
                    └────────────────────┬────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │     Supabase Authentication             │
                    │  - Email/Password or Google OAuth       │
                    └────────────────────┬────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │     AuthContext Updates                 │
                    │  - Sets user state                      │
                    └────────────────────┬────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │     Auto-redirect to Dashboard           │
                    └─────────────────────────────────────────┘
```

### Page Navigation & Routing Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  State: currentPage                                   │   │
│  │  Navigation: setPage('pageName')                     │   │
│  └───────────────────────────────────────────────────────┘   │
└───────────────────────┬───────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌───────────────┐ ┌──────────────┐ ┌──────────────┐
│ Landing Page  │ │ Login/Signup │ │  Dashboard   │
│  - Spline 3D  │ │   Pages      │ │  (Protected) │
│  - Hero CTA   │ │              │ └──────┬───────┘
└───────┬───────┘ └──────────────┘        │
        │                                   │
        │              ┌────────────────────┼────────────────────┐
        │              │                    │                    │
        ▼              ▼                    ▼                    ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Comparison  │ │  Calculator  │ │  Optimizer   │ │  My Loans    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
        │              │                    │                    │
        └──────────────┼────────────────────┼────────────────────┘
                       │                    │
                       ▼                    ▼
              ┌──────────────┐      ┌──────────────┐
              │  Education   │      │   Profile    │
              │ + Luna Bot   │      │              │
              └──────────────┘      └──────────────┘
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                          │
│  (Click, Input, Form Submit)                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              React Component (Page/Component)               │
│  - Handles UI state                                         │
│  - Calls service functions                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Service Layer (userService/loanService)         │
│  - Business logic                                           │
│  - Data transformation                                      │
│  - Error handling                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Client (lib/supabase.ts)               │
│  - Database queries                                         │
│  - Authentication                                           │
│  - Real-time subscriptions                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Database                               │
│  - PostgreSQL database                                      │
│  - Row Level Security (RLS)                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Response Processing                            │
│  - Data validation                                          │
│  - State updates                                            │
│  - UI re-render                                              │
└─────────────────────────────────────────────────────────────┘
```

### Chatbot Workflow (Luna)

```
┌─────────────────────────────────────────────────────────────┐
│              User Types Question in Chatbot                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│        EducationChatbot Component (handleSend)               │
│  - Validates input                                          │
│  - Adds user message to state                               │
│  - Constructs prompt with Education content                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              API Call Strategy                               │
│                                                              │
│  1. Try /api/gemini (Vercel serverless function)            │
│     └─► If fails or empty response                          │
│                                                              │
│  2. Fallback to direct OpenAI API call                      │
│     └─► Uses API key from environment                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              OpenAI API (Chat Completions)                   │
│  - Model: gpt-3.5-turbo                                     │
│  - Prompt includes Education content context                 │
│  - Returns formatted response                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Response Processing                            │
│  - Parse JSON response                                      │
│  - Extract text content                                     │
│  - Transform to expected format                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Format Message (formatMessage)                 │
│  - Remove asterisks and em dashes                           │
│  - Format lists (bullets, numbered)                        │
│  - Format key-value pairs (colon-separated)                │
│  - Add proper line breaks and spacing                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Display Formatted Message                      │
│  - Renders in chat bubble                                   │
│  - Auto-scrolls to bottom                                   │
│  - User sees clean, readable response                       │
└─────────────────────────────────────────────────────────────┘
```

### Loan Calculation Workflow

```
┌─────────────────────────────────────────────────────────────┐
│              User Inputs Loan Data                           │
│  (Principal, Rate, Term, Payment Options)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│        Calculation Functions (utils/calculations.ts)         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ calculateMonthlyPayment()                          │    │
│  │ - Uses amortization formula                        │    │
│  │ - Handles different payment frequencies            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ calculateTotalInterest()                           │    │
│  │ - Calculates total interest over loan lifetime    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ generateAmortizationSchedule()                     │    │
│  │ - Creates month-by-month breakdown                │    │
│  │ - Handles extra payments                           │    │
│  └────────────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Results Display                                 │
│  - Monthly payment amount                                   │
│  - Total cost breakdown                                     │
│  - Amortization table                                       │
│  - Charts and visualizations                                │
└─────────────────────────────────────────────────────────────┘
```

### Optimizer Workflow

```
┌─────────────────────────────────────────────────────────────┐
│              User Sets Optimization Goals                    │
│  - Target payoff years OR max monthly payment               │
│  - In-school payment strategy                               │
│  - Profile information                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│        Optimizer Algorithm (OptimizerPage)                   │
│                                                              │
│  1. Calculate funding gap for each year                     │
│  2. Prioritize loan types (Subsidized → Unsubsidized →      │
│     State → Private)                                        │
│  3. Apply loan limits and constraints                       │
│  4. Calculate interest accrual during school                │
│  5. Generate repayment scenarios                            │
│  6. Rank strategies by total cost                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Display Top 3 Recommendations                   │
│  - Monthly payment                                          │
│  - Total cost                                               │
│  - Payoff timeline                                          │
│  - Loan mix breakdown                                       │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Design System

### Color Palette
- **Primary Red**: `#C8102E` (cap-red)
- **Navy Blue**: `#003087` (cap-navy)
- **Gradients**: Blue to Red transitions

### UI Components
- **Glassmorphism Cards**: Semi-transparent backgrounds with blur effects
- **3D Spline Background**: Interactive 3D scene on landing page
- **Custom Logo**: Red crescent with ONE/LOAN text

### Typography
- **Font**: Plus Jakarta Sans
- **Headings**: Bold, tracking-tight
- **Body**: Regular weight, leading-relaxed

## 🔧 Development Workflow

### Component Development

1. **Create Component** in `src/components/` or `src/pages/`
2. **Add Types** in TypeScript interfaces
3. **Style with Tailwind** using utility classes
4. **Add to App.tsx** routing if it's a page
5. **Test** in development server

### Adding New Features

1. **Plan Feature** - Define requirements and data flow
2. **Create Components** - Build UI components
3. **Add Services** - Create service functions if needed
4. **Update Database** - Modify Supabase schema if required
5. **Test** - Verify functionality
6. **Deploy** - Push to main branch (auto-deploys to Vercel)

### API Integration

1. **Create Serverless Function** in `/api/` folder
2. **Add Environment Variables** to `.env.local`
3. **Call from Frontend** using fetch
4. **Handle Errors** gracefully
5. **Test** in development and production

## 📊 Database Schema

The application uses Supabase with two main tables:

### `users` Table
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `first_name` (Text)
- `last_name` (Text)
- `year_level` (Text)
- `school_name` (Text)
- `state_of_residence` (Text)
- `dependency_status` (Text)
- `eligible_for_subsidized` (Boolean)
- `eligible_for_nc_fels` (Boolean)
- `annual_funding_gap` (Numeric)
- `expected_starting_salary` (Numeric)
- `credit_score_range` (Text)
- `has_cosigner` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### `loans` Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → users.id)
- `loan_type` (Text)
- `loan_name` (Text)
- `principal` (Numeric)
- `interest_rate` (Numeric)
- `term_years` (Numeric)
- `in_school_payment` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 🚢 Deployment

### Vercel Deployment

The project is configured for automatic deployment on Vercel:

1. **Push to Main Branch** - Automatically triggers deployment
2. **Environment Variables** - Set in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`
3. **Build Process** - Runs `npm run build`
4. **Serverless Functions** - `/api` folder automatically deployed

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🔐 Security Notes

- **Never commit API keys** to version control
- Use environment variables for all sensitive data
- API keys should be stored in `.env.local` (gitignored)
- In production, set environment variables in Vercel dashboard

## 📝 Key Features Explained

### Spline 3D Background
- Integrated using `<spline-viewer>` web component
- Loaded from CDN in `index.html`
- Watermark removed via CSS and JavaScript
- Provides interactive 3D experience on landing page

### Glassmorphism Design
- Applied to all cards and boxes throughout the app
- Uses `backdrop-filter: blur()` for glass effect
- Semi-transparent backgrounds with white borders
- Consistent styling across all components

### Luna AI Chatbot
- Located on Education page
- Answers questions based on Education content only
- Uses OpenAI API for responses
- Formatted output with clean text (no markdown)
- Corner popup design with message history

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

See LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**API Key Errors**
- Ensure `.env.local` file exists with correct variable names
- Restart dev server after adding environment variables
- Check that API keys are valid and have proper permissions

**Spline Background Not Loading**
- Check internet connection (loads from CDN)
- Verify script tag in `index.html`
- Check browser console for errors

**Chatbot Not Responding**
- Verify OpenAI API key is set correctly
- Check browser console for API errors
- Ensure serverless function is deployed (for production)

**Database Connection Issues**
- Verify Supabase credentials in `.env.local`
- Check Supabase project is active
- Verify database tables exist and have correct schema
