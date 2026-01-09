# 📋 Setup Guide - Student Loan Optimizer

## Prerequisites

- **Node.js** 18+ (for backend)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation Steps

### 1. Backend Setup

```bash
cd backend
npm install
```

**Dependencies installed:**
- `express` - Web framework
- `cors` - Cross-origin requests
- `body-parser` - JSON parsing
- `uuid` - Unique IDs for profiles

### 2. Running the Application

**Terminal - Backend:**
```bash
cd backend
node src/server.js
```
→ API available at `http://localhost:4000`

**Frontend:**
```bash
cd frontend
# Option 1: Python simple server
python -m http.server 3000
# Option 2: Node serve
npx serve -l 3000
# Option 3: Just open index.html directly in browser
```
→ Open `http://localhost:3000` or the file directly

## Input Fields Explained

The optimizer needs these inputs to generate accurate recommendations:

### Required Fields

| Field | Description | Why It's Needed |
|-------|-------------|-----------------|
| **Year Level** | Freshman/Sophomore/Junior/Senior | Determines annual federal limits and years remaining |
| **School Name** | Your university | For reference in the plan |
| **State of Residence** | Your home state | Determines state loan eligibility (NC Assist, FELS, etc.) |
| **Dependency Status** | Dependent or Independent | Affects federal loan limits significantly |
| **Eligible for Subsidized** | Checkbox (checked by default) | Based on FAFSA financial need - uncheck if you don't qualify |
| **Eligible for NC FELS** | Checkbox (unchecked by default) | NC residents in teaching, nursing, allied health, etc. |
| **Annual Funding Gap** | COA minus grants/scholarships | The amount you need to borrow each year |
| **Expected Starting Salary** | Post-graduation income | Used for IDR payment estimates |
| **Credit Score Range** | Poor/Fair/Good/Excellent | Determines private loan APR |
| **Cosigner Available** | Yes/No | Can lower private loan rates |

### Repayment Constraint (Choose One)

| Constraint | Description |
|------------|-------------|
| **Target Payoff Years** | How long after graduation to pay off (5/7/10/15/20 years) |
| **Max Monthly Payment** | Set a strict budget cap - system finds shortest term that fits |

### Optional Fields

| Field | Default | Description |
|-------|---------|-------------|
| Family Size | 1 | For IDR calculations |
| In-School Payment | Defer | How you'll pay while in school |
| Tuition Growth Rate | 7% | Annual increase in costs |

## In-School Payment Options

| Option | Monthly Payment | Effect on Balance |
|--------|-----------------|-------------------|
| **Full Deferment** | $0 | Interest capitalizes (adds to principal) |
| **Interest Only** | Varies (~$30-50 per $10k) | No balance growth |
| **Fixed $25** | $25 | Partial interest coverage |
| **Full Payment** | Full amortization | Actively paying down balance |

**Important:** Deferment saves money now but costs more long-term due to capitalized interest.

## How the Optimizer Works

### Step 1: Determine Your Loan Universe

Based on your inputs, the system identifies:
- **Federal loans** you're eligible for (subsidized if checked, unsubsidized)
- **State loans** available in your state (NC Assist, FELS if eligible, etc.)
- **Private lenders** with rates for your credit tier

### Step 2: Year-by-Year Allocation

For each year remaining:

1. **Subsidized first** (if eligible - best option, no in-school interest)
   - Apply annual limit for your year level
   - Check against aggregate cap ($23k)

2. **Unsubsidized next**
   - If not eligible for subsidized: can borrow FULL annual limit as unsubsidized
   - If eligible for subsidized: borrow additional unsubsidized amount
   - Check against total federal aggregate

3. **State loans** (if eligible)
   - Apply state-specific limits (e.g., NC Assist $120k lifetime)
   - Skip FELS if not eligible

4. **Private loans** (fill remaining gap)
   - Choose best lender for your credit tier
   - Apply autopay/cosigner discounts
   - Match term to your payoff constraint

### Step 3: Calculate In-School Costs

For each loan segment:
- Calculate monthly interest accrual
- Apply your in-school payment preference
- Track capitalized interest at graduation

### Step 4: Generate Plan Variants

The optimizer creates multiple strategies:

| Strategy | Description | Best For |
|----------|-------------|----------|
| **Your Target** | Matches your payoff years constraint | Default choice |
| **Federal + State Only** | No private if it covers the gap | Lower risk tolerance |
| **Aggressive (5-year)** | Faster payoff, higher payments | High earners, min total cost |
| **Extended (15-year)** | Lower monthly, more interest | Budget-constrained grads |

### Step 5: Score and Rank

Plans are scored based on:
- Total cost (50% weight)
- Monthly payment (30% weight)
- Payoff time (20% weight)
- Penalty if exceeding max monthly payment constraint

## Verifying Your Setup

### Test the Backend

```bash
curl http://localhost:4000/api/health
# Should return: {"ok":true}

curl http://localhost:4000/api/loan-products
# Should return JSON with federal, state, private loan data
```

### Test the Optimizer

```bash
curl -X POST http://localhost:4000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "yearLevel": "freshman",
    "annualGap": 20000,
    "stateOfResidence": "NC",
    "dependencyStatus": "dependent",
    "eligibleForSubsidized": true,
    "eligibleForFELS": false,
    "annualIncome": 55000,
    "creditScoreRange": "good",
    "targetPayoffYears": 10
  }'
```

Should return a JSON response with `featured` and `options` arrays containing year-by-year plans.

## Updating Loan Data

Interest rates change annually (typically in July). Update `backend/src/data/loanProducts.js`:

```javascript
// Federal rates for 2024-25
const federal = [
  {
    id: "fed-subsidized",
    fixed_rate: 0.0653,  // Update this
    orig_fee: 0.01057,   // Update this
    // ...
  }
];
```

**Sources for updates:**
- Federal rates: [studentaid.gov/understand-aid/types/loans/interest-rates](https://studentaid.gov/understand-aid/types/loans/interest-rates)
- NC Assist: [cfnc.org](https://www.cfnc.org/pay-for-college/nc-assist-loans/)
- Private lenders: Check individual websites quarterly

## Troubleshooting

### "CORS Error" in browser console
- Make sure backend is running on port 4000
- Check that CORS middleware is enabled in server.js

### "Cannot connect to backend"
- Verify the backend is running: `curl localhost:4000/api/health`
- Check the API URL in frontend/index.html matches your backend

### "EADDRINUSE: address already in use"
- Another process is using port 4000
- Kill it: `kill -9 $(lsof -ti:4000)`
- Or change the port in server.js

### Wrong calculations
- Verify loan rate data is current
- Check that annual limits match year level
- Ensure aggregate limits aren't exceeded
- Verify eligibility checkboxes are set correctly

## Next Steps

1. Read [OPTIMIZATION.md](./OPTIMIZATION.md) for algorithm details
2. Customize loan products for your specific state
3. Add more private lenders to the catalog
