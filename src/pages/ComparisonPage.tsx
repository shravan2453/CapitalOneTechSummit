import React, { useState } from 'react';
import { Card, Button, PageHeader, Badge } from '../components/shared';
import { InfoTooltip, educationalContent } from '../components/InfoTooltip';
import { allLoans, federalLoans, privateLoans, stateLoans, repaymentStrategies, incomeDrivenPlans } from '../data/loans';
import { calculateLoanMixScenario, type LoanMixScenarioInput } from '../utils/calculations';
import { exportScenarioComparison, exportAmortizationTable } from '../utils/export';
import { Plus, ArrowRight, ChevronDown, Download, FileText, Edit2, Trash2, X, Check } from 'lucide-react';

interface ComparisonPageProps {
  setPage: (page: string) => void;
}

interface Scenario {
  id: string;
  name: string;
  loanMix: { loanId: string; amount: number }[];
  repaymentPlan: string;
  termYears: number;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  payoffDate: Date;
  yearsToPay: number;
}

const ComparisonPage: React.FC<ComparisonPageProps> = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState<'federal' | 'private' | 'state'>('federal');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [editingScenario, setEditingScenario] = useState<string | null>(null);
  const [editingLoanMix, setEditingLoanMix] = useState<{ loanId: string; amount: number }[]>([]);
  const [editingRepaymentPlan, setEditingRepaymentPlan] = useState<string>('standard');
  const [editingTermYears, setEditingTermYears] = useState<number>(10);
  const [showAddLoanModal, setShowAddLoanModal] = useState(false);
  
  const displayedLoans = activeTab === 'federal' ? federalLoans : 
                         activeTab === 'private' ? privateLoans : 
                         stateLoans;

  // Calculate scenario values when loan mix or plan changes
  const calculateScenarioValues = (loanMix: { loanId: string; amount: number }[], repaymentPlan: string, termYears: number): Omit<Scenario, 'id' | 'name'> => {
    if (loanMix.length === 0 || loanMix.reduce((sum, loan) => sum + loan.amount, 0) === 0) {
      return {
        loanMix,
        repaymentPlan,
        termYears,
        monthlyPayment: 0,
        totalCost: 0,
        totalInterest: 0,
        payoffDate: new Date(),
        yearsToPay: termYears
      };
    }

    try {
      const calc = calculateLoanMixScenario({
        loanMix,
        loans: allLoans,
        termYears,
        repaymentStrategy: repaymentPlan,
        startDate: new Date()
      });

      return {
        loanMix,
        repaymentPlan,
        termYears,
        monthlyPayment: calc.monthlyPayment,
        totalCost: calc.totalCost,
        totalInterest: calc.totalInterest,
        payoffDate: calc.payoffDate,
        yearsToPay: Math.ceil(calc.amortizationSchedule.length / 12)
      };
    } catch (error) {
      console.error('Calculation error:', error);
      return {
        loanMix,
        repaymentPlan,
        termYears,
        monthlyPayment: 0,
        totalCost: 0,
        totalInterest: 0,
        payoffDate: new Date(),
        yearsToPay: termYears
      };
    }
  };

  // Recalculate scenarios when loan mix, plan, or term changes (but only for saved scenarios)
  // Calculations happen on save, so we don't need this useEffect

  const handleAddScenario = () => {
    const newId = String.fromCharCode(65 + scenarios.length);
    const newScenario: Scenario = {
      id: newId,
      name: `Scenario ${newId}`,
      loanMix: [],
      repaymentPlan: 'standard',
      termYears: 10,
      monthlyPayment: 0,
      totalCost: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      yearsToPay: 10
    };
    setScenarios([...scenarios, newScenario]);
    setEditingScenario(newId);
    setEditingLoanMix([]);
    setEditingRepaymentPlan('standard');
    setEditingTermYears(10);
  };

  const handleEditScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setEditingScenario(scenarioId);
      setEditingLoanMix([...scenario.loanMix]);
      setEditingRepaymentPlan(scenario.repaymentPlan);
      setEditingTermYears(scenario.termYears);
    }
  };

  const handleSaveScenario = (scenarioId: string) => {
    const calculated = calculateScenarioValues(editingLoanMix, editingRepaymentPlan, editingTermYears);
    setScenarios(scenarios.map(s => 
      s.id === scenarioId 
        ? { ...s, ...calculated, loanMix: editingLoanMix, repaymentPlan: editingRepaymentPlan, termYears: editingTermYears }
        : s
    ));
    setEditingScenario(null);
  };

  const handleCancelEdit = () => {
    setEditingScenario(null);
  };

  const handleDeleteScenario = (scenarioId: string) => {
    if (confirm('Are you sure you want to delete this scenario?')) {
      setScenarios(scenarios.filter(s => s.id !== scenarioId));
      if (editingScenario === scenarioId) {
        setEditingScenario(null);
      }
    }
  };

  const handleAddLoanToMix = (loanId: string) => {
    const existing = editingLoanMix.find(l => l.loanId === loanId);
    if (existing) {
      setEditingLoanMix(editingLoanMix.map(l => 
        l.loanId === loanId ? { ...l, amount: l.amount + 5000 } : l
      ));
    } else {
      setEditingLoanMix([...editingLoanMix, { loanId, amount: 10000 }]);
    }
    setShowAddLoanModal(false);
  };

  const handleUpdateLoanAmount = (loanId: string, amount: number) => {
    setEditingLoanMix(editingLoanMix.map(l => 
      l.loanId === loanId ? { ...l, amount: Math.max(0, amount) } : l
    ));
  };

  const handleRemoveLoanFromMix = (loanId: string) => {
    setEditingLoanMix(editingLoanMix.filter(l => l.loanId !== loanId));
  };

  const handleExportSummary = () => {
    exportScenarioComparison(scenarios);
  };

  const handleExportAmortization = (scenario: Scenario) => {
    const calc = calculateLoanMixScenario({
      loanMix: scenario.loanMix,
      loans: allLoans,
      termYears: scenario.termYears,
      repaymentStrategy: scenario.repaymentPlan,
      startDate: new Date()
    });
    exportAmortizationTable(calc.amortizationSchedule);
  };

  const getLoanName = (loanId: string) => {
    const loan = allLoans.find(l => l.id === loanId);
    return loan?.name || loanId;
  };

  const getLoanRate = (loanId: string) => {
    const loan = allLoans.find(l => l.id === loanId);
    if (loan?.interestRate.fixed) {
      return `${loan.interestRate.fixed}%`;
    } else if (loan?.interestRate.range) {
      return `${loan.interestRate.range.min}% - ${loan.interestRate.range.max}%`;
    }
    return 'N/A';
  };

  return (
    <div className="animate-enter">
      <PageHeader 
        title="Loan Comparison" 
        subtitle="Compare federal, private, and state loan options to find your best fit."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        {/* Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className=" p-1 sm:p-1.5 rounded-2xl shadow-premium inline-flex relative z-10 flex-wrap justify-center gap-1">
            {(['federal', 'private', 'state'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap text-gray-900 ${
                  activeTab === tab 
                  ? 'shadow-lg' 
                  : 'hover:bg-white/10'
                }`}
                style={activeTab === tab ? {
                  background: 'linear-gradient(145deg, #C8102E 0%, #E0112F 50%, #a30d25 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(163, 13, 37, 0.5), 0 4px 8px rgba(200, 16, 46, 0.3)'
                } : {
                  background: 'transparent'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Loans
              </button>
            ))}
          </div>
        </div>

        {/* Loan Database Display */}
        <div className="mb-8">
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Available {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Loans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedLoans.map((loan) => (
                <div 
                  key={loan.id} 
                  className="p-4 border border-cap-red/20 rounded-xl hover:border-cap-red/40 transition-colors"
                  style={{
                    background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.1), inset 0 -1px 2px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{loan.name}</h4>
                    <Badge color={loan.type === 'federal' ? 'blue' : loan.type === 'private' ? 'red' : 'green'}>
                      {loan.type}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">Rate: </span>
                      {loan.interestRate.fixed 
                        ? `${loan.interestRate.fixed}%` 
                        : loan.interestRate.range 
                        ? `${loan.interestRate.range.min}% - ${loan.interestRate.range.max}%`
                        : 'Variable'}
                    </p>
                    <p>
                      <span className="font-semibold">Fee: </span>
                      {loan.originationFee}%
                      <InfoTooltip content={educationalContent.originationFee.content} title={educationalContent.originationFee.title} />
                    </p>
                    <p>
                      <span className="font-semibold">Grace: </span>
                      {loan.gracePeriod} months
                      <InfoTooltip content={educationalContent.gracePeriod.content} title={educationalContent.gracePeriod.title} />
                    </p>
                    {loan.loanLimit.annual && (
                      <p>
                        <span className="font-semibold">Annual Limit: </span>
                        ${loan.loanLimit.annual.toLocaleString()}
                      </p>
                    )}
                  </div>
                  {editingScenario && (
                    <button
                      onClick={() => handleAddLoanToMix(loan.id)}
                      className="mt-3 w-full px-3 py-1.5 text-xs font-semibold text-cap-red border border-cap-red/30 rounded-lg hover:bg-cap-red/10 transition-colors"
                    >
                      Add to Scenario
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Scenario Builder */}
          <div className="lg:col-span-8 space-y-6">
            <Card highlight>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Scenario Builder</h3>
                <Button variant="secondary" className="px-3 py-1.5 h-8 text-xs shrink-0 w-full sm:w-auto" icon="plus" onClick={handleAddScenario}>
                  Add Scenario
                </Button>
              </div>

              {scenarios.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">No scenarios yet. Click "Add Scenario" to create your first comparison.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <div 
                      key={scenario.id} 
                      className="border border-cap-red/20 rounded-xl p-4"
                        style={{
                        background: editingScenario === scenario.id 
                          ? 'linear-gradient(145deg, #FFF5F5 0%, #FFFFFF 50%, #F9FAFB 100%)'
                          : 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                        }}
                      >
                      {editingScenario === scenario.id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-gray-900">{scenario.name}</h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveScenario(scenario.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Save"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                title="Cancel"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>

                          {/* Loan Mix Editor */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Mix</label>
                            {editingLoanMix.length === 0 ? (
                              <p className="text-sm text-gray-500 mb-2">No loans added. Click "Add to Scenario" on loan cards above.</p>
                            ) : (
                              <div className="space-y-2">
                                {editingLoanMix.map((loan) => (
                                  <div key={loan.loanId} className="flex items-center gap-2 p-2 bg-white rounded border border-cap-red/10">
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-gray-900">{getLoanName(loan.loanId)}</p>
                                      <p className="text-xs text-gray-500">Rate: {getLoanRate(loan.loanId)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-600">$</span>
                                      <input
                                        type="number"
                                        value={loan.amount}
                                        onChange={(e) => handleUpdateLoanAmount(loan.loanId, parseFloat(e.target.value) || 0)}
                                        className="w-24 px-2 py-1 text-sm border border-cap-red/20 rounded focus:outline-none focus:ring-2 focus:ring-cap-red/50"
                                        min="0"
                                        step="1000"
                                      />
                                      <button
                                        onClick={() => handleRemoveLoanFromMix(loan.loanId)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Remove"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Repayment Plan Selector */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Repayment Plan</label>
                            <select
                              value={editingRepaymentPlan}
                              onChange={(e) => setEditingRepaymentPlan(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-cap-red/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cap-red/50"
                            >
                              {repaymentStrategies.map((strategy) => (
                                <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                              ))}
                              {incomeDrivenPlans.map((plan) => (
                                <option key={plan.id} value={plan.id}>{plan.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* Term Years */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Term (Years)</label>
                            <input
                              type="number"
                              value={editingTermYears}
                              onChange={(e) => setEditingTermYears(parseInt(e.target.value) || 10)}
                              className="w-full px-3 py-2 text-sm border border-cap-red/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cap-red/50"
                              min="5"
                              max="30"
                              step="1"
                            />
                          </div>

                          {/* Preview Calculations */}
                          {editingLoanMix.length > 0 && (
                            <div className="pt-2 border-t border-cap-red/10">
                              <p className="text-xs text-gray-600 mb-1">Preview (will update on save):</p>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-600">Monthly:</span>
                                  <span className="ml-1 font-semibold text-gray-900">
                                    ${calculateScenarioValues(editingLoanMix, editingRepaymentPlan, editingTermYears).monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Total:</span>
                                  <span className="ml-1 font-semibold text-gray-900">
                                    ${calculateScenarioValues(editingLoanMix, editingRepaymentPlan, editingTermYears).totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Interest:</span>
                                  <span className="ml-1 font-semibold text-gray-900">
                                    ${calculateScenarioValues(editingLoanMix, editingRepaymentPlan, editingTermYears).totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </span>
                  </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // View Mode
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900">{scenario.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {scenario.loanMix.length > 0 
                                  ? scenario.loanMix.map(l => `${getLoanName(l.loanId)} ($${l.amount.toLocaleString()})`).join(', ')
                                  : 'No loans added'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditScenario(scenario.id)}
                                className="p-1.5 text-cap-red hover:bg-cap-red/10 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteScenario(scenario.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                </div>
              </div>
              
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Plan</p>
                              <p className="font-semibold text-gray-900 capitalize">{scenario.repaymentPlan.replace('-', ' ')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Monthly</p>
                              <p className="font-semibold text-gray-900">${scenario.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Total Cost</p>
                              <p className="font-semibold text-gray-900">${scenario.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Total Interest</p>
                              <p className="font-semibold text-gray-900">${scenario.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Years</p>
                              <p className="font-semibold text-gray-900">{scenario.yearsToPay}</p>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
              )}
            </Card>

            {/* Repayment Strategy Options */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Repayment Strategy Options
                <InfoTooltip content={educationalContent.incomeDriven.content} title={educationalContent.incomeDriven.title} />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repaymentStrategies.map((strategy) => (
                  <div 
                    key={strategy.id} 
                    className="p-4 border border-cap-red/20 rounded-xl hover:border-cap-red/40 transition-colors"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  >
                    <h4 className="font-bold text-gray-900 mb-2">{strategy.name}</h4>
                    <p className="text-sm text-gray-700 mb-2">{strategy.description}</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><span className="font-semibold">During School:</span> {strategy.duringSchool}</p>
                      <p><span className="font-semibold">After School:</span> {strategy.afterSchool}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Income-Driven Plans */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Income-Driven Repayment Plans
              </h3>
              <div className="space-y-3">
                {incomeDrivenPlans.map((plan) => (
                  <div 
                    key={plan.id} 
                    className="p-4 rounded-xl border border-cap-red/20 transition-colors"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{plan.name}</h4>
                      <Badge color="blue">IDR</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{plan.description}</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><span className="font-semibold">Eligibility:</span> {plan.eligibility}</p>
                      <p><span className="font-semibold">Forgiveness:</span> {plan.forgiveness}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Charts & Actions */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-2 border-cap-red/20 h-full relative overflow-hidden p-4 sm:p-6" style={{
              background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
              boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 8px 16px rgba(200, 16, 46, 0.2), 0 0 0 2px rgba(200, 16, 46, 0.15)'
            }}>
              <div className="relative z-10">
                <h3 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg text-gray-900">Cumulative Cost Analysis</h3>
                
                {scenarios.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <p>Create scenarios to see cost comparison</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 sm:mb-6">
                      {/* Tooltip area - separate container above chart */}
                      <div className="h-10 mb-2 relative">
                        {scenarios.map((scenario, index) => {
                          const barWidth = 100 / scenarios.length;
                          const barCenter = (index * barWidth) + (barWidth / 2);
                          
                          return (
                            <div
                              key={`tooltip-${scenario.id}`}
                              data-tooltip-id={`tooltip-${scenario.id}`}
                              className="absolute opacity-0 transition-opacity pointer-events-none"
                              style={{
                                left: `${barCenter}%`,
                                transform: 'translateX(-50%)',
                                zIndex: 50
                              }}
                            >
                              <div 
                                className="text-gray-900 text-xs font-bold px-2 py-1 rounded border border-cap-navy/20 whitespace-nowrap"
                                style={{
                                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                                  boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 48, 135, 0.2), 0 2px 4px rgba(0, 48, 135, 0.1)'
                                }}
                              >
                                ${(scenario.totalCost / 1000).toFixed(0)}k
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="h-40 sm:h-48 flex items-end justify-between gap-3 sm:gap-4 px-2 overflow-x-auto">
                        {(() => {
                          // Calculate maxCost once outside the map
                          const maxCost = Math.max(...scenarios.map(s => s.totalCost || 0), 1);
                          // Container height in pixels (h-40 = 10rem = 160px, sm:h-48 = 12rem = 192px)
                          const containerHeightPx = 160; // Base height for h-40
                          
                          return scenarios.map((scenario, index) => {
                            const heightPercent = maxCost > 0 && scenario.totalCost > 0 
                              ? (scenario.totalCost / maxCost) * 100 
                              : 0;
                            // Calculate actual pixel height
                            const barHeightPx = (containerHeightPx * heightPercent) / 100;
                            
                            return (
                              <div 
                                key={scenario.id} 
                                className="flex-1 flex flex-col items-center justify-end gap-2 cursor-pointer min-w-0"
                                onMouseEnter={() => {
                                  const tooltip = document.querySelector(`[data-tooltip-id="tooltip-${scenario.id}"]`) as HTMLElement;
                                  if (tooltip) tooltip.style.opacity = '1';
                                }}
                                onMouseLeave={() => {
                                  const tooltip = document.querySelector(`[data-tooltip-id="tooltip-${scenario.id}"]`) as HTMLElement;
                                  if (tooltip) tooltip.style.opacity = '0';
                                }}
                              >
                                <div className="w-full flex flex-col items-center justify-end" style={{ height: `${containerHeightPx}px` }}>
                                  <div 
                                    className="w-full rounded-t-lg opacity-90 hover:opacity-100 transition-opacity bg-cap-navy"
                                    style={{ 
                                      height: `${barHeightPx}px`,
                                      minHeight: scenario.totalCost > 0 ? '4px' : '0',
                                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 2px 4px rgba(0, 48, 135, 0.3)'
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-center text-gray-700 font-medium">{scenario.name}</span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Summary Table */}
                    <div className="mb-4 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-cap-red/20">
                            <th className="text-left py-2 font-semibold text-gray-700">Scenario</th>
                            <th className="text-right py-2 font-semibold text-gray-700">Monthly</th>
                            <th className="text-right py-2 font-semibold text-gray-700">Total Cost</th>
                            <th className="text-right py-2 font-semibold text-gray-700">Interest</th>
                            <th className="text-right py-2 font-semibold text-gray-700">Years</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scenarios.map((scenario) => (
                            <tr key={scenario.id} className="border-b border-cap-red/10">
                              <td className="py-2 font-semibold text-gray-900">{scenario.name}</td>
                              <td className="py-2 text-right text-gray-600">${scenario.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="py-2 text-right text-gray-600">${scenario.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="py-2 text-right text-gray-600">${scenario.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td className="py-2 text-right text-gray-600">{scenario.yearsToPay}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                <div className="space-y-2 sm:space-y-3">
                  <Button onClick={() => setPage('optimizer')} className="w-full text-sm">
                    Send to Optimizer <ArrowRight size={16} className="inline" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full border-cap-red/20 text-gray-900 hover:/10 hover:border-cap-red/40 text-sm"
                    onClick={handleExportSummary}
                    icon="download"
                    disabled={scenarios.length === 0}
                  >
                    Export Summary
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
