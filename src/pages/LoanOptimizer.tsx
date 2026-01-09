import { useState } from 'react';
import type { FormEvent } from 'react';
import './LoanOptimizer.css';

interface LoanCatalogItem {
  name: string;
  category: string;
  type: 'federal' | 'state' | 'private';
  rate: string;
  fee: string;
  limit: string;
  features: string;
}

interface Segment {
  name: string;
  type: 'federal' | 'state' | 'private';
  amount: number;
  rate: number;
  termYears: number;
}

interface YearPlan {
  year: number;
  yearLevel: string;
  segments: Segment[];
  funded: number;
  uncovered: number;
}

interface Summary {
  totalPrincipal: number;
  totalInterest: number;
  totalCost: number;
  standardPayment: number;
  weightedRate: string;
  payoffYears: number;
  payoffYear: number;
  federalPct: number;
  statePct: number;
  privatePct: number;
  totalFederal: number;
  idrPayment: number;
  inSchoolPaymentMode?: string;
  inSchoolMonthlyPayment?: number;
  inSchoolTotalPaid?: number;
  accruedInterest?: number;
  yearsInSchool?: number;
}

interface PlanOption {
  label: string;
  description: string;
  summary: Summary;
  yearPlan: YearPlan[];
}

interface ApiResponse {
  featured: boolean;
  options: PlanOption[];
  requestedGap: number;
  totalYears: number;
}

interface FormData {
  yearLevel: string;
  school: string;
  stateOfResidence: string;
  dependencyStatus: string;
  eligibleForSubsidized: boolean;
  eligibleForFELS: boolean;
  annualGap: number;
  annualIncome: number;
  familySize: number;
  creditScoreRange: string;
  cosigner: boolean;
  inSchoolPayment: string;
  tuitionGrowthRate: number;
  constraintMode: string;
  targetPayoffYears: number | null;
  maxMonthlyPayment: number | null;
}

const API = "http://localhost:4000/api/optimize";

const CATALOG: LoanCatalogItem[] = [
  { name: "Direct Subsidized", category: "Federal", type: "federal", rate: "6.53% fixed", fee: "1.057%", limit: "$3,500-$5,500/yr", features: "No interest while in school, IDR eligible" },
  { name: "Direct Unsubsidized", category: "Federal", type: "federal", rate: "6.53% fixed", fee: "1.057%", limit: "$5,500-$12,500/yr total", features: "Interest accrues in school, IDR eligible" },
  { name: "Parent PLUS", category: "Federal", type: "federal", rate: "9.08% fixed", fee: "4.228%", limit: "Up to COA", features: "Parent borrows, credit check required" },
  { name: "NC Student Assist", category: "State (NC)", type: "state", rate: "7.75% (7.50% w/autopay)", fee: "None", limit: "Up to COA", features: "NC residents, $120k lifetime limit" },
  { name: "NC Parent Assist", category: "State (NC)", type: "state", rate: "6.95% (6.70% w/autopay)", fee: "None", limit: "Up to COA", features: "Lower rate than federal PLUS, no fees" },
  { name: "NC FELS", category: "State (NC)", type: "state", rate: "0% (forgivable)", fee: "None", limit: "$8,500/yr", features: "Forgiven if work in NC (teaching, nursing, etc.)" },
  { name: "Sallie Mae", category: "Private", type: "private", rate: "4.99-16.99%", fee: "None", limit: "Up to COA", features: "1% graduation reward" },
  { name: "SoFi", category: "Private", type: "private", rate: "4.99-17.49%", fee: "None", limit: "Up to COA", features: "Career services, member benefits" },
  { name: "College Ave", category: "Private", type: "private", rate: "4.99-17.99%", fee: "None", limit: "Up to COA", features: "Flexible terms, multi-year approval" },
  { name: "Discover", category: "Private", type: "private", rate: "5.49-16.99%", fee: "None", limit: "Up to COA", features: "1% good grades reward each year" },
  { name: "Earnest", category: "Private", type: "private", rate: "4.89-17.49%", fee: "None", limit: "Up to COA", features: "Skip payment once/year, precision pricing" }
];

export function LoanOptimizer() {
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [constraintMode, setConstraintMode] = useState('payoff-years');
  const [formState, setFormState] = useState({
    eligibleForSubsidized: true,
    eligibleForFELS: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Calculating your optimized plan...');
    setResults(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: FormData = {
      yearLevel: formData.get('yearLevel') as string,
      school: formData.get('school') as string,
      stateOfResidence: formData.get('stateOfResidence') as string,
      dependencyStatus: formData.get('dependencyStatus') as string,
      eligibleForSubsidized: formState.eligibleForSubsidized,
      eligibleForFELS: formState.eligibleForFELS,
      annualGap: Number(formData.get('annualGap')),
      annualIncome: Number(formData.get('annualIncome')),
      familySize: Number(formData.get('familySize')) || 1,
      creditScoreRange: formData.get('creditScoreRange') as string,
      cosigner: formData.get('cosigner') === 'true',
      inSchoolPayment: formData.get('inSchoolPayment') as string,
      tuitionGrowthRate: formData.get('tuitionGrowthRate')
        ? Number(formData.get('tuitionGrowthRate')) / 100
        : 0.07,
      constraintMode: constraintMode,
      targetPayoffYears: constraintMode === 'payoff-years'
        ? Number(formData.get('targetPayoffYears')) || 10
        : null,
      maxMonthlyPayment: constraintMode === 'max-payment'
        ? Number(formData.get('maxMonthlyPayment')) || 500
        : null,
    };

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('API error');
      const json: ApiResponse = await res.json();
      setResults(json);
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus('Error: Is the backend running on localhost:4000?');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoanRows = (yearPlan: YearPlan[], summary: Summary) => {
    const segments = yearPlan.flatMap(y => y.segments);
    return (
      <>
        {segments.map((seg, idx) => {
          const r = seg.rate / 12;
          const n = seg.termYears * 12;
          const monthlyPayment = r > 0
            ? seg.amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
            : seg.amount / n;
          return (
            <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px' }}>
                <span className={`segment-chip ${seg.type}`}>{seg.name}</span>
              </td>
              <td style={{ padding: '8px', textAlign: 'right' }}>${seg.amount.toLocaleString()}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{(seg.rate * 100).toFixed(2)}%</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{seg.termYears} yrs</td>
              <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>${Math.round(monthlyPayment).toLocaleString()}</td>
            </tr>
          );
        })}
        <tr style={{ background: '#f1f5f9', fontWeight: 700 }}>
          <td style={{ padding: '8px' }}>TOTAL</td>
          <td style={{ padding: '8px', textAlign: 'right' }}>${summary.totalPrincipal.toLocaleString()}</td>
          <td style={{ padding: '8px', textAlign: 'right' }}>{summary.weightedRate}%</td>
          <td style={{ padding: '8px', textAlign: 'right' }}>{summary.payoffYears} yrs</td>
          <td style={{ padding: '8px', textAlign: 'right' }}>${summary.standardPayment.toLocaleString()}</td>
        </tr>
      </>
    );
  };

  const renderInSchoolSection = (summary: Summary, inSchoolPayment: string) => {
    const mode = summary.inSchoolPaymentMode || inSchoolPayment || 'defer';
    const modeLabels: Record<string, string> = {
      'defer': 'Full Deferment (no payments)',
      'interest-only': 'Interest-Only Payments',
      'fixed-25': 'Fixed $25/month',
      'full': 'Full Payments'
    };
    const modeLabel = modeLabels[mode] || mode;
    const monthlyPayment = summary.inSchoolMonthlyPayment || 0;
    const totalPaid = summary.inSchoolTotalPaid || 0;
    const accruedInterest = summary.accruedInterest || 0;
    const yearsInSchool = summary.yearsInSchool || 0;
    const isPayingInSchool = monthlyPayment > 0;

    return (
      <div className={`in-school-section ${isPayingInSchool ? 'paying' : 'deferred'}`}>
        <h4>🎓 While In School ({yearsInSchool} years)</h4>
        <div className="in-school-grid">
          <div>
            <div className="in-school-value">{modeLabel}</div>
            <div className="in-school-label">Payment Strategy</div>
          </div>
          <div>
            <div className="in-school-value">${monthlyPayment.toLocaleString()}/mo</div>
            <div className="in-school-label">Monthly While in School</div>
          </div>
          <div>
            <div className="in-school-value">${totalPaid.toLocaleString()}</div>
            <div className="in-school-label">Paid During School</div>
          </div>
          <div>
            <div className={`in-school-value ${accruedInterest > 0 ? 'negative' : 'positive'}`}>
              {accruedInterest > 0 ? `+$${accruedInterest.toLocaleString()}` : '$0'}
            </div>
            <div className="in-school-label">Interest Capitalized</div>
          </div>
        </div>
        {accruedInterest > 0 ? (
          <p className="in-school-warning">
            ⚠️ <strong>${accruedInterest.toLocaleString()}</strong> in unpaid interest will be added to your principal at graduation.
          </p>
        ) : (
          <p className="in-school-success">
            ✓ {mode === 'defer' && summary.totalFederal > 0 ? 'Subsidized loans have no in-school interest. ' : ''}No interest will capitalize.
          </p>
        )}
      </div>
    );
  };

  const renderIdrSection = (summary: Summary, annualIncome: number, familySize: number) => {
    if (summary.totalFederal <= 0) return null;
    return (
      <div className="idr-section">
        <h4>🎓 Income-Driven Repayment (IDR) Option</h4>
        <p>For your <strong>${summary.totalFederal.toLocaleString()}</strong> in federal loans, you may qualify for IDR:</p>
        <div className="idr-grid">
          <div>
            <div className="idr-value">${summary.idrPayment.toLocaleString()}/mo</div>
            <div className="idr-label">SAVE Plan (5% of discretionary income)</div>
          </div>
          <div className="idr-details">
            Based on ${annualIncome.toLocaleString()} income, family size {familySize}.<br />
            Remaining balance forgiven after 20-25 years.
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="loan-optimizer">
      <div className="lo-card">
        <h1>🎓 Student Loan Optimizer</h1>
        <p className="subtitle">Get a personalized, year-by-year loan plan optimized for your financial future.</p>

        <details>
          <summary>View all loan options (federal, state, private)</summary>
          <div className="catalog-wrapper">
            <table className="catalog-table">
              <thead>
                <tr>
                  <th>Loan Type</th>
                  <th>Category</th>
                  <th>Interest Rate</th>
                  <th>Origination Fee</th>
                  <th>Annual Limit</th>
                  <th>Key Features</th>
                </tr>
              </thead>
              <tbody>
                {CATALOG.map((loan, idx) => (
                  <tr key={idx} className={`type-${loan.type}`}>
                    <td><strong>{loan.name}</strong></td>
                    <td>{loan.category}</td>
                    <td>{loan.rate}</td>
                    <td>{loan.fee}</td>
                    <td>{loan.limit}</td>
                    <td>{loan.features}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>

      <div className="lo-card">
        <h2>📝 Your Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Current Year Level <span className="required">*</span></label>
              <select name="yearLevel" required>
                <option value="freshman">Freshman (4 years left)</option>
                <option value="sophomore">Sophomore (3 years left)</option>
                <option value="junior">Junior (2 years left)</option>
                <option value="senior">Senior (1 year left)</option>
              </select>
            </div>

            <div className="form-group">
              <label>School Name <span className="required">*</span></label>
              <input type="text" name="school" placeholder="e.g., Duke University" required />
            </div>

            <div className="form-group">
              <label>State of Residence <span className="required">*</span></label>
              <select name="stateOfResidence" required>
                <option value="NC">North Carolina</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="other">Other State</option>
              </select>
              <small>Affects state loan eligibility</small>
            </div>

            <div className="form-group">
              <label>Dependency Status <span className="required">*</span></label>
              <select name="dependencyStatus" required>
                <option value="dependent">Dependent (under 24, no dependents)</option>
                <option value="independent">Independent</option>
              </select>
              <small>Affects federal loan limits</small>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formState.eligibleForSubsidized}
                  onChange={(e) => setFormState(prev => ({ ...prev, eligibleForSubsidized: e.target.checked }))}
                />
                Eligible for Subsidized Loans
              </label>
              <small>Uncheck if you don't qualify (based on FAFSA financial need)</small>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formState.eligibleForFELS}
                  onChange={(e) => setFormState(prev => ({ ...prev, eligibleForFELS: e.target.checked }))}
                />
                Eligible for NC FELS
              </label>
              <small>NC residents in teaching, nursing, allied health, or other qualifying fields</small>
            </div>

            <div className="form-group">
              <label>Annual Funding Gap (COA - Aid) <span className="required">*</span></label>
              <input type="number" name="annualGap" placeholder="25000" required />
              <small>Amount you need to borrow per year</small>
            </div>

            <div className="form-group">
              <label>Expected Starting Salary <span className="required">*</span></label>
              <input type="number" name="annualIncome" placeholder="60000" required />
              <small>For IDR payment calculations</small>
            </div>

            <div className="form-group">
              <label>Family Size</label>
              <input type="number" name="familySize" defaultValue={1} min={1} />
              <small>For IDR calculations</small>
            </div>

            <div className="form-group">
              <label>Credit Score Range <span className="required">*</span></label>
              <select name="creditScoreRange" required defaultValue="fair">
                <option value="poor">Poor (&lt; 580)</option>
                <option value="fair">Fair (580-669)</option>
                <option value="good">Good (670-739)</option>
                <option value="excellent">Excellent (740+)</option>
              </select>
              <small>Affects private loan rates</small>
            </div>

            <div className="form-group">
              <label>Have a Cosigner? <span className="required">*</span></label>
              <select name="cosigner" required>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              <small>Can lower private loan rates</small>
            </div>

            <div className="form-group">
              <label>In-School Payment Preference</label>
              <select name="inSchoolPayment">
                <option value="defer">Full Deferment (no payments)</option>
                <option value="interest-only">Interest Only</option>
                <option value="fixed-25">Fixed $25/month</option>
                <option value="full">Full Payments</option>
              </select>
              <small>Affects total interest</small>
            </div>

            <div className="form-group">
              <label>Tuition Growth Rate</label>
              <input type="number" step="0.1" name="tuitionGrowthRate" defaultValue={7} />
              <small>Expected % increase per year</small>
            </div>
          </div>

          <div className="repayment-goal">
            <h3>⚡ Repayment Goal <span className="required">*</span></h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Optimize By <span className="required">*</span></label>
                <select
                  value={constraintMode}
                  onChange={(e) => setConstraintMode(e.target.value)}
                  required
                >
                  <option value="payoff-years">Target Payoff Years</option>
                  <option value="max-payment">Max Monthly Payment</option>
                </select>
                <small>Choose how to constrain your repayment plan</small>
              </div>

              {constraintMode === 'payoff-years' ? (
                <div className="form-group">
                  <label>Payoff In <span className="required">*</span></label>
                  <select name="targetPayoffYears" required defaultValue="10">
                    <option value="5">5 years (aggressive - less interest)</option>
                    <option value="7">7 years</option>
                    <option value="10">10 years (standard)</option>
                    <option value="15">15 years</option>
                    <option value="20">20 years (lowest payment)</option>
                  </select>
                  <small>Shorter = higher payments, less interest</small>
                </div>
              ) : (
                <div className="form-group">
                  <label>Max Monthly Payment <span className="required">*</span></label>
                  <input type="number" name="maxMonthlyPayment" placeholder="e.g., 500" required />
                  <small>We'll find the shortest term that fits this budget</small>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Calculating...' : 'Generate Optimized Plan'}
            </button>
          </div>
        </form>
      </div>

      {status && <div className="status muted">{status}</div>}

      {results && (
        <div className="results">
          <h2>📊 Your Personalized Loan Plans</h2>
          <p className="muted">
            Based on {results.totalYears} years remaining, with ${results.requestedGap.toLocaleString()} total funding needed.
          </p>

          {results.options.map((plan, idx) => {
            const isFeatured = idx < 2;
            const { summary, yearPlan, label, description } = plan;
            const totalFunded = yearPlan.reduce((sum, y) => sum + y.funded, 0);
            const gapMatch = Math.abs(totalFunded - results.requestedGap) < 100;

            return (
              <div key={idx} className={`plan-card ${isFeatured ? 'featured' : ''}`}>
                <div className="plan-header">
                  <div>
                    {isFeatured && <span className="badge badge-recommended">Recommended</span>}
                    <div className="plan-title">{label}</div>
                    <div className="muted">{description}</div>
                  </div>
                </div>

                <div className="plan-stats">
                  <div className="stat">
                    <div className="stat-value">${summary.standardPayment.toLocaleString()}</div>
                    <div className="stat-label">Monthly Payment</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">${summary.totalCost.toLocaleString()}</div>
                    <div className="stat-label">Total Cost</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">${summary.totalInterest.toLocaleString()}</div>
                    <div className="stat-label">Total Interest</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{summary.payoffYears || 10} yrs</div>
                    <div className="stat-label">Repayment Term</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{summary.payoffYear}</div>
                    <div className="stat-label">Paid Off By</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{summary.weightedRate}%</div>
                    <div className="stat-label">Avg Rate</div>
                  </div>
                </div>

                <div className="loan-mix">
                  <strong>Loan Mix:</strong>
                  <span className="badge badge-federal">Federal {summary.federalPct}%</span>
                  <span className="badge badge-state">State {summary.statePct}%</span>
                  <span className="badge badge-private">Private {summary.privatePct}%</span>
                </div>
                <div className="mix-bar">
                  <div className="mix-federal" style={{ width: `${summary.federalPct}%` }}></div>
                  <div className="mix-state" style={{ width: `${summary.statePct}%` }}></div>
                  <div className="mix-private" style={{ width: `${summary.privatePct}%` }}></div>
                </div>

                <div className={`gap-check ${gapMatch ? 'gap-ok' : 'gap-warn'}`}>
                  {gapMatch
                    ? `✓ Full funding: $${totalFunded.toLocaleString()} covers your $${results.requestedGap.toLocaleString()} need`
                    : `⚠ Funded $${totalFunded.toLocaleString()} of $${results.requestedGap.toLocaleString()} requested`}
                </div>

                <details className="year-breakdown">
                  <summary>View year-by-year breakdown</summary>
                  <div className="year-breakdown-content">
                    {yearPlan.map((year, yIdx) => (
                      <div key={yIdx} className="year-row">
                        <div className="year-label">
                          Year {year.year}<br />
                          <span className="muted">{year.yearLevel}</span>
                        </div>
                        <div className="year-segments">
                          {year.segments.map((seg, sIdx) => (
                            <span key={sIdx} className={`segment-chip ${seg.type}`}>
                              {seg.name}: ${seg.amount.toLocaleString()} @ {(seg.rate * 100).toFixed(2)}% ({seg.termYears}yr)
                            </span>
                          ))}
                        </div>
                        <div className="year-total">
                          <strong>${year.funded.toLocaleString()}</strong>
                          {year.uncovered > 0 && (
                            <><br /><span className="uncovered">${year.uncovered.toLocaleString()} uncovered</span></>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>

                <details className="repayment-details">
                  <summary>📋 View Full Repayment Details</summary>
                  <div className="repayment-content">
                    {renderInSchoolSection(summary, 'defer')}

                    <div className="post-grad-section">
                      <h4>💰 After Graduation: {summary.payoffYears}-Year Repayment</h4>
                      <div className="post-grad-grid">
                        <div>
                          <div className="post-grad-value">${summary.standardPayment.toLocaleString()}</div>
                          <div className="post-grad-label">Monthly Payment</div>
                        </div>
                        <div>
                          <div className="post-grad-value green">${summary.totalPrincipal.toLocaleString()}</div>
                          <div className="post-grad-label">Principal Borrowed</div>
                        </div>
                        <div>
                          <div className="post-grad-value red">${summary.totalInterest.toLocaleString()}</div>
                          <div className="post-grad-label">Total Interest</div>
                        </div>
                        <div>
                          <div className="post-grad-value purple">${summary.totalCost.toLocaleString()}</div>
                          <div className="post-grad-label">Total Cost</div>
                        </div>
                      </div>
                    </div>

                    <div className="loan-breakdown">
                      <h4>📊 Individual Loan Breakdown</h4>
                      <table>
                        <thead>
                          <tr>
                            <th>Loan</th>
                            <th>Principal</th>
                            <th>Rate</th>
                            <th>Term</th>
                            <th>Monthly</th>
                          </tr>
                        </thead>
                        <tbody>
                          {renderLoanRows(yearPlan, summary)}
                        </tbody>
                      </table>
                    </div>

                    {renderIdrSection(summary, 60000, 1)}

                    <div className="timeline-section">
                      <h4>📅 Complete Payment Timeline</h4>
                      <div className="timeline">
                        <div className="timeline-badge now">Now: In School</div>
                        <div className="timeline-line orange"></div>
                        <div className="timeline-badge graduate">Graduate: {new Date().getFullYear() + results.totalYears}</div>
                        <div className="timeline-line gradient"></div>
                        <div className="timeline-badge debt-free">Debt-Free: {summary.payoffYear}</div>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}

      <div className="lo-card methodology">
        <details>
          <summary>How we optimize your loan plan</summary>
          <div className="explanation">
            <strong>Our Strategy: Federal First</strong>
            <ol>
              <li><strong>Direct Subsidized</strong> — Best option! Government pays interest while in school.</li>
              <li><strong>Direct Unsubsidized</strong> — Same low federal rate, but interest accrues.</li>
              <li><strong>State Loans</strong> — NC Assist, FELS, etc. Often competitive rates with forgiveness options.</li>
              <li><strong>Private Loans</strong> — Only to fill remaining gap. Higher rates, fewer protections.</li>
            </ol>
            <p>This hierarchy minimizes your long-term cost because federal loans have:</p>
            <ul>
              <li>Lower, fixed interest rates (currently 6.53% for undergrads)</li>
              <li>Income-driven repayment options (SAVE plan = 5% of discretionary income)</li>
              <li>Loan forgiveness after 20-25 years on IDR plans</li>
              <li>Deferment and forbearance protections</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}
