/**
 Loan Allocation & Optimization Engine
 * 
 * Strategy: Exhaust federal first (subsidized → unsubsidized → PLUS), then state, then private.
 * This minimizes long-term cost due to federal protections, lower rates, and IDR/forgiveness options.
 * 
 * The optimizer generates year-by-year plans respecting annual/aggregate caps,
 * then scores each plan by total cost or monthly payment per user preference.
 */

const { federal, state, privateLoans, YEAR_ORDER, nextYearLevel } = require("../data/loanProducts");
const { pmt, payoffYear, estTotalInterest } = require("../utils/finance");

const DEFAULT_TERM = 10;

// Annual federal limits for dependent undergrads (subsidized + unsubsidized combined)
const ANNUAL_FEDERAL_LIMITS_DEP = {
  freshman: 5500,  // $3,500 sub + $2,000 unsub
  sophomore: 6500, // $4,500 sub + $2,000 unsub
  junior: 7500,    // $5,500 sub + $2,000 unsub
  senior: 7500     // $5,500 sub + $2,000 unsub
};

// Annual federal limits for independent undergrads
const ANNUAL_FEDERAL_LIMITS_INDEP = {
  freshman: 9500,  // $3,500 sub + $6,000 unsub
  sophomore: 10500,// $4,500 sub + $6,000 unsub
  junior: 12500,   // $5,500 sub + $7,000 unsub
  senior: 12500    // $5,500 sub + $7,000 unsub
};

// Aggregate limits
const AGG_LIMIT_SUB = 23000;
const AGG_LIMIT_DEP = 31000;    // Total federal for dependent
const AGG_LIMIT_INDEP = 57500;  // Total federal for independent

/**
 * Get annual subsidy/unsub limits for a specific year
 * 
 * IMPORTANT: The unsubsidized limits stored in loanProducts.js are the ADDITIONAL
 * amounts on top of subsidized. The TOTAL annual limit = sub + unsub.
 * 
 * If not eligible for subsidized, user can borrow the FULL total as unsubsidized.
 */
function getAnnualLimits(depStatus, yearLevel) {
  const sub = federal[0].annual_limit_by_year_dep[yearLevel] || 0;
  const unsubAdditional = depStatus === "independent" 
    ? (federal[1].annual_limit_by_year_indep[yearLevel] || 0)
    : (federal[1].annual_limit_by_year_dep[yearLevel] || 0);
  const total = sub + unsubAdditional;
  return { sub, unsubAdditional, total };
}

/**
 * Calculate IDR payment
 */
function idrPayment(annualIncome, familySize = 1, pctDiscIncome = 0.05) {
  const povertyGuideline = 15060 + 5380 * (familySize - 1);
  const discretionary = Math.max(annualIncome - 2.25 * povertyGuideline, 0);
  return (discretionary * pctDiscIncome) / 12;
}

/**
 * Choose best private lender for given credit tier
 */
function chooseBestPrivateLender(creditTier, hasCosigner) {
  let bestLender = null;
  let bestRate = Infinity;
  
  for (const lender of privateLoans) {
    const range = lender.apr_range_by_credit[creditTier] || lender.apr_range_by_credit.fair;
    let rate = range[0]; 
    if (hasCosigner && lender.cosigner_discount) {
      rate = Math.max(rate - lender.cosigner_discount, 0.04);
    }
    if (lender.autopay_discount) {
      rate -= lender.autopay_discount;
    }
    if (rate < bestRate) {
      bestRate = rate;
      bestLender = lender;
    }
  }
  
  return { lender: bestLender, rate: bestRate };
}

/**
 * Get applicable state loans for a given state
 */
function getStateLoansForState(stateOfResidence) {
  return state.filter(s => s.state_required === stateOfResidence);
}

/**
 * Calculate segment interest (simple approximation)
 */
function calcSegmentInterest(amount, rate, termYears, subsidized, yearsInSchool, inSchoolMode) {
  const monthsInSchool = yearsInSchool * 12;
  const ratePerMonth = rate / 12;
  const nper = termYears * 12;
  
  // Subsidized loans: no in-school interest
  if (subsidized) {
    const payment = pmt(ratePerMonth, nper, amount);
    return estTotalInterest(payment, nper, amount);
  }
  
  // Calculate in-school interest accrual based on mode
  let accrued = 0;
  if (inSchoolMode === "full") {
    accrued = 0;
  } else if (inSchoolMode === "interest-only") {
    accrued = 0;
  } else if (inSchoolMode === "fixed-25") {
    const monthlyInterest = amount * ratePerMonth;
    accrued = Math.max(monthsInSchool * (monthlyInterest - 25), 0);
  } else { // defer
    accrued = amount * (Math.pow(1 + ratePerMonth, monthsInSchool) - 1);
  }
  
  const principalAtRepay = amount + accrued;
  const payment = pmt(ratePerMonth, nper, principalAtRepay);
  return accrued + estTotalInterest(payment, nper, principalAtRepay);
}

/**
 * Allocate loans for a single year
 */
function allocateYear(yearProfile, aggregateUsed, yearGap) {
  const {
    dependencyStatus,
    yearLevel,
    stateOfResidence,
    creditScoreRange,
    cosigner,
    inSchoolPayment,
    yearsRemaining,
    eligibleForSubsidized = true, 
    eligibleForFELS = false,
    targetPayoffYears = 10 // Use constraint if provided
  } = yearProfile;
  
  // Use the target payoff years as the loan term
  const loanTerm = targetPayoffYears || DEFAULT_TERM;
  
  const segments = [];
  let remaining = yearGap;
  const isIndep = dependencyStatus === "independent";
  
  // Track what we've used
  let { fedSubUsed = 0, fedUnsubUsed = 0, fedTotalUsed = 0, stateUsed = {} } = aggregateUsed;
  
  // Get limits for this year
  const limits = getAnnualLimits(dependencyStatus, yearLevel);
  const aggLimit = isIndep ? AGG_LIMIT_INDEP : AGG_LIMIT_DEP;
  
  // 1. FEDERAL SUBSIDIZED (best option - no in-school interest)
  // Only allocate if eligible for subsidized loans (based on FAFSA financial need)
  let subBorrowed = 0;
  if (eligibleForSubsidized) {
    const subAnnualLimit = limits.sub;
    const subAggRemaining = AGG_LIMIT_SUB - fedSubUsed;
    const subAvailable = Math.min(subAnnualLimit, subAggRemaining, remaining);
    
    if (subAvailable > 0) {
      const sub = federal[0];
      segments.push({
        productId: sub.id,
        name: sub.name,
        type: "federal",
        subsidized: true,
        amount: subAvailable,
        rate: sub.fixed_rate,
        origFee: sub.orig_fee,
        termYears: loanTerm,
        inSchoolInterest: false
      });
      remaining -= subAvailable;
      subBorrowed = subAvailable;
      fedSubUsed += subAvailable;
      fedTotalUsed += subAvailable;
    }
  }
  
  // 2. FEDERAL UNSUBSIDIZED
  // If eligible for subsidized: can borrow additional unsubsidized amount
  // If NOT eligible for subsidized: can borrow FULL annual limit as unsubsidized
  // Either way, limited by what's left of the total aggregate limit
  let unsubAnnualLimit;
  if (eligibleForSubsidized) {
    // Already borrowed subsidized, can only borrow the additional unsubsidized portion
    unsubAnnualLimit = limits.unsubAdditional;
  } else {
    // Not eligible for subsidized - can borrow the FULL annual limit as unsubsidized
    unsubAnnualLimit = limits.total;
  }
  
  const unsubAggRemaining = aggLimit - fedTotalUsed;
  const unsubAvailable = Math.min(unsubAnnualLimit, unsubAggRemaining, remaining);
  
  if (unsubAvailable > 0) {
    const unsub = federal[1];
    segments.push({
      productId: unsub.id,
      name: unsub.name,
      type: "federal",
      subsidized: false,
      amount: unsubAvailable,
      rate: unsub.fixed_rate,
      origFee: unsub.orig_fee,
      termYears: loanTerm,
      inSchoolInterest: true
    });
    remaining -= unsubAvailable;
    fedUnsubUsed += unsubAvailable;
    fedTotalUsed += unsubAvailable;
  }
  
  // 3. STATE LOANS (if available and eligible)
  const stateLoans = getStateLoansForState(stateOfResidence);
  for (const sl of stateLoans) {
    if (remaining <= 0) break;
    
    // Skip FELS if not eligible (requires specific qualifying programs)
    if (sl.id === "fels" && !eligibleForFELS) {
      continue;
    }
    
    const stateId = sl.id;
    const stateAggUsed = stateUsed[stateId] || 0;
    const stateAggRemaining = (sl.agg_limit || Infinity) - stateAggUsed;
    const stateAnnualLimit = sl.annual_limit || Infinity;
    const stateAvailable = Math.min(stateAnnualLimit, stateAggRemaining, remaining);
    
    if (stateAvailable > 0) {
      // Use target payoff years if it's available in the state loan's term options, otherwise closest available
      let stateTerm = loanTerm;
      if (sl.term_options && sl.term_options.length > 0) {
        // Find the closest available term to the target
        stateTerm = sl.term_options.reduce((prev, curr) => 
          Math.abs(curr - loanTerm) < Math.abs(prev - loanTerm) ? curr : prev
        );
      }
      
      segments.push({
        productId: sl.id,
        name: sl.name,
        type: "state",
        subsidized: sl.fixed_rate === 0,
        amount: stateAvailable,
        rate: Array.isArray(sl.fixed_rate_range) ? sl.fixed_rate_range[0] : (sl.fixed_rate || 0.06),
        origFee: sl.orig_fee || 0,
        termYears: stateTerm,
        inSchoolInterest: !sl.forgiveness,
        forgiveness: sl.forgiveness || false,
        url: sl.url
      });
      remaining -= stateAvailable;
      stateUsed[stateId] = stateAggUsed + stateAvailable;
    }
  }
  
  // 4. PRIVATE LOANS (fill remaining gap)
  if (remaining > 0) {
    const { lender, rate } = chooseBestPrivateLender(creditScoreRange, cosigner);
    if (lender) {
      // Find closest available term to target payoff years
      let privateTerm = loanTerm;
      if (lender.term_options && lender.term_options.length > 0) {
        privateTerm = lender.term_options.reduce((prev, curr) => 
          Math.abs(curr - loanTerm) < Math.abs(prev - loanTerm) ? curr : prev
        );
      }
      
      segments.push({
        productId: lender.id,
        name: `${lender.lender} Private`,
        type: "private",
        subsidized: false,
        amount: remaining,
        rate: rate,
        origFee: lender.orig_fee || 0,
        termYears: privateTerm,
        inSchoolInterest: true,
        url: lender.url
      });
      remaining = 0;
    }
  }
  
  return {
    segments,
    uncovered: remaining,
    newAggregateUsed: {
      fedSubUsed,
      fedUnsubUsed,
      fedTotalUsed,
      stateUsed
    }
  };
}

/**
 * Generate multi-year loan plan
 */
function generateMultiYearPlan(profile) {
  const {
    yearLevel,
    yearsRemaining,
    annualGap,
    tuitionGrowthRate = 0.07,
    dependencyStatus,
    stateOfResidence,
    creditScoreRange,
    cosigner,
    inSchoolPayment
  } = profile;
  
  const years = Math.min(yearsRemaining, 4);
  const yearPlan = [];
  let aggregateUsed = { fedSubUsed: 0, fedUnsubUsed: 0, fedTotalUsed: 0, stateUsed: {} };
  let currentYear = yearLevel;
  
  for (let i = 0; i < years; i++) {
    // Calculate gap for this year with tuition growth
    const yearGap = annualGap * Math.pow(1 + tuitionGrowthRate, i);
    
    const yearProfile = {
      ...profile,
      yearLevel: currentYear,
      yearsRemaining: years - i
    };
    
    const { segments, uncovered, newAggregateUsed } = allocateYear(
      yearProfile,
      aggregateUsed,
      yearGap
    );
    
    // Calculate totals for this year
    const yearTotal = segments.reduce((sum, s) => sum + s.amount, 0);
    const yearFederal = segments.filter(s => s.type === "federal").reduce((sum, s) => sum + s.amount, 0);
    const yearState = segments.filter(s => s.type === "state").reduce((sum, s) => sum + s.amount, 0);
    const yearPrivate = segments.filter(s => s.type === "private").reduce((sum, s) => sum + s.amount, 0);
    
    yearPlan.push({
      year: i + 1,
      yearLevel: currentYear,
      gap: Math.round(yearGap),
      funded: Math.round(yearTotal),
      uncovered: Math.round(uncovered),
      segments,
      breakdown: {
        federal: Math.round(yearFederal),
        state: Math.round(yearState),
        private: Math.round(yearPrivate)
      }
    });
    
    aggregateUsed = newAggregateUsed;
    currentYear = nextYearLevel(currentYear);
    if (!currentYear) break;
  }
  
  return yearPlan;
}

/**
 * Calculate in-school payment and accrued interest for a segment
 */
function calcInSchoolDetails(amount, rate, subsidized, monthsInSchool, inSchoolMode) {
  const ratePerMonth = rate / 12;
  const monthlyInterest = amount * ratePerMonth;
  
  // Subsidized loans: government pays interest while in school
  if (subsidized) {
    return { monthlyPayment: 0, totalPaid: 0, accruedInterest: 0 };
  }
  
  if (inSchoolMode === "full") {
    // Full payment: pay principal + interest monthly (like a normal amortization)
    // Simplified: just pay the interest to keep balance flat
    return { 
      monthlyPayment: Math.round(monthlyInterest), 
      totalPaid: Math.round(monthlyInterest * monthsInSchool),
      accruedInterest: 0 
    };
  } else if (inSchoolMode === "interest-only") {
    // Interest only: pay just the interest each month
    return { 
      monthlyPayment: Math.round(monthlyInterest), 
      totalPaid: Math.round(monthlyInterest * monthsInSchool),
      accruedInterest: 0 
    };
  } else if (inSchoolMode === "fixed-25") {
    // Fixed $25/month
    const unpaidInterest = Math.max(monthlyInterest - 25, 0);
    const accrued = unpaidInterest * monthsInSchool; // Simplified accrual
    return { 
      monthlyPayment: 25, 
      totalPaid: 25 * monthsInSchool,
      accruedInterest: Math.round(accrued)
    };
  } else { // defer
    // Full deferment: no payments, interest capitalizes
    const accrued = amount * (Math.pow(1 + ratePerMonth, monthsInSchool) - 1);
    return { 
      monthlyPayment: 0, 
      totalPaid: 0,
      accruedInterest: Math.round(accrued)
    };
  }
}

/**
 * Calculate plan summary statistics
 */
function calculatePlanSummary(yearPlan, profile) {
  const { annualIncome, familySize, inSchoolPayment, targetPayoffYears = 10 } = profile;
  
  // Flatten all segments
  const allSegments = yearPlan.flatMap(y => y.segments);
  
  // Calculate totals
  const totalPrincipal = allSegments.reduce((sum, s) => sum + s.amount, 0);
  const totalFederal = allSegments.filter(s => s.type === "federal").reduce((sum, s) => sum + s.amount, 0);
  const totalState = allSegments.filter(s => s.type === "state").reduce((sum, s) => sum + s.amount, 0);
  const totalPrivate = allSegments.filter(s => s.type === "private").reduce((sum, s) => sum + s.amount, 0);
  
  // Calculate weighted average rate (avoid division by zero)
  const weightedRate = totalPrincipal > 0 
    ? allSegments.reduce((sum, s) => sum + s.rate * s.amount, 0) / totalPrincipal 
    : 0;
  
  // Get the max term from all segments (determines actual payoff time)
  const maxTermYears = allSegments.length > 0 
    ? Math.max(...allSegments.map(s => s.termYears || 10))
    : targetPayoffYears;
  const nper = maxTermYears * 12;
  
  // Calculate in-school payment details
  const yearsInSchool = yearPlan.length;
  const monthsInSchool = yearsInSchool * 12;
  
  let totalInSchoolMonthly = 0;
  let totalInSchoolPaid = 0;
  let totalAccruedInterest = 0;
  
  for (const seg of allSegments) {
    // Each loan only accrues for the time from when it was taken until graduation
    // Approximate: use average time (half the school period for simplicity)
    const segMonthsInSchool = monthsInSchool / 2; // Average time in school for all loans
    const details = calcInSchoolDetails(
      seg.amount, 
      seg.rate, 
      seg.subsidized, 
      segMonthsInSchool, 
      inSchoolPayment
    );
    totalInSchoolMonthly += details.monthlyPayment;
    totalInSchoolPaid += details.totalPaid;
    totalAccruedInterest += details.accruedInterest;
  }
  
  // Calculate monthly payment based on actual loan terms (after graduation)
  // Account for capitalized interest increasing the principal
  let totalMonthlyPayment = 0;
  for (const seg of allSegments) {
    const segMonthsInSchool = monthsInSchool / 2;
    const details = calcInSchoolDetails(seg.amount, seg.rate, seg.subsidized, segMonthsInSchool, inSchoolPayment);
    const principalAtRepay = seg.amount + details.accruedInterest;
    
    const segNper = (seg.termYears || 10) * 12;
    const segRate = seg.rate / 12;
    totalMonthlyPayment += pmt(segRate, segNper, principalAtRepay);
  }
  
  // Calculate IDR payment (for federal portion only)
  const idr = idrPayment(annualIncome, familySize, 0.05);
  const federalNper = maxTermYears * 12;
  const federalPayment = pmt(federal[0].fixed_rate / 12, federalNper, totalFederal);
  const privateStatePayment = pmt(weightedRate / 12, federalNper, totalState + totalPrivate);
  const idrTotalPayment = Math.min(federalPayment, idr) + privateStatePayment;
  
  // Calculate total interest (in-school + repayment phase)
  let totalInterest = 0;
  for (const seg of allSegments) {
    const interest = calcSegmentInterest(
      seg.amount,
      seg.rate,
      seg.termYears,
      seg.subsidized,
      yearsInSchool,
      inSchoolPayment
    );
    totalInterest += interest;
  }
  
  // Calculate total cost (includes in-school payments)
  const totalCost = totalPrincipal + totalInterest;
  
  return {
    totalPrincipal: Math.round(totalPrincipal),
    totalFederal: Math.round(totalFederal),
    totalState: Math.round(totalState),
    totalPrivate: Math.round(totalPrivate),
    weightedRate: Number((weightedRate * 100).toFixed(2)),
    standardPayment: Math.round(totalMonthlyPayment) || 0,
    idrPayment: Math.round(idrTotalPayment) || 0,
    totalInterest: Math.round(totalInterest) || 0,
    totalCost: Math.round(totalCost) || 0,
    payoffYears: maxTermYears,
    payoffYear: new Date().getFullYear() + yearsInSchool + maxTermYears,
    federalPct: totalPrincipal > 0 ? Math.round((totalFederal / totalPrincipal) * 100) : 0,
    statePct: totalPrincipal > 0 ? Math.round((totalState / totalPrincipal) * 100) : 0,
    privatePct: totalPrincipal > 0 ? Math.round((totalPrivate / totalPrincipal) * 100) : 0,
    // In-school payment details
    inSchoolPaymentMode: inSchoolPayment,
    inSchoolMonthlyPayment: Math.round(totalInSchoolMonthly) || 0,
    inSchoolTotalPaid: Math.round(totalInSchoolPaid) || 0,
    accruedInterest: Math.round(totalAccruedInterest) || 0,
    yearsInSchool: yearsInSchool
  };
}

/**
 * Score a plan based on user constraints
 * Lower score = better plan
 */
function scorePlan(summary, profile) {
  const { maxMonthlyPayment, targetPayoffYears } = profile;
  
  // Normalize factors (lower is better)
  const costScore = summary.totalCost / 100000; // Normalize by $100k
  const paymentScore = summary.standardPayment / 1000; // Normalize by $1000
  const yearScore = summary.payoffYears / 20; // Normalize by 20 years
  
  // If maxMonthlyPayment is set, penalize plans that exceed it
  let budgetPenalty = 0;
  if (maxMonthlyPayment && summary.standardPayment > maxMonthlyPayment) {
    budgetPenalty = (summary.standardPayment - maxMonthlyPayment) / maxMonthlyPayment * 2;
  }
  
  // If targetPayoffYears is set, penalize plans that don't match
  let termPenalty = 0;
  if (targetPayoffYears && summary.payoffYears !== targetPayoffYears) {
    termPenalty = Math.abs(summary.payoffYears - targetPayoffYears) / 10;
  }
  
  // Balanced scoring: prioritize total cost but consider payment and term
  return 0.5 * costScore + 0.3 * paymentScore + 0.2 * yearScore + budgetPenalty + termPenalty;
}

/**
 * Create a unique key for a plan based on its financial metrics
 */
function getPlanKey(summary) {
  return `${summary.standardPayment}-${summary.totalCost}-${summary.totalInterest}-${summary.payoffYears}-${summary.federalPct}-${summary.privatePct}`;
}

/**
 * Generate multiple plan variants and return best options
 */
function scenarios(profile) {
  const allPlans = [];
  const { targetPayoffYears = 10, maxMonthlyPayment } = profile;
  
  // If maxMonthlyPayment is set, calculate what term would be needed
  // This is a rough estimate - we'll refine based on actual allocation
  let effectiveTargetYears = targetPayoffYears;
  
  // Variant 1: Plan with user's target payoff years
  const standardPlan = generateMultiYearPlan({ ...profile, targetPayoffYears: effectiveTargetYears });
  const standardSummary = calculatePlanSummary(standardPlan, { ...profile, targetPayoffYears: effectiveTargetYears });
  
  // Check if we need to extend terms to meet maxMonthlyPayment constraint
  if (maxMonthlyPayment && standardSummary.standardPayment > maxMonthlyPayment) {
    // Try longer terms until payment is under budget
    for (const tryYears of [10, 15, 20, 25]) {
      if (tryYears <= effectiveTargetYears) continue;
      const tryPlan = generateMultiYearPlan({ ...profile, targetPayoffYears: tryYears });
      const trySummary = calculatePlanSummary(tryPlan, { ...profile, targetPayoffYears: tryYears });
      if (trySummary.standardPayment <= maxMonthlyPayment) {
        effectiveTargetYears = tryYears;
        break;
      }
    }
  }
  
  // Generate the main plan with the effective target years
  const mainPlan = generateMultiYearPlan({ ...profile, targetPayoffYears: effectiveTargetYears });
  const mainSummary = calculatePlanSummary(mainPlan, { ...profile, targetPayoffYears: effectiveTargetYears });
  
  const termLabel = effectiveTargetYears === targetPayoffYears 
    ? `${effectiveTargetYears}-Year Payoff` 
    : `${effectiveTargetYears}-Year Payoff (extended to meet $${maxMonthlyPayment}/mo budget)`;
  
  allPlans.push({
    label: `Recommended: ${termLabel}`,
    description: `Federal first strategy with ${effectiveTargetYears}-year repayment term`,
    yearPlan: mainPlan,
    summary: mainSummary,
    repaymentPlan: "standard",
    score: scorePlan(mainSummary, profile)
  });
  
  // Variant 2: Federal + State only (no private)
  const federalStatePlan = generateMultiYearPlan({ ...profile, creditScoreRange: "none", targetPayoffYears: effectiveTargetYears });
  const federalStateSummary = calculatePlanSummary(federalStatePlan, { ...profile, targetPayoffYears: effectiveTargetYears });
  if (federalStatePlan.every(y => y.uncovered === 0)) {
    allPlans.push({
      label: "Federal + State Only",
      description: "Uses only federal and state loans if they cover the full gap",
      yearPlan: federalStatePlan,
      summary: federalStateSummary,
      repaymentPlan: "standard",
      score: scorePlan(federalStateSummary, profile)
    });
  }
  
  // Check if there are any private loans in the standard plan
  const hasPrivateLoans = mainPlan.some(y => y.segments.some(s => s.type === "private"));
  
  // Only add term variants if different from selected and private loans exist
  if (hasPrivateLoans) {
    // Variant 3: Aggressive payoff (5-year) - only if not already at 5 years
    if (effectiveTargetYears > 5) {
      const aggressivePlan = generateMultiYearPlan({ ...profile, targetPayoffYears: 5 });
      const aggressiveSummary = calculatePlanSummary(aggressivePlan, { ...profile, targetPayoffYears: 5 });
      allPlans.push({
        label: "Aggressive Payoff (5-year)",
        description: "Faster payoff = higher monthly payment but much less total interest",
        yearPlan: aggressivePlan,
        summary: aggressiveSummary,
        repaymentPlan: "aggressive",
        score: scorePlan(aggressiveSummary, { ...profile, paymentPriority: "min-cost" })
      });
    }
    
    // Variant 4: Extended payoff (15-year) - only if not already at 15+ years
    if (effectiveTargetYears < 15) {
      const extendedPlan = generateMultiYearPlan({ ...profile, targetPayoffYears: 15 });
      const extendedSummary = calculatePlanSummary(extendedPlan, { ...profile, targetPayoffYears: 15 });
      allPlans.push({
        label: "Extended Payoff (15-year)",
        description: "Lower monthly payment but more total interest over time",
        yearPlan: extendedPlan,
        summary: extendedSummary,
        repaymentPlan: "extended",
        score: scorePlan(extendedSummary, { ...profile, paymentPriority: "min-payment" })
      });
    }
    
    // Variant 5: Maximum extension (20-year) - only if not already there
    if (effectiveTargetYears < 20 && !maxMonthlyPayment) {
      const maxExtendedPlan = generateMultiYearPlan({ ...profile, targetPayoffYears: 20 });
      const maxExtendedSummary = calculatePlanSummary(maxExtendedPlan, { ...profile, targetPayoffYears: 20 });
      allPlans.push({
        label: "Minimum Payment (20-year)",
        description: "Lowest possible monthly payment, maximum interest",
        yearPlan: maxExtendedPlan,
        summary: maxExtendedSummary,
        repaymentPlan: "minimum",
        score: scorePlan(maxExtendedSummary, { ...profile, paymentPriority: "min-payment" })
      });
    }
  }
  
  // Deduplicate plans with identical financial outcomes
  const seen = new Set();
  const plans = allPlans.filter(plan => {
    const key = getPlanKey(plan.summary);
    if (seen.has(key)) {
      return false; // Skip duplicate
    }
    seen.add(key);
    return true;
  });
  
  // Sort by score (lower is better)
  plans.sort((a, b) => a.score - b.score);
  
  // Mark top options (up to 2, but only if we have that many unique plans)
  const featured = plans.slice(0, Math.min(2, plans.length));
  
  // Calculate total requested gap including tuition growth
  const tuitionGrowth = profile.tuitionGrowthRate || 0;
  let totalRequestedGap = 0;
  for (let i = 0; i < profile.yearsRemaining; i++) {
    totalRequestedGap += profile.annualGap * Math.pow(1 + tuitionGrowth, i);
  }
  
  return {
    featured,
    options: plans,
    requestedGap: Math.round(totalRequestedGap),
    totalYears: profile.yearsRemaining
  };
}

/**
 * Single-year allocation (for simple queries)
 */
function allocate(profile) {
  const yearPlan = generateMultiYearPlan(profile);
  const summary = calculatePlanSummary(yearPlan, profile);
  
  // Calculate total requested gap including tuition growth
  const tuitionGrowth = profile.tuitionGrowthRate || 0;
  let totalRequestedGap = 0;
  for (let i = 0; i < profile.yearsRemaining; i++) {
    totalRequestedGap += profile.annualGap * Math.pow(1 + tuitionGrowth, i);
  }
  
  return {
    yearPlan,
    summary,
    requestedGap: Math.round(totalRequestedGap)
  };
}

module.exports = { allocate, scenarios, idrPayment, generateMultiYearPlan, calculatePlanSummary };
