# Capital One Tech Summit

A modern React application built with Vite, TypeScript, and Tailwind CSS. This app provides a comprehensive financial dashboard with features for credit card comparison, interest calculation, credit optimization, and profile management.

## Features

- 📊 **Dashboard** - Overview of financial metrics and recent activity
- 📈 **Comparison** - Compare different credit card options
- 🧮 **Calculator** - Calculate interest on loans and investments
- ⚡ **Optimizer** - Get recommendations to optimize your credit score
- 👤 **Profile** - Manage your account settings and preferences

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment to Vercel

This project is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect the Vite configuration
4. Deploy!

Alternatively, use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

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
