// Loan Database - Federal, Private, and State Loans
import { federal as federalProducts, state as stateProducts, privateLoans as privateProducts } from './loanProducts';

export interface Loan {
  id: string;
  name: string;
  type: 'federal' | 'private' | 'state';
  category: string;
  interestRate: {
    fixed?: number;
    variable?: { min: number; max: number };
    range?: { min: number; max: number };
  };
  originationFee: number; // percentage
  loanLimit: {
    annual?: number;
    total?: number;
  };
  gracePeriod: number; // months
  repaymentOptions: string[];
  eligibility: string[];
  features: string[];
}

// Transform federal loans from loanProducts.js
export const federalLoans: Loan[] = federalProducts.map((loan: any) => {
  const maxAnnualLimit = loan.annual_limit_by_year_dep 
    ? Math.max(...Object.values(loan.annual_limit_by_year_dep) as number[])
    : loan.annual_limit_by_year_indep
    ? Math.max(...Object.values(loan.annual_limit_by_year_indep) as number[])
    : undefined;
  
  const maxAggLimit = loan.agg_limit_dep || loan.agg_limit_indep || undefined;
  
  const features: string[] = [];
  if (loan.subsidized) {
    features.push('Interest paid by government while in school');
  } else {
    features.push('Interest accrues immediately');
  }
  if (!loan.requires_credit_check) {
    features.push('No credit check');
  }
  if (loan.note) {
    features.push(loan.note);
  }

  const eligibility: string[] = [];
  if (loan.subsidized) {
    eligibility.push('Financial Need Required');
  } else {
    eligibility.push('All Students');
  }
  if (loan.requires_credit_check) {
    eligibility.push('Credit check required');
  }

  return {
    id: loan.id,
    name: loan.name,
    type: loan.type,
    category: loan.subsidized ? 'Undergraduate' : loan.id === 'parent-plus' ? 'Parent' : 'All Students',
    interestRate: { fixed: loan.fixed_rate ? loan.fixed_rate * 100 : undefined },
    originationFee: loan.orig_fee ? loan.orig_fee * 100 : 0,
    loanLimit: {
      annual: maxAnnualLimit,
      total: maxAggLimit
    },
    gracePeriod: loan.grace_period_months,
    repaymentOptions: loan.repayment_plans?.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')) || [],
    eligibility,
    features
  };
});

// Transform state loans from loanProducts.ts
export const stateLoans: Loan[] = stateProducts.map((loan: any) => {
  const features: string[] = [];
  if (loan.orig_fee === 0) {
    features.push('No origination fees');
  }
  if (loan.autopay_discount) {
    features.push(`${(loan.autopay_discount * 100).toFixed(2)}% autopay discount`);
  }
  if (loan.note) {
    features.push(loan.note);
  }
  if (loan.forgiveness) {
    features.push(loan.forgiveness_note || 'Eligible for forgiveness');
  }

  const eligibility: string[] = [];
  if (loan.state_required) {
    eligibility.push(`${loan.state_required} Resident`);
  }
  if (loan.eligibility) {
    eligibility.push(loan.eligibility);
  }

  return {
    id: loan.id,
    name: loan.name,
    type: loan.type,
    category: loan.state_required ? `${loan.state_required} Residents` : 'State-Specific',
    interestRate: { fixed: loan.fixed_rate ? loan.fixed_rate * 100 : undefined },
    originationFee: loan.orig_fee ? loan.orig_fee * 100 : 0,
    loanLimit: {
      annual: loan.annual_limit || undefined,
      total: loan.agg_limit || undefined
    },
    gracePeriod: loan.grace_period_months,
    repaymentOptions: loan.repayment_plans?.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')) || [],
    eligibility,
    features
  };
});

// Transform private loans from loanProducts.js
export const privateLoans: Loan[] = privateProducts.map((loan: any) => {
  // Calculate min and max rates from credit tiers
  let minRate = Infinity;
  let maxRate = -Infinity;
  
  if (loan.apr_range_by_credit) {
    Object.values(loan.apr_range_by_credit).forEach((range: any) => {
      if (Array.isArray(range) && range.length === 2) {
        minRate = Math.min(minRate, range[0] * 100);
        maxRate = Math.max(maxRate, range[1] * 100);
      }
    });
  }

  const features: string[] = [];
  if (loan.orig_fee === 0) {
    features.push('No origination fees');
  }
  if (loan.autopay_discount) {
    features.push(`${(loan.autopay_discount * 100).toFixed(2)}% autopay discount`);
  }
  if (loan.rewards) {
    features.push(loan.rewards);
  }
  if (loan.perks) {
    features.push(loan.perks);
  }
  if (loan.cosigner_release_years) {
    features.push(`Cosigner release after ${loan.cosigner_release_years} years`);
  }

  return {
    id: loan.id,
    name: loan.lender || loan.name,
    type: loan.type,
    category: 'All Students',
    interestRate: minRate !== Infinity && maxRate !== -Infinity 
      ? { range: { min: minRate, max: maxRate } }
      : {},
    originationFee: loan.orig_fee ? loan.orig_fee * 100 : 0,
    loanLimit: {
      annual: loan.annual_limit || undefined,
      total: loan.agg_limit || undefined
    },
    gracePeriod: loan.grace_period_months || 6,
    repaymentOptions: loan.in_school_options?.map((opt: string) => 
      opt.charAt(0).toUpperCase() + opt.slice(1).replace(/-/g, ' ')
    ) || ['Fixed', 'Variable'],
    eligibility: ['Credit check', loan.cosigner_release_years ? 'Cosigner options available' : ''],
    features: features.filter(f => f)
  };
});

export const incomeDrivenPlans = [
  {
    id: 'ibr',
    name: 'Income-Based Repayment (IBR)',
    description: '10% of discretionary income, capped at standard 10-year payment',
    eligibility: 'Financial hardship required',
    forgiveness: 'After 20-25 years'
  },
  {
    id: 'paye',
    name: 'Pay As You Earn (PAYE)',
    description: '10% of discretionary income, never more than standard payment',
    eligibility: 'New borrowers after 2007',
    forgiveness: 'After 20 years'
  },
  {
    id: 'repaye',
    name: 'REPAYE',
    description: '10% of discretionary income, no cap',
    eligibility: 'All Direct Loan borrowers',
    forgiveness: 'After 20-25 years'
  },
  {
    id: 'save',
    name: 'SAVE Plan',
    description: '5-10% of discretionary income, most generous plan',
    eligibility: 'All Direct Loan borrowers',
    forgiveness: 'After 20-25 years'
  },
  {
    id: 'icr',
    name: 'Income-Contingent Repayment (ICR)',
    description: '20% of discretionary income or 12-year fixed payment',
    eligibility: 'All Direct Loan borrowers',
    forgiveness: 'After 25 years'
  }
];

export const repaymentStrategies = [
  {
    id: 'defer',
    name: 'Full Deferment',
    description: 'No payments while in school, interest accrues',
    duringSchool: 'No payments',
    afterSchool: 'Standard repayment begins'
  },
  {
    id: 'interest-only',
    name: 'Interest Only',
    description: 'Pay interest while in school, principal after graduation',
    duringSchool: 'Interest payments only',
    afterSchool: 'Principal + interest'
  },
  {
    id: 'interest-principal',
    name: 'Interest + Principal',
    description: 'Pay both interest and principal while in school',
    duringSchool: 'Full payments',
    afterSchool: 'Reduced balance'
  },
  {
    id: 'standard',
    name: 'Standard 10-Year',
    description: 'Fixed monthly payments over 10 years',
    duringSchool: 'N/A',
    afterSchool: 'Fixed monthly payment'
  },
  {
    id: 'extended',
    name: 'Extended Repayment',
    description: 'Fixed or graduated payments over 25 years',
    duringSchool: 'N/A',
    afterSchool: 'Lower monthly, longer term'
  },
  {
    id: 'graduated',
    name: 'Graduated Repayment',
    description: 'Payments start low and increase every 2 years',
    duringSchool: 'N/A',
    afterSchool: 'Increasing payments'
  },
  {
    id: 'biweekly',
    name: 'Biweekly Payments',
    description: 'Make payments every two weeks instead of monthly',
    duringSchool: 'N/A',
    afterSchool: '26 payments per year'
  }
];

export const allLoans = [...federalLoans, ...privateLoans, ...stateLoans];
