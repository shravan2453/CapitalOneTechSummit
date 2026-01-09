// Static loan catalog - 2024-25 rates (update annually)
// Sources: 
//   Federal: https://studentaid.gov/understand-aid/types/loans
//   NC Assist: https://www.cfnc.org/pay-for-college/nc-assist-loans/

export const federal = [
  {
    id: "fed-subsidized",
    type: "federal",
    name: "Direct Subsidized",
    url: "https://studentaid.gov/understand-aid/types/loans/subsidized-unsubsidized",
    subsidized: true,
    fixed_rate: 0.0653,
    orig_fee: 0.01057, 
    grace_period_months: 6,
    term_years_default: 10,
    annual_limit_by_year_dep: { freshman: 3500, sophomore: 4500, junior: 5500, senior: 5500 },
    annual_limit_by_year_indep: { freshman: 3500, sophomore: 4500, junior: 5500, senior: 5500 },
    agg_limit_dep: 23000,
    agg_limit_indep: 23000,
    in_school_interest: false,
    repayment_plans: ["standard", "graduated", "extended", "SAVE", "IBR", "PAYE"],
    idr_overlays: [
      { plan: "SAVE", pct_disc_income: 0.05, forgiveness_years: 20, interest_subsidy: true },
      { plan: "IBR", pct_disc_income: 0.10, forgiveness_years: 20 },
      { plan: "PAYE", pct_disc_income: 0.10, forgiveness_years: 20 }
    ]
  },
  {
    id: "fed-unsubsidized",
    type: "federal",
    name: "Direct Unsubsidized",
    url: "https://studentaid.gov/understand-aid/types/loans/subsidized-unsubsidized",
    subsidized: false,
    fixed_rate: 0.0653,
    orig_fee: 0.01057,
    grace_period_months: 6,
    term_years_default: 10,
    annual_limit_by_year_dep: { freshman: 2000, sophomore: 2000, junior: 2000, senior: 2000 },
    annual_limit_by_year_indep: { freshman: 6000, sophomore: 6000, junior: 7000, senior: 7000 },
    agg_limit_dep: 31000,   
    agg_limit_indep: 57500, 
    in_school_interest: true, 
    repayment_plans: ["standard", "graduated", "extended", "SAVE", "IBR", "PAYE"],
    idr_overlays: [
      { plan: "SAVE", pct_disc_income: 0.05, forgiveness_years: 20, interest_subsidy: true },
      { plan: "IBR", pct_disc_income: 0.10, forgiveness_years: 20 },
      { plan: "PAYE", pct_disc_income: 0.10, forgiveness_years: 20 }
    ]
  },
  {
    id: "parent-plus",
    type: "federal",
    name: "Parent PLUS",
    url: "https://studentaid.gov/understand-aid/types/loans/plus",
    subsidized: false,
    fixed_rate: 0.0908,
    orig_fee: 0.04228,
    grace_period_months: 6,
    term_years_default: 10,
    up_to_gap: true, 
    requires_credit_check: true,
    in_school_interest: true,
    repayment_plans: ["standard", "graduated", "extended", "ICR"],
    note: "Parent is borrower; requires no adverse credit history"
  }
];

export const state = [
  {
    id: "nc-assist-student",
    type: "state",
    name: "NC Student Assist Loan",
    url: "https://www.cfnc.org/pay-for-college/nc-assist-loans/",
    state_required: "NC",
    fixed_rate: 0.0775,
    autopay_discount: 0.0025,
    term_options: [5, 7, 10, 15], // Can pay off early without penalty
    orig_fee: 0.0, 
    grace_period_months: 6,
    annual_limit: null,
    up_to_coa: true,
    agg_limit: 120000, 
    in_school_interest: true,
    in_school_options: ["defer", "interest-only", "fixed-25", "full"],
    repayment_plans: ["standard"],
    eligibility: "NC resident OR attending eligible NC school, enrolled at least half-time",
    note: "No fees, competitive fixed rate, no prepayment penalty"
  },
  {
    id: "nc-assist-parent",
    type: "state",
    name: "NC Parent Assist Loan",
    url: "https://www.cfnc.org/pay-for-college/nc-assist-loans/",
    state_required: "NC",
    fixed_rate: 0.0695, 
    autopay_discount: 0.0025,
    term_options: [5, 7, 10, 15], // Can pay off early without penalty
    orig_fee: 0.0,
    grace_period_months: 6,
    up_to_coa: true,
    agg_limit: 120000,
    is_parent_loan: true,
    eligibility: "Parent of NC resident OR student attending eligible NC school",
    note: "Lower rate than federal Parent PLUS, no fees, no prepayment penalty"
  },
  {
    id: "fels",
    type: "state",
    name: "NC FELS (Forgivable Education Loans)",
    url: "https://www.cfnc.org/pay-for-college/grants-scholarships/fels/",
    state_required: "NC",
    fixed_rate: 0.0, 
    term_options: [5, 7, 10], // Typically forgiven, but can repay if needed
    orig_fee: 0.0,
    grace_period_months: 6,
    annual_limit: 8500,
    agg_limit: 34000,
    forgiveness: true,
    forgiveness_note: "Forgiven if you work in qualifying NC occupation (teaching, nursing, allied health, social work)",
    eligibility: "NC resident pursuing qualifying degree in critical shortage field",
    programs: ["Teaching", "Nursing", "Allied Health", "Social Work"]
  },
  {
    id: "ca-dream",
    type: "state",
    name: "California Dream Loan",
    url: "https://www.csac.ca.gov/california-dream-act",
    state_required: "CA",
    fixed_rate: 0.055,
    term_options: [5, 7, 10], // No prepayment penalty
    orig_fee: 0.0,
    grace_period_months: 6,
    annual_limit: 4000,
    agg_limit: 20000,
    eligibility: "CA Dream Act eligible students (AB 540)"
  },
  {
    id: "ny-hesc",
    type: "state",
    name: "NY HESC Loan",
    url: "https://www.hesc.ny.gov",
    state_required: "NY",
    fixed_rate: 0.06,
    term_options: [5, 7, 10, 15], // No prepayment penalty
    orig_fee: 0.0,
    grace_period_months: 6,
    annual_limit: 10000,
    agg_limit: 60000,
    eligibility: "NY resident attending eligible NY school"
  }
];

export const privateLoans = [
  {
    id: "sallie-mae",
    type: "private",
    lender: "Sallie Mae",
    url: "https://www.salliemae.com/student-loans/undergraduate-student-loans/",
    apr_range_by_credit: {
      poor: [0.1299, 0.1699],    
      fair: [0.0999, 0.1399],    
      good: [0.0699, 0.1199],  
      excellent: [0.0499, 0.0999] 
    },
    fixed_available: true,
    variable_available: true,
    term_options: [5, 7, 10, 15],
    orig_fee: 0.0,
    autopay_discount: 0.0025,
    cosigner_release_years: 2,
    in_school_options: ["defer", "interest-only", "fixed-25", "full"],
    min_loan: 1000,
    max_loan: null, 
    rewards: "1% graduation reward (principal cash back)"
  },
  {
    id: "sofi",
    type: "private",
    lender: "SoFi",
    url: "https://www.sofi.com/private-student-loans/",
    apr_range_by_credit: {
      poor: [0.1349, 0.1749],
      fair: [0.1049, 0.1449],
      good: [0.0699, 0.1149],
      excellent: [0.0499, 0.0949]
    },
    fixed_available: true,
    variable_available: true,
    term_options: [5, 7, 10, 15],
    orig_fee: 0.0,
    autopay_discount: 0.0025,
    cosigner_release_years: 2,
    in_school_options: ["defer", "interest-only", "fixed-25", "full"],
    min_loan: 5000,
    perks: "Career coaching, financial planning, member events"
  },
  {
    id: "college-ave",
    type: "private",
    lender: "College Ave",
    url: "https://www.collegeave.com/",
    apr_range_by_credit: {
      poor: [0.1399, 0.1799],
      fair: [0.1099, 0.1499],
      good: [0.0749, 0.1199],
      excellent: [0.0499, 0.0949]
    },
    fixed_available: true,
    variable_available: true,
    term_options: [5, 8, 10, 15],
    orig_fee: 0.0,
    autopay_discount: 0.0025,
    cosigner_release_years: 2,
    in_school_options: ["defer", "interest-only", "fixed-25", "full"],
    min_loan: 1000,
    perks: "Flexible terms, multi-year approval option"
  },
  {
    id: "discover",
    type: "private",
    lender: "Discover Student Loans",
    url: "https://www.discover.com/student-loans/",
    apr_range_by_credit: {
      poor: [0.1299, 0.1699],
      fair: [0.0999, 0.1399],
      good: [0.0749, 0.1199],
      excellent: [0.0549, 0.0999]
    },
    fixed_available: true,
    variable_available: true,
    term_options: [10, 15, 20],
    orig_fee: 0.0,
    autopay_discount: 0.0025,
    cosigner_release_years: 1, 
    in_school_options: ["defer", "interest-only", "fixed-25", "full"],
    min_loan: 1000,
    rewards: "1% good grades cash reward each year (3.0+ GPA)"
  },
  {
    id: "earnest",
    type: "private",
    lender: "Earnest",
    url: "https://www.earnest.com/student-loans",
    apr_range_by_credit: {
      poor: [0.1349, 0.1749],
      fair: [0.1049, 0.1449],
      good: [0.0699, 0.1149],
      excellent: [0.0489, 0.0899]
    },
    fixed_available: true,
    variable_available: true,
    term_options: [5, 7, 10, 12, 15],
    orig_fee: 0.0,
    autopay_discount: 0.0025,
    cosigner_release_years: 3,
    in_school_options: ["defer", "interest-only", "fixed-25", "full"],
    min_loan: 1000,
    perks: "Skip one payment per year, precision pricing"
  },
  {
    id: "citizens",
    type: "private",
    lender: "Citizens Bank",
    url: "https://www.citizensbank.com/student-loans/",
    apr_range_by_credit: {
      poor: [0.1299, 0.1699],
      fair: [0.0999, 0.1399],
      good: [0.0749, 0.1199],
      excellent: [0.0599, 0.0999]
    },
    fixed_available: true,
    variable_available: true,
    term_options: [5, 10, 15],
    orig_fee: 0.0,
    autopay_discount: 0.0025,
    loyalty_discount: 0.0025,
    cosigner_release_years: 3,
    in_school_options: ["defer", "interest-only", "full"],
    min_loan: 1000
  },
  {
    id: "elfi",
    type: "private",
    lender: "ELFI (Education Loan Finance)",
    url: "https://www.elfi.com/",
    apr_range_by_credit: {
      poor: [0.1349, 0.1749],
      fair: [0.1099, 0.1449],
      good: [0.0749, 0.1149],
      excellent: [0.0499, 0.0899]
    },
    fixed_available: true,
    variable_available: true,
    term_options: [5, 10, 15],
    orig_fee: 0.0,
    autopay_discount: 0.0025,
    cosigner_release_years: 2,
    in_school_options: ["defer", "interest-only", "fixed-25", "full"],
    min_loan: 1000,
    perks: "No fees, rate-match guarantee"
  }
];

export const YEAR_ORDER = ["freshman", "sophomore", "junior", "senior"];

export function nextYearLevel(current: string) {
  const idx = YEAR_ORDER.indexOf(current);
  return idx < YEAR_ORDER.length - 1 ? YEAR_ORDER[idx + 1] : null;
}

