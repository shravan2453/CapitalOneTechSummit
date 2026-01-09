# 📝 Input Fields for Student Loan Optimizer

This document explains all input fields, their purpose, and how they affect the optimized loan plan.

## Required Fields

| Field | Type | Description | Impact on Plan |
|-------|------|-------------|----------------|
| **Year Level** | Dropdown | Freshman/Sophomore/Junior/Senior | Determines federal annual limits and years remaining |
| **School Name** | Text | Your university name | Reference only |
| **State of Residence** | Dropdown | NC, CA, NY, TX, or Other | Determines state loan eligibility |
| **Dependency Status** | Dropdown | Dependent or Independent | Significantly affects federal limits |
| **Eligible for Subsidized** | Checkbox | Based on FAFSA financial need | If unchecked, can borrow full limit as unsubsidized |
| **Eligible for NC FELS** | Checkbox | NC residents in qualifying fields | If checked, includes forgivable FELS loans |
| **Annual Funding Gap** | Number | COA minus grants/scholarships | The amount to borrow each year |
| **Expected Starting Salary** | Number | Post-graduation annual income | Used for IDR payment calculations |
| **Credit Score Range** | Dropdown | Poor/Fair/Good/Excellent | Determines private loan APR |
| **Have a Cosigner?** | Dropdown | Yes/No | Can lower private loan rates by ~0.5-1% |

## Repayment Constraint (Choose One)

| Field | Type | Description | Impact on Plan |
|-------|------|-------------|----------------|
| **Optimize By** | Dropdown | Target Payoff Years OR Max Monthly Payment | Determines constraint mode |
| **Target Payoff Years** | Dropdown | 5/7/10/15/20 years | Sets loan terms to match this target |
| **Max Monthly Payment** | Number | e.g., $500 | System extends term until payment fits budget |

### How Constraints Work

**Target Payoff Years:**
- All loans set to closest available term (5, 7, 10, 15, or 20 years)
- Shorter term = higher monthly payment, less total interest
- Longer term = lower monthly payment, more total interest

**Max Monthly Payment:**
- System starts with 10-year term
- If payment exceeds budget, extends to 15, then 20 years
- Finds shortest term that keeps payment under your cap

## Optional Fields

| Field | Default | Description | Impact on Plan |
|-------|---------|-------------|----------------|
| **Family Size** | 1 | Number of people in household | Affects IDR payment calculations |
| **In-School Payment** | Defer | How you pay while in school | Affects interest accrual and total cost |
| **Tuition Growth Rate** | 7% | Annual increase in COA | Projects future year funding needs |

## In-School Payment Preference

This is **critical** for understanding your true loan cost:

| Option | Monthly Payment | Effect | Best For |
|--------|-----------------|--------|----------|
| **Full Deferment** | $0 | Interest capitalizes (adds to principal) | Tight budget during school |
| **Interest Only** | ~$30-50 per $10k borrowed | No balance growth | Moderate budget, want to minimize cost |
| **Fixed $25** | $25 flat | Partial interest coverage | Compromise option |
| **Full Payment** | Full amortization | Actively paying down balance | Extra income during school |

### Example Impact

For $50,000 in unsubsidized loans at 6.53%, 4 years in school:

| Option | In-School Cost | Capitalized Interest | Balance at Graduation |
|--------|----------------|---------------------|----------------------|
| Defer | $0 | ~$14,800 | ~$64,800 |
| Interest Only | ~$13,500 total | $0 | $50,000 |
| Fixed $25 | ~$1,200 total | ~$11,500 | ~$61,500 |

**Deferment saves money now but costs ~$5,000+ more over the life of the loan.**

## How Each Field Affects Your Plan

### Academic Fields

| Field | How It's Used |
|-------|---------------|
| Year Level | Selects correct federal annual limits; determines years remaining |
| School | Reference in output |
| State | Enables state-specific loans (NC Assist, FELS, CA Dream, NY HESC) |
| Dependency Status | Independent students get higher unsubsidized limits |

### Eligibility Checkboxes

| Checkbox | Effect When Checked | Effect When Unchecked |
|----------|--------------------|-----------------------|
| **Eligible for Subsidized** | Borrows subsidized first (no in-school interest) | Borrows full annual limit as unsubsidized |
| **Eligible for NC FELS** | Includes FELS loans (0% forgivable) | FELS excluded from plan |

### Financial Fields

| Field | How It's Used |
|-------|---------------|
| Annual Gap | Base amount to borrow; grows with tuition rate |
| Expected Salary | Calculates IDR payment estimate (SAVE plan) |
| Family Size | Affects poverty line calculation for IDR |

### Credit Fields

| Field | How It's Used |
|-------|---------------|
| Credit Score | Selects APR tier for private loans |
| Cosigner | Applies ~0.5% discount to private loan rates |

### Preference Fields

| Field | How It's Used |
|-------|---------------|
| In-School Payment | Calculates in-school costs and interest capitalization |
| Tuition Growth | Compounds annual gap for future years |
| Payoff Constraint | Sets loan terms; scores plan variants |

## Output Fields Explained

The optimizer returns these metrics for each plan:

### Summary Statistics

| Field | Description |
|-------|-------------|
| **Monthly Payment** | Post-graduation payment (all loans combined) |
| **Total Cost** | Principal + all interest (lifetime) |
| **Total Interest** | All interest paid over life of loans |
| **Repayment Term** | Longest loan term in the plan |
| **Paid Off By** | Year you'll be debt-free |
| **Avg Rate** | Weighted average interest rate |

### Loan Mix

| Field | Description |
|-------|-------------|
| **Federal %** | Percentage of total from federal loans |
| **State %** | Percentage from state loans |
| **Private %** | Percentage from private loans |

### In-School Details

| Field | Description |
|-------|-------------|
| **Payment Strategy** | Your selected in-school payment mode |
| **Monthly While in School** | What you pay each month during school |
| **Paid During School** | Total paid before graduation |
| **Interest Capitalized** | Interest added to principal at graduation |

### IDR Option (Federal Only)

| Field | Description |
|-------|-------------|
| **SAVE Plan Payment** | Estimated monthly under income-driven repayment |
| **Forgiveness** | Remaining balance forgiven after 20-25 years |

## Validation Rules

| Field | Rule |
|-------|------|
| Annual Gap | Must be > 0 |
| Expected Salary | Must be > 0 |
| Max Monthly Payment | Must be > 0 if selected |
| Tuition Growth | Can be 0 (no growth) or positive percentage |

## Tips for Best Results

1. **Be accurate with your funding gap** - include all costs (tuition, housing, books, living expenses) minus all grants/scholarships

2. **Consider your in-school payment carefully** - interest-only payments can save thousands over the loan lifetime

3. **Check subsidized eligibility** - if you're unsure, check your FAFSA results or ask your financial aid office

4. **NC residents** - if you're in teaching, nursing, allied health, or social work programs, check FELS eligibility

5. **Use a cosigner if available** - can significantly lower private loan rates

6. **Be realistic with your payoff constraint** - aggressive 5-year payoff requires high income after graduation
