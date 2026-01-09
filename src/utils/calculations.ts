// Loan Calculation Utilities

export interface LoanCalculation {
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  payoffDate: Date;
  amortizationSchedule: PaymentSchedule[];
}

export interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface ScenarioInput {
  loanAmount: number;
  interestRate: number;
  termYears: number;
  repaymentStrategy: string;
  extraPayment?: number;
  startDate: Date;
}

/**
 * Calculate monthly payment using standard amortization formula
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (annualRate === 0) {
    return principal / termMonths;
  }
  
  const monthlyRate = annualRate / 100 / 12;
  const payment = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  return payment;
}

/**
 * Calculate total cost with interest
 */
export function calculateTotalCost(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  return monthlyPayment * termMonths;
}

/**
 * Calculate total interest paid
 */
export function calculateTotalInterest(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  const totalCost = calculateTotalCost(principal, annualRate, termMonths);
  return totalCost - principal;
}

/**
 * Generate amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number = 0
): PaymentSchedule[] {
  const schedule: PaymentSchedule[] = [];
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  
  for (let month = 1; month <= termMonths && balance > 0.01; month++) {
    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    
    // Apply extra payment if provided
    if (extraPayment > 0) {
      principalPayment += extraPayment;
    }
    
    // Ensure we don't overpay
    if (principalPayment > balance) {
      principalPayment = balance;
    }
    
    balance -= principalPayment;
    
    schedule.push({
      month,
      payment: monthlyPayment + extraPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, balance)
    });
    
    // If balance is paid off early, break
    if (balance <= 0.01) {
      break;
    }
  }
  
  return schedule;
}

/**
 * Calculate scenario with different repayment strategies
 */
export function calculateScenario(input: ScenarioInput): LoanCalculation {
  const { loanAmount, interestRate, termYears, extraPayment = 0 } = input;
  const termMonths = termYears * 12;
  
  let monthlyPayment: number;
  let totalCost: number;
  let totalInterest: number;
  
  // Adjust calculations based on repayment strategy
  switch (input.repaymentStrategy) {
    case 'interest-only':
      // During school: interest only, after: standard
      const interestOnly = (loanAmount * interestRate / 100) / 12;
      const standardPayment = calculateMonthlyPayment(loanAmount, interestRate, termMonths);
      monthlyPayment = standardPayment; // After graduation
      totalCost = interestOnly * 48 + (standardPayment * (termMonths - 48)); // 4 years interest + standard
      totalInterest = totalCost - loanAmount;
      break;
      
    case 'defer':
      // Interest accrues during deferment
      const deferredMonths = 48; // 4 years
      const accruedInterest = loanAmount * (interestRate / 100) * (deferredMonths / 12);
      const newPrincipal = loanAmount + accruedInterest;
      monthlyPayment = calculateMonthlyPayment(newPrincipal, interestRate, termMonths);
      totalCost = monthlyPayment * termMonths;
      totalInterest = totalCost - loanAmount;
      break;
      
    case 'biweekly':
      // Biweekly payments (26 per year)
      const biweeklyRate = interestRate / 100 / 26;
      const biweeklyPayments = termYears * 26;
      monthlyPayment = (loanAmount * biweeklyRate * Math.pow(1 + biweeklyRate, biweeklyPayments)) /
        (Math.pow(1 + biweeklyRate, biweeklyPayments) - 1);
      totalCost = monthlyPayment * biweeklyPayments;
      totalInterest = totalCost - loanAmount;
      break;
      
    default: // Standard repayment
      monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, termMonths);
      totalCost = calculateTotalCost(loanAmount, interestRate, termMonths);
      totalInterest = calculateTotalInterest(loanAmount, interestRate, termMonths);
  }
  
  // Apply extra payments
  if (extraPayment > 0) {
    const schedule = generateAmortizationSchedule(loanAmount, interestRate, termMonths, extraPayment);
    totalCost = schedule.reduce((sum, payment) => sum + payment.payment, 0);
    totalInterest = totalCost - loanAmount;
    const actualMonths = schedule.length;
    monthlyPayment = totalCost / actualMonths;
  }
  
  const amortizationSchedule = generateAmortizationSchedule(
    loanAmount,
    interestRate,
    termMonths,
    extraPayment
  );
  
  const payoffDate = new Date(input.startDate);
  payoffDate.setMonth(payoffDate.getMonth() + amortizationSchedule.length);
  
  return {
    monthlyPayment,
    totalCost,
    totalInterest,
    payoffDate,
    amortizationSchedule
  };
}


// Calculate weighted average interest rate from loan mix

export function calculateWeightedAverageRate(
  loanMix: { loanId: string; amount: number }[],
  loans: Array<{ id: string; interestRate: { fixed?: number; range?: { min: number; max: number } } }>
): number {
  if (loanMix.length === 0) return 0;
  
  let totalAmount = 0;
  let weightedSum = 0;
  
  loanMix.forEach(({ loanId, amount }) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    
    let rate = 0;
    if (loan.interestRate.fixed) {
      rate = loan.interestRate.fixed;
    } else if (loan.interestRate.range) {
      // Use midpoint for range
      rate = (loan.interestRate.range.min + loan.interestRate.range.max) / 2;
    }
    
    weightedSum += rate * amount;
    totalAmount += amount;
  });
  
  return totalAmount > 0 ? weightedSum / totalAmount : 0;
}

// Calculate total loan amount from loan mix (after origination fees)

export function calculateTotalLoanAmount(
  loanMix: { loanId: string; amount: number }[],
  loans: Array<{ id: string; originationFee: number }>
): number {
  return loanMix.reduce((total, { loanId, amount }) => {
    const loan = loans.find(l => l.id === loanId);
    const fee = loan?.originationFee || 0;
    // Origination fee reduces the amount you receive
    const netAmount = amount * (1 - fee / 100);
    return total + netAmount;
  }, 0);
}

// Calculate scenario with loan mix (multiple loans)

export interface LoanMixScenarioInput {
  loanMix: { loanId: string; amount: number }[];
  loans: Array<{ 
    id: string; 
    interestRate: { fixed?: number; range?: { min: number; max: number } };
    originationFee: number;
  }>;
  termYears: number;
  repaymentStrategy: string;
  startDate: Date;
}

export function calculateLoanMixScenario(input: LoanMixScenarioInput): LoanCalculation {
  const { loanMix, loans, termYears, repaymentStrategy, startDate } = input;
  
  // Calculate weighted average interest rate
  const avgRate = calculateWeightedAverageRate(loanMix, loans);
  
  // Calculate total principal (after origination fees)
  const totalPrincipal = calculateTotalLoanAmount(loanMix, loans);
  
  // Use the standard scenario calculation with weighted average rate
  return calculateScenario({
    loanAmount: totalPrincipal,
    interestRate: avgRate,
    termYears,
    repaymentStrategy,
    startDate
  });
}

/**
 * Calculate income-driven repayment amount
 */
export function calculateIncomeDrivenPayment(
  discretionaryIncome: number,
  plan: 'ibr' | 'paye' | 'repaye' | 'save' | 'icr'
): number {
  const percentages = {
    ibr: 0.15, // Actually 10-15% depending on when borrowed
    paye: 0.10,
    repaye: 0.10,
    save: 0.10, // Actually 5-10% depending on loan type
    icr: 0.20
  };
  
  return discretionaryIncome * (percentages[plan] || 0.10);
}

/**
 * Calculate discretionary income (simplified)
 */
export function calculateDiscretionaryIncome(
  agi: number, // Adjusted Gross Income
  familySize: number,
  state: string
): number {
  // 2023-2024 poverty guidelines (simplified)
  const povertyGuideline = 14580 + (familySize - 1) * 5140;
  const discretionaryIncome = Math.max(0, agi - (1.5 * povertyGuideline));
  return discretionaryIncome;
}

/**
 * Optimize loan strategy based on weights
 */
export interface OptimizationWeights {
  totalCost: number; // 0-100
  monthlyPayment: number; // 0-100
  payoffSpeed: number; // 0-100
}

export interface OptimizedStrategy {
  strategy: string;
  loanMix: { loanId: string; amount: number }[];
  repaymentPlan: string;
  score: number;
  monthlyPayment: number;
  totalCost: number;
  payoffYears: number;
}

export function optimizeStrategy(
  loanAmount: number,
  availableLoans: string[],
  weights: OptimizationWeights,
  constraints: {
    maxMonthlyPayment?: number;
    targetPayoffYear?: number;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  }
): OptimizedStrategy[] {
  // Simplified optimization - in production, this would use more sophisticated algorithms
  const strategies: OptimizedStrategy[] = [];
  
  // Generate candidate strategies
  const candidates = [
    {
      name: 'Federal Only - Standard',
      loanMix: [{ loanId: 'direct-subsidized', amount: loanAmount * 0.4 }, { loanId: 'direct-unsubsidized', amount: loanAmount * 0.6 }],
      repaymentPlan: 'standard',
      risk: 'conservative' as const
    },
    {
      name: 'Federal + Private - Aggressive',
      loanMix: [{ loanId: 'direct-subsidized', amount: loanAmount * 0.3 }, { loanId: 'sallie-mae', amount: loanAmount * 0.7 }],
      repaymentPlan: 'interest-principal',
      risk: 'aggressive' as const
    },
    {
      name: 'Income-Driven - Flexible',
      loanMix: [{ loanId: 'direct-unsubsidized', amount: loanAmount }],
      repaymentPlan: 'save',
      risk: 'moderate' as const
    }
  ];
  
  // Calculate scores for each candidate
  candidates.forEach(candidate => {
    // Simplified calculation - would use actual loan data
    const avgRate = 6.0; // Simplified
    const calc = calculateScenario({
      loanAmount,
      interestRate: avgRate,
      termYears: 10,
      repaymentStrategy: candidate.repaymentPlan,
      startDate: new Date()
    });
    
    // Normalize scores (0-100 scale)
    const costScore = Math.max(0, 100 - (calc.totalCost / loanAmount - 1) * 50);
    const paymentScore = Math.max(0, 100 - (calc.monthlyPayment / 100) * 2);
    const speedScore = Math.max(0, 100 - (calc.amortizationSchedule.length / 120) * 100);
    
    // Weighted score
    const totalScore = 
      (costScore * weights.totalCost / 100) +
      (paymentScore * weights.monthlyPayment / 100) +
      (speedScore * weights.payoffSpeed / 100);
    
    strategies.push({
      strategy: candidate.name,
      loanMix: candidate.loanMix,
      repaymentPlan: candidate.repaymentPlan,
      score: totalScore,
      monthlyPayment: calc.monthlyPayment,
      totalCost: calc.totalCost,
      payoffYears: calc.amortizationSchedule.length / 12
    });
  });
  
  // Sort by score and return top 3
  return strategies
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
