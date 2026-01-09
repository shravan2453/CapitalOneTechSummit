# 🎓 Student Loan Optimizer

A comprehensive loan optimization tool that helps undergraduate students find the **best combination of federal, state, and private loans** tailored to their specific situation. The optimizer generates **year-by-year plans** that minimize long-term costs while respecting annual and aggregate loan limits.

## 🎯 What This Tool Does

1. **Collects your financial profile** — year level, funding gap, income, credit score, state, eligibility options
2. **Allocates loans optimally** — exhausts federal options first (best rates + protections), then state, then private
3. **Plans year-by-year** — respects annual limits and tracks aggregate caps across all years
4. **Accounts for in-school payments** — shows how your payment choice during school affects total cost
5. **Compares strategies** — shows multiple plan variants (aggressive payoff, standard, extended)
6. **Projects total cost** — calculates interest, monthly payments, and complete payment timeline

## 🚀 Quick Start

### 1. Start the Backend (Node.js)
```bash
cd backend
npm install
node src/server.js
```
Server runs at `http://localhost:4000`

### 2. Open the Frontend
Open `frontend/index.html` in your browser (or serve it locally)

## 📊 API Endpoints

### `POST /api/optimize`
Main endpoint - returns optimized multi-year loan plans.

**Request:**
```json
{
  "yearLevel": "freshman",
  "annualGap": 25000,
  "stateOfResidence": "NC",
  "dependencyStatus": "dependent",
  "eligibleForSubsidized": true,
  "eligibleForFELS": false,
  "annualIncome": 60000,
  "familySize": 1,
  "creditScoreRange": "good",
  "cosigner": true,
  "inSchoolPayment": "defer",
  "targetPayoffYears": 10,
  "maxMonthlyPayment": null,
  "tuitionGrowthRate": 0.07
}
```

**Response:**
```json
{
  "featured": [...],
  "options": [
    {
      "label": "Recommended: 10-Year Payoff",
      "description": "Federal first strategy with 10-year repayment term",
      "yearPlan": [
        {
          "year": 1,
          "yearLevel": "freshman",
          "gap": 25000,
          "funded": 25000,
          "segments": [
            { "name": "Direct Subsidized", "amount": 3500, "rate": 0.0653, "termYears": 10 },
            { "name": "Direct Unsubsidized", "amount": 2000, "rate": 0.0653, "termYears": 10 },
            { "name": "NC Student Assist Loan", "amount": 10000, "rate": 0.0775, "termYears": 10 },
            { "name": "Sallie Mae Private", "amount": 9500, "rate": 0.0699, "termYears": 10 }
          ]
        }
      ],
      "summary": {
        "totalPrincipal": 107000,
        "totalInterest": 32000,
        "totalCost": 139000,
        "standardPayment": 1200,
        "weightedRate": 6.8,
        "payoffYears": 10,
        "payoffYear": 2039,
        "inSchoolMonthlyPayment": 0,
        "inSchoolTotalPaid": 0,
        "accruedInterest": 8500,
        "yearsInSchool": 4
      }
    }
  ],
  "requestedGap": 111000,
  "totalYears": 4
}
```

### `GET /api/loan-products`
Returns the full catalog of federal, state, and private loan options.

## 💰 Loan Hierarchy (Why Federal First?)

The optimizer follows this hierarchy because it minimizes long-term cost:

| Priority | Loan Type | 2024-25 Rate | Key Benefits |
|----------|-----------|--------------|--------------|
| 1 | Direct Subsidized | 6.53% | No interest while in school |
| 2 | Direct Unsubsidized | 6.53% | Federal protections, IDR eligible |
| 3 | State Loans (NC Assist, etc.) | 6.95-7.75% | Competitive rates, no fees |
| 4 | Private Loans | 4.89-17%+ | Only to fill remaining gap |

### Federal Loan Limits (2024-25)

**Dependent Students:**
| Year | Subsidized | Additional Unsubsidized | Total |
|------|------------|-------------------------|-------|
| Freshman | $3,500 | $2,000 | $5,500 |
| Sophomore | $4,500 | $2,000 | $6,500 |
| Junior | $5,500 | $2,000 | $7,500 |
| Senior | $5,500 | $2,000 | $7,500 |

**Independent Students:**
| Year | Subsidized | Additional Unsubsidized | Total |
|------|------------|-------------------------|-------|
| Freshman | $3,500 | $6,000 | $9,500 |
| Sophomore | $4,500 | $6,000 | $10,500 |
| Junior | $5,500 | $7,000 | $12,500 |
| Senior | $5,500 | $7,000 | $12,500 |

**Aggregate Limits:**
- Subsidized: $23,000
- Total (dependent): $31,000
- Total (independent): $57,500

## 🔧 Configuration

Edit `backend/src/data/loanProducts.js` to update:
- Interest rates (update annually in July)
- Origination fees
- State loan programs
- Private lender APR ranges

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── server.js           # Express API
│   │   ├── data/
│   │   │   └── loanProducts.js # Loan catalog
│   │   ├── services/
│   │   │   └── allocation.js   # Optimization engine
│   │   └── utils/
│   │       └── finance.js      # PMT, interest calcs
│   └── package.json
├── frontend/
│   └── index.html              # Single-page app
├── SETUP.md                    # Detailed setup guide
├── OPTIMIZATION.md             # Algorithm explanation
├── FIELDS.md                   # Input field reference
└── README.md
```

## 📚 Data Sources

- **Federal rates:** [studentaid.gov](https://studentaid.gov/understand-aid/types/loans/interest-rates)
- **NC Assist:** [CFNC.org](https://www.cfnc.org/pay-for-college/nc-assist-loans/)
- **Private lenders:** Individual lender websites (Sallie Mae, SoFi, Discover, etc.)

## 🧮 Key Calculations

**Monthly Payment (PMT):**
```
PMT = P × r × (1+r)^n / ((1+r)^n - 1)
```

**In-School Interest Accrual (for unsubsidized, deferred):**
```
Accrued = Principal × ((1 + r/12)^months - 1)
```

**IDR Payment (SAVE Plan):**
```
Payment = (Income - 2.25 × PovertyLine) × 5% / 12
```

## ⚠️ Disclaimer

This tool provides estimates for educational purposes. Actual loan terms, rates, and eligibility may vary. Always consult with your school's financial aid office and read loan disclosures carefully before borrowing.
