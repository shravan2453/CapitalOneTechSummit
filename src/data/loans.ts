// Loan Database - Federal, Private, and State Loans

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

export const federalLoans: Loan[] = [
  {
    id: 'direct-subsidized',
    name: 'Direct Subsidized',
    type: 'federal',
    category: 'Undergraduate',
    interestRate: { fixed: 5.50 },
    originationFee: 1.057,
    loanLimit: { annual: 5500, total: 23000 },
    gracePeriod: 6,
    repaymentOptions: ['Standard', 'Graduated', 'Extended', 'Income-Driven'],
    eligibility: ['Undergraduate', 'Financial Need'],
    features: ['Interest paid by government while in school', 'No credit check']
  },
  {
    id: 'direct-unsubsidized',
    name: 'Direct Unsubsidized',
    type: 'federal',
    category: 'All Students',
    interestRate: { fixed: 5.50 },
    originationFee: 1.057,
    loanLimit: { annual: 20000, total: 138000 },
    gracePeriod: 6,
    repaymentOptions: ['Standard', 'Graduated', 'Extended', 'Income-Driven'],
    eligibility: ['All Students'],
    features: ['No financial need requirement', 'Interest accrues immediately']
  },
  {
    id: 'direct-plus',
    name: 'Direct PLUS',
    type: 'federal',
    category: 'Graduate/Professional',
    interestRate: { fixed: 8.05 },
    originationFee: 4.228,
    loanLimit: { annual: 0, total: 0 }, // Cost of attendance minus other aid
    gracePeriod: 6,
    repaymentOptions: ['Standard', 'Graduated', 'Extended', 'Income-Contingent'],
    eligibility: ['Graduate/Professional', 'Credit check required'],
    features: ['Covers cost of attendance', 'Higher interest rate']
  },
  {
    id: 'perkins',
    name: 'Perkins Loan',
    type: 'federal',
    category: 'Undergraduate/Graduate',
    interestRate: { fixed: 5.00 },
    originationFee: 0,
    loanLimit: { annual: 5500, total: 27500 },
    gracePeriod: 9,
    repaymentOptions: ['Standard', 'Extended'],
    eligibility: ['Exceptional Financial Need', 'School-specific'],
    features: ['Lowest federal rate', 'School-administered']
  }
];

export const privateLoans: Loan[] = [
  {
    id: 'sallie-mae',
    name: 'Sallie Mae',
    type: 'private',
    category: 'Undergraduate',
    interestRate: { range: { min: 4.50, max: 12.35 } },
    originationFee: 0,
    loanLimit: { annual: 0, total: 0 }, // School-certified amount
    gracePeriod: 6,
    repaymentOptions: ['Fixed', 'Variable', 'Interest-Only', 'Deferred'],
    eligibility: ['Credit check', 'Cosigner may be required'],
    features: ['Competitive rates', 'Multiple repayment options']
  },
  {
    id: 'discover',
    name: 'Discover Student Loans',
    type: 'private',
    category: 'All Students',
    interestRate: { range: { min: 4.99, max: 13.49 } },
    originationFee: 0,
    loanLimit: { annual: 0, total: 0 },
    gracePeriod: 6,
    repaymentOptions: ['Fixed', 'Variable', 'Interest-Only', 'Deferred'],
    eligibility: ['Credit check', 'Cosigner options available'],
    features: ['No fees', 'Rewards for good grades']
  },
  {
    id: 'citizens',
    name: 'Citizens Bank',
    type: 'private',
    category: 'All Students',
    interestRate: { range: { min: 4.24, max: 12.18 } },
    originationFee: 0,
    loanLimit: { annual: 0, total: 0 },
    gracePeriod: 6,
    repaymentOptions: ['Fixed', 'Variable', 'Interest-Only'],
    eligibility: ['Credit check', 'Cosigner may be required'],
    features: ['Multi-year approval', 'Loyalty discounts']
  }
];

export const stateLoans: Loan[] = [
  {
    id: 'cfnc',
    name: 'CFNC (College Foundation of North Carolina)',
    type: 'state',
    category: 'North Carolina Residents',
    interestRate: { fixed: 4.99 },
    originationFee: 0,
    loanLimit: { annual: 0, total: 0 },
    gracePeriod: 6,
    repaymentOptions: ['Standard', 'Extended', 'Income-Based'],
    eligibility: ['NC Resident', 'NC School'],
    features: ['State-specific benefits', 'Lower rates for residents']
  }
];

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
