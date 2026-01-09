import React, { useState } from 'react';
import { Card, PageHeader } from '../components/shared';
import { BookOpen, DollarSign, Target, AlertCircle, GraduationCap, Users, TrendingUp, Calculator, Info } from 'lucide-react';
import EducationChatbot from '../components/EducationChatbot';

// Education content for the chatbot
const EDUCATION_CONTENT = `
Student Loan Education Guide

UNDERSTANDING STUDENT LOANS
Student loans are a critical tool for financing higher education, but understanding the different types, repayment options, and optimization strategies can be overwhelming.

REQUIRED INFORMATION
To optimize your loan plan, you'll need to provide:
- Year Level: Freshman/Sophomore/Junior/Senior - Determines federal annual limits and years remaining
- School Name: Your university name - Reference only
- State of Residence: NC, CA, NY, TX, or Other - Determines state loan eligibility
- Dependency Status: Dependent or Independent - Significantly affects federal limits
- Eligible for Subsidized: Based on FAFSA financial need - If unchecked, can borrow full limit as unsubsidized
- Eligible for NC FELS: NC residents in qualifying fields - If checked, includes forgivable FELS loans
- Annual Funding Gap: COA minus grants/scholarships - The amount to borrow each year
- Expected Starting Salary: Post-graduation annual income - Used for IDR payment calculations
- Credit Score Range: Poor (300-579) / Fair (580-669) / Good (670-739) / Excellent (740-850) - Determines private loan APR
- Have a Cosigner?: Yes/No - Can lower private loan rates by ~0.5-1%

REPAYMENT CONSTRAINTS
Choose one optimization method:
- Target Payoff Years: All loans set to closest available term (5, 7, 10, 15, or 20 years). Shorter term = higher monthly payment, less total interest. Longer term = lower monthly payment, more total interest.
- Max Monthly Payment: System starts with 10-year term. If payment exceeds budget, extends to 15, then 20 years. Finds shortest term that keeps payment under your cap.

IN-SCHOOL PAYMENT OPTIONS
- Full Deferment: $0 monthly payment. Interest capitalizes (adds to principal). Best for tight budget during school.
- Interest Only: ~$30-50 per $10k borrowed monthly. No balance growth. Best for moderate budget, want to minimize cost.
- Fixed $25: $25 flat monthly payment. Partial interest coverage. Compromise option.
- Full Payment: Full amortization. Actively paying down balance. Best for extra income during school.

Example Impact: For $50,000 in unsubsidized loans at 6.53%, 4 years in school:
- Defer: $0 in-school cost, ~$14,800 capitalized interest, ~$64,800 balance at graduation
- Interest Only: ~$13,500 total in-school cost, $0 capitalized interest, $50,000 balance at graduation
- Fixed $25: ~$1,200 total in-school cost, ~$11,500 capitalized interest, ~$61,500 balance at graduation
Deferment saves money now but costs ~$5,000+ more over the life of the loan.

TYPES OF STUDENT LOANS

Federal Loans:
- Direct Subsidized: Annual/aggregate caps by dependency status and year level. Interest subsidized in-school (government pays interest). Fixed rate, origination fee, 6-month grace period. Standard term 10 years, eligible for IDR plans (SAVE/PAYE). Requires financial need (FAFSA).
- Direct Unsubsidized: Higher caps for independent students. Interest accrues in-school (not subsidized). Same rate/fee/grace period as subsidized. IDR eligible, no financial need required.
- Parent PLUS / Grad PLUS: Up to remaining cost of attendance. Higher rate and origination fee. Credit check required. Not subsidized, can consolidate for IDR. Deferment options available.

Income-Driven Repayment (IDR) Plans:
Discretionary income = (income – 225% poverty guideline × household size)
- SAVE Plan: 5-10% of discretionary income, most generous, interest subsidy
- PAYE: 10% of discretionary income, never more than standard payment
- IBR: 10% of discretionary income, capped at standard 10-year payment
- ICR: 20% of discretionary income or 12-year fixed payment
Forgiveness after 20-25 years (may be taxable)

State Loans:
State loan programs vary by state. Examples:
- NC Assist / FELS (NC): Residency required, program-specific, possible forgivability (FELS)
- CA CalEdge: California residents, competitive rates
- NY HESC: New York residents, various term options
Check your state's program for eligibility, rates, fees, and forgiveness benefits.

Private Loans:
- APR varies by credit tier and cosigner status
- Variable vs fixed rate options
- Term options: 5, 10, 15, or 20 years
- In-school options: defer, interest-only, fixed partial, immediate repayment
- Cosigner release terms available
- Often no origination/prepayment fees
- Rate discounts: autopay, cosigner, relationship banking
- Approval based on DTI (debt-to-income) and income

HOW THE OPTIMIZER WORKS

1. Loan Priority Order: The optimizer fills your funding gap in this order (best to worst):
   - Subsidized Federal Loans - No interest while in school
   - Unsubsidized Federal Loans - Lower rates, more protections
   - State Loans - Often competitive rates for residents
   - Private Loans - Used only if needed to fill remaining gap
   It respects annual and total loan limits for each type.

2. Multi-Year Planning: If you have multiple years left in school, the optimizer:
   - Accounts for tuition increases each year (default 7% growth)
   - Recalculates your funding gap for each remaining year
   - Plans ahead to ensure you don't exceed aggregate loan limits

3. Interest During School: How your in-school payment choice affects total cost:
   - Deferment: Interest adds to your loan balance (capitalizes) - costs more long-term
   - Interest-Only: Prevents balance growth - saves money over time
   - Fixed $25: Partially covers interest - moderate savings
   - Subsidized loans: Government pays interest regardless of your choice

4. Finding the Best Plan: The optimizer tries to minimize your total cost while respecting your constraints:
   - If you set a target payoff year, it finds the shortest term that fits
   - If you set a max monthly payment, it extends terms until payment fits your budget
   - It compares standard repayment vs. income-driven plans and shows both options
   - It warns you if payments might be unaffordable based on your expected income

What You'll See: Each recommended plan shows:
- Monthly Payment: What you'll pay after graduation
- Total Cost: Principal + all interest over the loan lifetime
- Total Interest: How much interest you'll pay in total
- Payoff Date: When you'll be debt-free
- Loan Mix: Percentage from federal, state, and private loans

TIPS FOR BEST RESULTS
1. Be accurate with your funding gap - Include all costs (tuition, housing, books, living expenses) minus all grants/scholarships
2. Consider your in-school payment carefully - Interest-only payments can save thousands over the loan lifetime
3. Check subsidized eligibility - If you're unsure, check your FAFSA results or ask your financial aid office
4. NC residents - If you're in teaching, nursing, allied health, or social work programs, check FELS eligibility
5. Use a cosigner if available - Can significantly lower private loan rates
6. Be realistic with your payoff constraint - Aggressive 5-year payoff requires high income after graduation

IMPORTANT DISCLAIMER
This information is for educational purposes only and does not constitute financial advice. Loan terms, rates, and eligibility requirements may vary. Always consult with your financial aid office, a financial advisor, or loan servicer for personalized guidance and binding decisions. Rates and terms are subject to change and may differ from those shown.
`;

const EducationPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  return (
    <div className="animate-enter">
      <PageHeader 
        title="Student Loan Education" 
        subtitle="Comprehensive guide to understanding student loans, repayment options, and optimization strategies."
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
        <div className="space-y-6">
          {/* Introduction */}
          <Card highlight>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen size={24} className="text-cap-red" />
              <h2 className="text-2xl font-bold text-gray-900">Understanding Student Loans</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Student loans are a critical tool for financing higher education, but understanding the different types, 
              repayment options, and optimization strategies can be overwhelming. This guide breaks down everything you 
              need to know to make informed decisions about your student loan strategy.
            </p>
          </Card>

          {/* Required Fields Section */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-cap-red" />
                <h2 className="text-2xl font-bold text-gray-900">Required Information</h2>
              </div>
              <button
                onClick={() => toggleSection('required')}
                className="text-cap-red hover:text-cap-red/80 transition-colors"
              >
                {expandedSections.has('required') ? 'Collapse' : 'Expand'}
              </button>
            </div>
            
            {expandedSections.has('required') && (
              <div className="space-y-4">
                <p className="text-gray-700 mb-4">
                  To optimize your loan plan, you'll need to provide the following information:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cap-red/10">
                        <th className="border border-cap-red/20 px-4 py-3 text-left font-semibold text-gray-900">Field</th>
                        <th className="border border-cap-red/20 px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                        <th className="border border-cap-red/20 px-4 py-3 text-left font-semibold text-gray-900">Impact on Plan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Year Level</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Freshman/Sophomore/Junior/Senior</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Determines federal annual limits and years remaining</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">School Name</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Your university name</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Reference only</td>
                      </tr>
                      <tr>
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">State of Residence</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">NC, CA, NY, TX, or Other</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Determines state loan eligibility</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Dependency Status</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Dependent or Independent</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Significantly affects federal limits</td>
                      </tr>
                      <tr>
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Eligible for Subsidized</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Based on FAFSA financial need</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">If unchecked, can borrow full limit as unsubsidized</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Eligible for NC FELS</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">NC residents in qualifying fields</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">If checked, includes forgivable FELS loans</td>
                      </tr>
                      <tr>
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Annual Funding Gap</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">COA minus grants/scholarships</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">The amount to borrow each year</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Expected Starting Salary</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Post-graduation annual income</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Used for IDR payment calculations</td>
                      </tr>
                      <tr>
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Credit Score Range</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Poor (300-579) / Fair (580-669) / Good (670-739) / Excellent (740-850)</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Determines private loan APR</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Have a Cosigner?</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Yes/No</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Can lower private loan rates by ~0.5-1%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>

          {/* Repayment Constraints */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Target size={24} className="text-cap-red" />
                <h2 className="text-2xl font-bold text-gray-900">Repayment Constraints</h2>
              </div>
              <button
                onClick={() => toggleSection('constraints')}
                className="text-cap-red hover:text-cap-red/80 transition-colors"
              >
                {expandedSections.has('constraints') ? 'Collapse' : 'Expand'}
              </button>
            </div>
            
            {expandedSections.has('constraints') && (
              <div className="space-y-4">
                <p className="text-gray-700 mb-4">
                  Choose one optimization method to guide your loan plan:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-2">Target Payoff Years</h3>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>All loans set to closest available term (5, 7, 10, 15, or 20 years)</li>
                      <li>Shorter term = higher monthly payment, less total interest</li>
                      <li>Longer term = lower monthly payment, more total interest</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-bold text-gray-900 mb-2">Max Monthly Payment</h3>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>System starts with 10-year term</li>
                      <li>If payment exceeds budget, extends to 15, then 20 years</li>
                      <li>Finds shortest term that keeps payment under your cap</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* In-School Payment Options */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <GraduationCap size={24} className="text-cap-red" />
                <h2 className="text-2xl font-bold text-gray-900">In-School Payment Options</h2>
              </div>
              <button
                onClick={() => toggleSection('in-school')}
                className="text-cap-red hover:text-cap-red/80 transition-colors"
              >
                {expandedSections.has('in-school') ? 'Collapse' : 'Expand'}
              </button>
            </div>
            
            {expandedSections.has('in-school') && (
              <div className="space-y-4">
                <p className="text-gray-700 mb-4">
                  This is <strong>critical</strong> for understanding your true loan cost. Your choice affects interest accrual and total cost:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cap-red/10">
                        <th className="border border-cap-red/20 px-4 py-3 text-left font-semibold text-gray-900">Option</th>
                        <th className="border border-cap-red/20 px-4 py-3 text-left font-semibold text-gray-900">Monthly Payment</th>
                        <th className="border border-cap-red/20 px-4 py-3 text-left font-semibold text-gray-900">Effect</th>
                        <th className="border border-cap-red/20 px-4 py-3 text-left font-semibold text-gray-900">Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Full Deferment</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">$0</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Interest capitalizes (adds to principal)</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Tight budget during school</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Interest Only</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">~$30-50 per $10k borrowed</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">No balance growth</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Moderate budget, want to minimize cost</td>
                      </tr>
                      <tr>
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Fixed $25</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">$25 flat</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Partial interest coverage</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Compromise option</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-cap-red/20 px-4 py-3 font-medium text-gray-900">Full Payment</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Full amortization</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Actively paying down balance</td>
                        <td className="border border-cap-red/20 px-4 py-3 text-gray-700">Extra income during school</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-yellow-700 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Example Impact</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        For $50,000 in unsubsidized loans at 6.53%, 4 years in school:
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-yellow-100">
                              <th className="px-3 py-2 text-left font-semibold text-gray-900">Option</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-900">In-School Cost</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-900">Capitalized Interest</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-900">Balance at Graduation</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-3 py-2 font-medium text-gray-900">Defer</td>
                              <td className="px-3 py-2 text-gray-700">$0</td>
                              <td className="px-3 py-2 text-gray-700">~$14,800</td>
                              <td className="px-3 py-2 text-gray-700">~$64,800</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="px-3 py-2 font-medium text-gray-900">Interest Only</td>
                              <td className="px-3 py-2 text-gray-700">~$13,500 total</td>
                              <td className="px-3 py-2 text-gray-700">$0</td>
                              <td className="px-3 py-2 text-gray-700">$50,000</td>
                            </tr>
                            <tr>
                              <td className="px-3 py-2 font-medium text-gray-900">Fixed $25</td>
                              <td className="px-3 py-2 text-gray-700">~$1,200 total</td>
                              <td className="px-3 py-2 text-gray-700">~$11,500</td>
                              <td className="px-3 py-2 text-gray-700">~$61,500</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-sm text-gray-700 mt-3 font-semibold">
                        <strong>Deferment saves money now but costs ~$5,000+ more over the life of the loan.</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Loan Types */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <DollarSign size={24} className="text-cap-red" />
                <h2 className="text-2xl font-bold text-gray-900">Types of Student Loans</h2>
              </div>
              <button
                onClick={() => toggleSection('loan-types')}
                className="text-cap-red hover:text-cap-red/80 transition-colors"
              >
                {expandedSections.has('loan-types') ? 'Collapse' : 'Expand'}
              </button>
            </div>
            
            {expandedSections.has('loan-types') && (
              <div className="space-y-6">
                {/* Federal Loans */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Federal Loans</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h4 className="font-bold text-gray-900 mb-2">Direct Subsidized</h4>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>Annual/aggregate caps by dependency status and year level</li>
                        <li>Interest subsidized in-school (government pays interest)</li>
                        <li>Fixed rate, origination fee, 6-month grace period</li>
                        <li>Standard term 10 years, eligible for IDR plans (SAVE/PAYE)</li>
                        <li>Requires financial need (FAFSA)</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h4 className="font-bold text-gray-900 mb-2">Direct Unsubsidized</h4>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>Higher caps for independent students</li>
                        <li>Interest accrues in-school (not subsidized)</li>
                        <li>Same rate/fee/grace period as subsidized</li>
                        <li>IDR eligible, no financial need required</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h4 className="font-bold text-gray-900 mb-2">Parent PLUS / Grad PLUS</h4>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>Up to remaining cost of attendance</li>
                        <li>Higher rate and origination fee</li>
                        <li>Credit check required</li>
                        <li>Not subsidized, can consolidate for IDR</li>
                        <li>Deferment options available</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <h4 className="font-bold text-gray-900 mb-2">Income-Driven Repayment (IDR) Plans</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Discretionary income = (income – 225% poverty guideline × household size)
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li><strong>SAVE Plan:</strong> 5-10% of discretionary income, most generous, interest subsidy</li>
                        <li><strong>PAYE:</strong> 10% of discretionary income, never more than standard payment</li>
                        <li><strong>IBR:</strong> 10% of discretionary income, capped at standard 10-year payment</li>
                        <li><strong>ICR:</strong> 20% of discretionary income or 12-year fixed payment</li>
                        <li>Forgiveness after 20-25 years (may be taxable)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* State Loans */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">State Loans</h3>
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-sm text-gray-700 mb-2">
                      State loan programs vary by state. Examples include:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li><strong>NC Assist / FELS (NC):</strong> Residency required, program-specific, possible forgivability (FELS)</li>
                      <li><strong>CA CalEdge:</strong> California residents, competitive rates</li>
                      <li><strong>NY HESC:</strong> New York residents, various term options</li>
                      <li>Check your state's program for eligibility, rates, fees, and forgiveness benefits</li>
                    </ul>
                  </div>
                </div>
                
                {/* Private Loans */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Private Loans</h3>
                  <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>APR varies by credit tier and cosigner status</li>
                      <li>Variable vs fixed rate options</li>
                      <li>Term options: 5, 10, 15, or 20 years</li>
                      <li>In-school options: defer, interest-only, fixed partial, immediate repayment</li>
                      <li>Cosigner release terms available</li>
                      <li>Often no origination/prepayment fees</li>
                      <li>Rate discounts: autopay, cosigner, relationship banking</li>
                      <li>Approval based on DTI (debt-to-income) and income</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* How the Optimizer Works */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp size={24} className="text-cap-red" />
                <h2 className="text-2xl font-bold text-gray-900">How the Optimizer Works</h2>
              </div>
              <button
                onClick={() => toggleSection('optimization')}
                className="text-cap-red hover:text-cap-red/80 transition-colors"
              >
                {expandedSections.has('optimization') ? 'Collapse' : 'Expand'}
              </button>
            </div>
            
            {expandedSections.has('optimization') && (
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  The optimizer analyzes your situation and recommends the best loan mix. Here's how it works:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-2">1. Loan Priority Order</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      The optimizer fills your funding gap in this order (best to worst):
                    </p>
                    <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside ml-2">
                      <li><strong>Subsidized Federal Loans</strong> - No interest while in school</li>
                      <li><strong>Unsubsidized Federal Loans</strong> - Lower rates, more protections</li>
                      <li><strong>State Loans</strong> - Often competitive rates for residents</li>
                      <li><strong>Private Loans</strong> - Used only if needed to fill remaining gap</li>
                    </ol>
                    <p className="text-sm text-gray-600 mt-2 italic">
                      It respects annual and total loan limits for each type.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h4 className="font-bold text-gray-900 mb-2">2. Multi-Year Planning</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      If you have multiple years left in school, the optimizer:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-2">
                      <li>Accounts for tuition increases each year (default 7% growth)</li>
                      <li>Recalculates your funding gap for each remaining year</li>
                      <li>Plans ahead to ensure you don't exceed aggregate loan limits</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <h4 className="font-bold text-gray-900 mb-2">3. Interest During School</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      How your in-school payment choice affects total cost:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-2">
                      <li><strong>Deferment:</strong> Interest adds to your loan balance (capitalizes) - costs more long-term</li>
                      <li><strong>Interest-Only:</strong> Prevents balance growth - saves money over time</li>
                      <li><strong>Fixed $25:</strong> Partially covers interest - moderate savings</li>
                      <li><strong>Subsidized loans:</strong> Government pays interest regardless of your choice</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <h4 className="font-bold text-gray-900 mb-2">4. Finding the Best Plan</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      The optimizer tries to minimize your total cost while respecting your constraints:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-2">
                      <li>If you set a <strong>target payoff year</strong>, it finds the shortest term that fits</li>
                      <li>If you set a <strong>max monthly payment</strong>, it extends terms until payment fits your budget</li>
                      <li>It compares standard repayment vs. income-driven plans and shows both options</li>
                      <li>It warns you if payments might be unaffordable based on your expected income</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-cap-red/10 rounded-lg border-2 border-cap-red/20">
                    <h4 className="font-bold text-gray-900 mb-2">What You'll See</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Each recommended plan shows:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-2">
                      <li><strong>Monthly Payment:</strong> What you'll pay after graduation</li>
                      <li><strong>Total Cost:</strong> Principal + all interest over the loan lifetime</li>
                      <li><strong>Total Interest:</strong> How much interest you'll pay in total</li>
                      <li><strong>Payoff Date:</strong> When you'll be debt-free</li>
                      <li><strong>Loan Mix:</strong> Percentage from federal, state, and private loans</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Tips Section */}
          <Card highlight>
            <div className="flex items-center gap-3 mb-4">
              <Info size={24} className="text-cap-red" />
              <h2 className="text-2xl font-bold text-gray-900">Tips for Best Results</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cap-red text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">1</div>
                <p className="text-gray-700">
                  <strong>Be accurate with your funding gap</strong> - Include all costs (tuition, housing, books, living expenses) minus all grants/scholarships
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cap-red text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">2</div>
                <p className="text-gray-700">
                  <strong>Consider your in-school payment carefully</strong> - Interest-only payments can save thousands over the loan lifetime
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cap-red text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">3</div>
                <p className="text-gray-700">
                  <strong>Check subsidized eligibility</strong> - If you're unsure, check your FAFSA results or ask your financial aid office
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cap-red text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">4</div>
                <p className="text-gray-700">
                  <strong>NC residents</strong> - If you're in teaching, nursing, allied health, or social work programs, check FELS eligibility
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cap-red text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">5</div>
                <p className="text-gray-700">
                  <strong>Use a cosigner if available</strong> - Can significantly lower private loan rates
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cap-red text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">6</div>
                <p className="text-gray-700">
                  <strong>Be realistic with your payoff constraint</strong> - Aggressive 5-year payoff requires high income after graduation
                </p>
              </div>
            </div>
          </Card>

          {/* Disclaimer */}
          <Card>
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Important Disclaimer</h3>
                <p className="text-sm text-gray-700">
                  This information is for educational purposes only and does not constitute financial advice. 
                  Loan terms, rates, and eligibility requirements may vary. Always consult with your financial aid office, 
                  a financial advisor, or loan servicer for personalized guidance and binding decisions. 
                  Rates and terms are subject to change and may differ from those shown.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Education Chatbot */}
      <EducationChatbot educationContent={EDUCATION_CONTENT} />
    </div>
  );
};

export default EducationPage;

