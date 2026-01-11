import React, { useState, useEffect } from 'react';
import { Card, Button, PageHeader, Badge } from '../components/shared';
import { 
  optimizeLoanPlan, 
  createDefaultProfile, 
  type StudentProfile, 
  type OptimizationResult,
  type OptimizationPlan
} from '../utils/loanOptimizer';
import { loanService, CreateLoanData } from '../services/loanService';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sliders, Trophy, 
  GraduationCap, DollarSign, 
  CreditCard, Target, ChevronDown, ChevronUp,
  Shield, TrendingUp, AlertCircle,
  Info, BarChart3, Calendar, Check, Loader2, LogIn
} from 'lucide-react';
import { InfoTooltip } from '../components/InfoTooltip';

// US States for dropdown
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

interface OptimizerPageProps {
  setPage?: (page: string) => void;
}

// Form section component
interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-cap-red/10 text-cap-red">
            {icon}
          </div>
          <span className="font-bold text-gray-900 text-lg">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={22} className="text-gray-400" /> : <ChevronDown size={22} className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-6 pt-2 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

// Input field component
interface FormFieldProps {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, tooltip, children, required }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2.5">
      {label}
      {required && <span className="text-cap-red">*</span>}
      {tooltip && <InfoTooltip content={tooltip} />}
    </label>
    {children}
  </div>
);

// Select input styling
const selectClass = "w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-cap-red focus:ring-4 focus:ring-cap-red/10 outline-none transition-all bg-white text-gray-900 font-medium";
const inputClass = "w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-cap-red focus:ring-4 focus:ring-cap-red/10 outline-none transition-all bg-white text-gray-900 font-medium";

// Year breakdown modal/panel
interface YearBreakdownProps {
  plan: OptimizationPlan;
  onClose: () => void;
  onSelect: () => void;
  onLogin?: () => void;
  isSaving: boolean;
  isLoggedIn: boolean;
}

const YearBreakdown: React.FC<YearBreakdownProps> = ({ plan, onClose, onSelect, onLogin, isSaving, isLoggedIn }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">{plan.label}</h2>
          <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Monthly Payment</p>
              <p className="text-2xl font-bold text-gray-900">${plan.summary.standardPayment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">${plan.summary.totalCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Interest</p>
              <p className="text-2xl font-bold text-cap-red">${plan.summary.totalInterest.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Payoff Year</p>
              <p className="text-2xl font-bold text-gray-900">{plan.summary.payoffYear}</p>
            </div>
          </div>

          {/* Year by Year Breakdown */}
          <div className="space-y-5">
            {plan.yearPlan.map((year, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-cap-navy to-cap-navy/90 text-white p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-xl capitalize">Year {year.year}: {year.yearLevel}</h3>
                      <p className="text-sm text-white/70 mt-1">Funding Gap: ${year.gap.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">${year.funded.toLocaleString()}</p>
                      <p className="text-sm text-white/70">Total Funded</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 space-y-3">
                  {year.segments.map((seg, segIdx) => (
                    <div 
                      key={segIdx}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${
                          seg.type === 'federal' ? 'bg-cap-navy' :
                          seg.type === 'state' ? 'bg-green-500' : 'bg-amber-500'
                        }`}></div>
                        <div>
                          <p className="font-bold text-gray-900">{seg.name}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {(seg.rate * 100).toFixed(2)}% APR • {seg.termYears} year term
                            {seg.subsidized && <span className="ml-2 text-green-600 font-medium">• Subsidized</span>}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">${seg.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 capitalize font-medium">{seg.type}</p>
                      </div>
                    </div>
                  ))}
                  
                  {year.uncovered > 0 && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                      <AlertCircle size={20} className="text-red-500 shrink-0" />
                      <span className="text-sm font-medium text-red-700">
                        ${year.uncovered.toLocaleString()} uncovered - may need additional funding sources
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Select Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          {isLoggedIn ? (
            <Button 
              variant="primary" 
              fullWidth 
              onClick={onSelect}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Saving Plan...
                </>
              ) : (
                <>
                  <Check size={18} className="mr-2" />
                  Select This Plan & Save to My Loans
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Sign in to save this plan to your account</span>
              </div>
              <Button 
                variant="primary" 
                fullWidth 
                onClick={onLogin}
              >
                <LogIn size={18} className="mr-2" />
                Sign In to Save Plan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OptimizerPage: React.FC<OptimizerPageProps> = ({ setPage }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile>(createDefaultProfile());
  const [results, setResults] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<OptimizationPlan | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update years remaining when year level changes
  useEffect(() => {
    const yearMap: Record<string, number> = {
      freshman: 4,
      sophomore: 3,
      junior: 2,
      senior: 1
    };
    setProfile(prev => ({ ...prev, yearsRemaining: yearMap[prev.yearLevel] || 4 }));
  }, [profile.yearLevel]);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setSaveSuccess(false);
    setTimeout(() => {
      const result = optimizeLoanPlan(profile);
      setResults(result);
      setIsOptimizing(false);
    }, 500);
  };

  const handleViewDetails = (plan: OptimizationPlan) => {
    setSelectedPlan(plan);
    setShowBreakdown(true);
  };

  const handleSelectPlan = async () => {
    if (!selectedPlan) return;
    
    // Check if user is logged in
    if (!user) {
      alert('Please log in to save your loan plan. Click "Sign In" in the navigation bar.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Delete existing loans first
      await loanService.deleteAllLoans();
      
      // Convert plan segments to loan records
      const loansToCreate: CreateLoanData[] = [];
      
      selectedPlan.yearPlan.forEach((year) => {
        year.segments.forEach((seg) => {
          loansToCreate.push({
            name: `${seg.name} (Year ${year.year} - ${year.yearLevel})`,
            type: seg.type,
            lender: seg.type === 'private' ? seg.name.replace(' Private', '') : undefined,
            interest_rate: Math.round(seg.rate * 10000) / 100, // Convert to percentage and round to 2 decimals
            term_years: seg.termYears,
            fixed_variable: 'fixed',
            origination_fee: seg.origFee * 100,
            grace_period: 6,
            amount: seg.amount,
            repayment_plan: selectedPlan.repaymentPlan,
            loan_subtype: seg.subsidized ? 'subsidized' : 'unsubsidized',
            year_level: year.yearLevel,
            in_school_payment_strategy: profile.inSchoolPayment,
          });
        });
      });
      
      // Create all loans
      await loanService.createLoans(loansToCreate);
      
      setSaveSuccess(true);
      setShowBreakdown(false);
      
      // Navigate to My Loans after a brief delay
      setTimeout(() => {
        if (setPage) {
          setPage('my-loans');
        }
      }, 1500);
      
    } catch (error: any) {
      console.error('Error saving plan:', error);
      
      // Provide helpful error messages
      let errorMessage = 'Failed to save plan. ';
      
      if (error?.message?.includes('authenticated')) {
        errorMessage = 'You need to be logged in to save a plan. Please log in first.';
      } else if (error?.message?.includes('profile not found') || error?.message?.includes('Profile not found')) {
        errorMessage = 'Please complete your profile first before saving a loan plan. Go to Profile page to set up your account.';
      } else if (error?.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-enter">
      <PageHeader 
        title="Loan Optimizer" 
        subtitle="Get personalized loan recommendations based on your financial situation and goals."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-8 p-5 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-xl">
              <Check size={24} className="text-green-600" />
            </div>
            <div>
              <p className="font-bold text-green-800">Plan saved successfully!</p>
              <p className="text-green-700 text-sm mt-0.5">Redirecting to My Loans...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Input Form Panel */}
          <div className="xl:col-span-2 space-y-5">
            <Card highlight className="!p-0 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-xl flex items-center gap-3">
                  <Sliders size={22} className="text-cap-red" />
                  Your Profile
                </h3>
                <p className="text-gray-500 text-sm mt-1">Fill in your details to generate personalized loan plans</p>
              </div>
              
              <form className="p-6 space-y-5" onSubmit={(e) => { e.preventDefault(); handleOptimize(); }}>
                {/* Student Information */}
                <FormSection title="Student Info" icon={<GraduationCap size={20} />}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                    <FormField label="Year Level" required>
                      <select 
                        value={profile.yearLevel}
                        onChange={e => setProfile({ ...profile, yearLevel: e.target.value as StudentProfile['yearLevel'] })}
                        className={selectClass}
                      >
                        <option value="freshman">Freshman</option>
                        <option value="sophomore">Sophomore</option>
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                      </select>
                    </FormField>
                    
                    <FormField label="State" required>
                      <select 
                        value={profile.stateOfResidence}
                        onChange={e => setProfile({ ...profile, stateOfResidence: e.target.value })}
                        className={selectClass}
                      >
                        {US_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </FormField>
                    
                    <FormField label="Dependency Status" tooltip="Affects federal loan limits">
                      <select 
                        value={profile.dependencyStatus}
                        onChange={e => setProfile({ ...profile, dependencyStatus: e.target.value as StudentProfile['dependencyStatus'] })}
                        className={selectClass}
                      >
                        <option value="dependent">Dependent</option>
                        <option value="independent">Independent</option>
                      </select>
                    </FormField>
                    
                    <FormField label="School (Optional)">
                      <input 
                        type="text"
                        value={profile.school}
                        onChange={e => setProfile({ ...profile, school: e.target.value })}
                        placeholder="e.g., Duke University"
                        className={inputClass}
                      />
                    </FormField>
                  </div>
                </FormSection>

                {/* Financial Situation */}
                <FormSection title="Financial Gap" icon={<DollarSign size={20} />}>
                  <div className="space-y-5 mt-4">
                    <FormField 
                      label="Annual Funding Gap" 
                      tooltip="Cost of attendance minus grants, scholarships, and savings per year"
                      required
                    >
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                        <input 
                          type="number"
                          value={profile.annualGap}
                          onChange={e => setProfile({ ...profile, annualGap: Number(e.target.value) })}
                          className={`${inputClass} pl-10`}
                          min="0"
                          step="1000"
                        />
                      </div>
                    </FormField>
                    
                    <FormField 
                      label="Expected Starting Salary" 
                      tooltip="Post-graduation income (for IDR estimates)"
                    >
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                        <input 
                          type="number"
                          value={profile.annualIncome}
                          onChange={e => setProfile({ ...profile, annualIncome: Number(e.target.value) })}
                          className={`${inputClass} pl-10`}
                          min="0"
                          step="5000"
                        />
                      </div>
                    </FormField>
                    
                    <FormField label="Tuition Growth Rate" tooltip="Expected annual increase in costs">
                      <div className="flex items-center gap-5">
                        <input 
                          type="range"
                          value={profile.tuitionGrowthRate * 100}
                          onChange={e => setProfile({ ...profile, tuitionGrowthRate: Number(e.target.value) / 100 })}
                          min="0"
                          max="15"
                          step="0.5"
                          className="flex-1 h-2 rounded-full appearance-none bg-gray-200 cursor-pointer"
                        />
                        <span className="font-bold text-gray-900 text-lg w-16 text-right">{(profile.tuitionGrowthRate * 100).toFixed(1)}%</span>
                      </div>
                    </FormField>
                  </div>
                </FormSection>

                {/* Credit & Eligibility */}
                <FormSection title="Credit & Eligibility" icon={<CreditCard size={20} />} defaultOpen={false}>
                  <div className="space-y-5 mt-4">
                    <FormField label="Credit Score Range" tooltip="Affects private loan rates">
                      <select 
                        value={profile.creditScoreRange}
                        onChange={e => setProfile({ ...profile, creditScoreRange: e.target.value as StudentProfile['creditScoreRange'] })}
                        className={selectClass}
                      >
                        <option value="excellent">Excellent (750+)</option>
                        <option value="good">Good (700-749)</option>
                        <option value="fair">Fair (650-699)</option>
                        <option value="poor">Poor (Below 650)</option>
                      </select>
                    </FormField>
                    
                    <div className="space-y-4 pt-2">
                      <label className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors -mx-3">
                        <input 
                          type="checkbox"
                          checked={profile.cosigner}
                          onChange={e => setProfile({ ...profile, cosigner: e.target.checked })}
                          className="w-5 h-5 rounded-lg border-2 border-gray-300 text-cap-red focus:ring-cap-red focus:ring-offset-0"
                        />
                        <span className="text-sm font-medium text-gray-700">I have a cosigner available</span>
                      </label>
                      
                      <label className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors -mx-3">
                        <input 
                          type="checkbox"
                          checked={profile.eligibleForSubsidized}
                          onChange={e => setProfile({ ...profile, eligibleForSubsidized: e.target.checked })}
                          className="w-5 h-5 rounded-lg border-2 border-gray-300 text-cap-red focus:ring-cap-red focus:ring-offset-0"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Eligible for subsidized loans</span>
                          <InfoTooltip content="Based on FAFSA financial need determination" />
                        </div>
                      </label>
                      
                      {profile.stateOfResidence === 'NC' && (
                        <label className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors -mx-3">
                          <input 
                            type="checkbox"
                            checked={profile.eligibleForFELS}
                            onChange={e => setProfile({ ...profile, eligibleForFELS: e.target.checked })}
                            className="w-5 h-5 rounded-lg border-2 border-gray-300 text-cap-red focus:ring-cap-red focus:ring-offset-0"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Eligible for NC FELS</span>
                            <InfoTooltip content="Forgivable loans for teaching, nursing, allied health, or social work" />
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                </FormSection>

                {/* Repayment Preferences */}
                <FormSection title="Repayment Goals" icon={<Target size={20} />} defaultOpen={false}>
                  <div className="space-y-5 mt-4">
                    <FormField label="Target Payoff Years" tooltip="Years after graduation to pay off">
                      <select 
                        value={profile.targetPayoffYears}
                        onChange={e => setProfile({ ...profile, targetPayoffYears: Number(e.target.value) })}
                        className={selectClass}
                      >
                        <option value={5}>5 years (aggressive)</option>
                        <option value={7}>7 years</option>
                        <option value={10}>10 years (standard)</option>
                        <option value={15}>15 years</option>
                        <option value={20}>20 years</option>
                        <option value={25}>25 years (extended)</option>
                      </select>
                    </FormField>
                    
                    <FormField 
                      label="Max Monthly Payment (Optional)" 
                      tooltip="Set a budget cap"
                    >
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                    <input 
                          type="number"
                          value={profile.maxMonthlyPayment || ''}
                          onChange={e => setProfile({ ...profile, maxMonthlyPayment: e.target.value ? Number(e.target.value) : null })}
                          placeholder="No limit"
                          className={`${inputClass} pl-10`}
                      min="0"
                          step="50"
                        />
                      </div>
                    </FormField>
                    
                    <FormField label="In-School Payment Strategy" tooltip="How to handle interest while studying">
                      <select 
                        value={profile.inSchoolPayment}
                        onChange={e => setProfile({ ...profile, inSchoolPayment: e.target.value as StudentProfile['inSchoolPayment'] })}
                        className={selectClass}
                      >
                        <option value="defer">Full Deferment (interest capitalizes)</option>
                        <option value="interest-only">Interest-Only Payments</option>
                        <option value="fixed-25">Fixed $25/month</option>
                        <option value="full">Full Payments</option>
                      </select>
                    </FormField>
                  </div>
                </FormSection>

                <div className="pt-4">
                  <Button 
                    type="submit"
                    fullWidth 
                    disabled={isOptimizing || profile.annualGap <= 0}
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <BarChart3 size={18} className="mr-2" />
                        Generate Loan Plans
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="xl:col-span-3 space-y-6">
            {!results ? (
              <Card className="!py-20">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-cap-red/10 to-cap-red/5 flex items-center justify-center">
                    <BarChart3 size={48} className="text-cap-red" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Optimize</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                    Fill out your profile and click "Generate Loan Plans" to see personalized recommendations.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                      <Shield size={16} /> Federal First Strategy
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                      <TrendingUp size={16} /> Cost Optimized
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                      <Calendar size={16} /> Multi-Year Planning
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Needed', value: `$${results.requestedGap.toLocaleString()}`, color: 'text-gray-900' },
                    { label: 'School Years', value: results.totalYears.toString(), color: 'text-gray-900' },
                    { label: 'Plans Generated', value: results.options.length.toString(), color: 'text-gray-900' },
                    { label: 'Best Monthly', value: `$${Math.min(...results.options.map(o => o.summary.standardPayment)).toLocaleString()}`, color: 'text-cap-red' },
                  ].map((stat, i) => (
                    <Card key={i} className="!py-5 text-center">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </Card>
                  ))}
                </div>

                {/* Top Recommendation */}
                {results.featured.length > 0 && (
                  <Card className="border-2 border-cap-red/30 relative overflow-hidden !p-0">
                    <div className="absolute top-0 right-0">
                      <div className="bg-cap-red text-white text-xs font-bold px-5 py-2 rounded-bl-2xl uppercase tracking-wider">
                        #1 Recommendation
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                          <Trophy size={36} className="text-amber-500" />
                      </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-900">{results.featured[0].label}</h2>
                          <p className="text-gray-500 mt-2">{results.featured[0].description}</p>
                      </div>
                    </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8 p-6 rounded-2xl bg-gray-50 border border-gray-200">
                      <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Monthly Payment</p>
                          <p className="text-2xl font-bold text-gray-900">${results.featured[0].summary.standardPayment.toLocaleString()}</p>
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Cost</p>
                          <p className="text-2xl font-bold text-gray-900">${results.featured[0].summary.totalCost.toLocaleString()}</p>
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Interest</p>
                          <p className="text-2xl font-bold text-cap-red">${results.featured[0].summary.totalInterest.toLocaleString()}</p>
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Payoff Year</p>
                          <p className="text-2xl font-bold text-gray-900">{results.featured[0].summary.payoffYear}</p>
                      </div>
                    </div>

                      {/* Loan Mix */}
                      <div className="mb-8">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Loan Source Mix</h4>
                        <div className="flex gap-1 mb-4 h-4 rounded-full overflow-hidden bg-gray-200">
                          {results.featured[0].summary.federalPct > 0 && (
                            <div 
                              className="bg-cap-navy h-full transition-all rounded-l-full" 
                              style={{ width: `${results.featured[0].summary.federalPct}%` }}
                            />
                          )}
                          {results.featured[0].summary.statePct > 0 && (
                            <div 
                              className="bg-green-500 h-full transition-all" 
                              style={{ width: `${results.featured[0].summary.statePct}%` }}
                            />
                          )}
                          {results.featured[0].summary.privatePct > 0 && (
                            <div 
                              className="bg-amber-500 h-full transition-all rounded-r-full" 
                              style={{ width: `${results.featured[0].summary.privatePct}%` }}
                            />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-cap-navy"></div>
                            <span className="font-medium text-gray-700">Federal: ${results.featured[0].summary.totalFederal.toLocaleString()} ({results.featured[0].summary.federalPct}%)</span>
                          </div>
                          {results.featured[0].summary.statePct > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-green-500"></div>
                              <span className="font-medium text-gray-700">State: ${results.featured[0].summary.totalState.toLocaleString()} ({results.featured[0].summary.statePct}%)</span>
                            </div>
                          )}
                          {results.featured[0].summary.privatePct > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                              <span className="font-medium text-gray-700">Private: ${results.featured[0].summary.totalPrivate.toLocaleString()} ({results.featured[0].summary.privatePct}%)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button 
                        variant="primary" 
                        fullWidth
                        onClick={() => handleViewDetails(results.featured[0])}
                      >
                        View Details & Select This Plan
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Alternative Options */}
                {results.options.length > 1 && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mt-10 mb-5">Alternative Strategies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {results.options.slice(1).map((plan, idx) => (
                        <Card key={idx} className="hover:border-cap-red/40 transition-all cursor-pointer group" onClick={() => handleViewDetails(plan)}>
                          <div className="flex justify-between items-start mb-4">
                            <Badge color="navy">Rank #{idx + 2}</Badge>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">${plan.summary.standardPayment.toLocaleString()}</p>
                              <p className="text-xs text-gray-500 font-semibold uppercase">Monthly</p>
                            </div>
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-cap-red transition-colors">{plan.label}</h3>
                          <p className="text-sm text-gray-500 mb-2">{plan.description}</p>
                          <p className="text-sm text-gray-600 mb-5">
                            Total Cost: ${plan.summary.totalCost.toLocaleString()} • Interest: ${plan.summary.totalInterest.toLocaleString()}
                          </p>
                          <div className="flex gap-3 text-xs">
                            <span className="px-3 py-1.5 bg-cap-navy/10 text-cap-navy rounded-lg font-semibold">
                              {plan.summary.federalPct}% Federal
                            </span>
                            {plan.summary.privatePct > 0 && (
                              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg font-semibold">
                                {plan.summary.privatePct}% Private
                              </span>
                            )}
                        </div>
                      </Card>
                    ))}
                  </div>
                  </>
                )}

                {/* Info Box */}
                <Card className="!bg-gradient-to-br from-cap-navy/5 to-cap-navy/10 border-cap-navy/20 mt-8">
                  <div className="flex gap-5">
                    <Info size={28} className="text-cap-navy shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">How This Works</h4>
                      <p className="text-gray-600 leading-relaxed">
                        The optimizer prioritizes federal loans (lowest rates, best protections), then state programs, 
                        then private lenders. It respects annual and aggregate loan limits, projects multi-year needs 
                        with tuition growth, and calculates in-school interest based on your payment strategy.
                        <strong className="text-gray-900"> Select a plan to save all loans to your portfolio.</strong>
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Year Breakdown Modal */}
      {showBreakdown && selectedPlan && (
        <YearBreakdown 
          plan={selectedPlan} 
          onClose={() => setShowBreakdown(false)}
          onSelect={handleSelectPlan}
          onLogin={() => setPage?.('login')}
          isSaving={isSaving}
          isLoggedIn={!!user}
        />
      )}
    </div>
  );
};

export default OptimizerPage;
