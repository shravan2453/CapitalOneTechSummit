import React, { useState } from 'react';
import { Card, Button, PageHeader, Badge } from '../components/shared';
import { InfoTooltip, educationalContent } from '../components/InfoTooltip';
import { allLoans, federalLoans, privateLoans, stateLoans, repaymentStrategies, incomeDrivenPlans } from '../data/loans';
import { calculateScenario, type ScenarioInput } from '../utils/calculations';
import { exportScenarioComparison, exportAmortizationTable } from '../utils/export';
import { Plus, ArrowRight, ChevronDown, Download, FileText } from 'lucide-react';

interface ComparisonPageProps {
  setPage: (page: string) => void;
}

interface Scenario {
  id: string;
  name: string;
  loanMix: { loanId: string; amount: number }[];
  repaymentPlan: string;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  payoffDate: Date;
  yearsToPay: number;
}

const ComparisonPage: React.FC<ComparisonPageProps> = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState<'federal' | 'private' | 'state'>('federal');
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: 'A',
      name: 'Scenario A',
      loanMix: [{ loanId: 'direct-subsidized', amount: 12500 }, { loanId: 'direct-unsubsidized', amount: 20000 }],
      repaymentPlan: 'standard',
      monthlyPayment: 348,
      totalCost: 42500,
      totalInterest: 10000,
      payoffDate: new Date('2033-11-01'),
      yearsToPay: 10
    },
    {
      id: 'B',
      name: 'Scenario B',
      loanMix: [{ loanId: 'direct-unsubsidized', amount: 32500 }],
      repaymentPlan: 'save',
      monthlyPayment: 145,
      totalCost: 58200,
      totalInterest: 25700,
      payoffDate: new Date('2048-11-01'),
      yearsToPay: 25
    }
  ]);
  
  const displayedLoans = activeTab === 'federal' ? federalLoans : 
                         activeTab === 'private' ? privateLoans : 
                         stateLoans;

  const handleAddScenario = () => {
    const newScenario: Scenario = {
      id: String.fromCharCode(65 + scenarios.length),
      name: `Scenario ${String.fromCharCode(65 + scenarios.length)}`,
      loanMix: [{ loanId: 'direct-unsubsidized', amount: 30000 }],
      repaymentPlan: 'standard',
      monthlyPayment: 0,
      totalCost: 0,
      totalInterest: 0,
      payoffDate: new Date(),
      yearsToPay: 10
    };
    setScenarios([...scenarios, newScenario]);
  };

  const handleExportSummary = () => {
    exportScenarioComparison(scenarios);
  };

  const handleExportAmortization = (scenario: Scenario) => {
    // Generate amortization schedule for the scenario
    const calc = calculateScenario({
      loanAmount: scenario.loanMix.reduce((sum, loan) => sum + loan.amount, 0),
      interestRate: 5.5, // Simplified - would use actual loan rates
      termYears: scenario.yearsToPay,
      repaymentStrategy: scenario.repaymentPlan,
      startDate: new Date()
    });
    exportAmortizationTable(calc.amortizationSchedule);
  };

  return (
    <div className="animate-enter">
      <PageHeader 
        title="Loan Comparison" 
        subtitle="Compare federal, private, and state loan options to find your best fit."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
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
              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden rounded-xl border border-cap-red/20">
                    <table className="w-full text-sm text-left">
                      <thead 
                        className="text-xs font-bold text-gray-700 uppercase tracking-wider"
                        style={{
                          background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                        }}
                      >
                        <tr>
                          <th className="px-4 sm:px-6 py-3 sm:py-4">Scenario</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4">Plan Strategy</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Monthly</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Total Cost</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Years</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cap-red/10">
                        {scenarios.map((scenario) => (
                          <tr key={scenario.id} className="group hover: transition-colors">
                            <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-gray-900">{scenario.name}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 capitalize">
                              {scenario.repaymentPlan.replace('-', ' ')}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-right font-semibold text-gray-900">
                              ${scenario.monthlyPayment.toLocaleString()}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-right text-gray-600">
                              ${scenario.totalCost.toLocaleString()}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-right text-gray-600">
                              {scenario.yearsToPay}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                              <button
                                onClick={() => handleExportAmortization(scenario)}
                                className="text-cap-red hover:text-cap-redHover transition-colors"
                                title="Export Amortization Table"
                              >
                                <FileText size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
                {[
                  { label: 'Interest Range', val: '4.99% - 7.54%' },
                  { label: 'Loan Term', val: '10 - 25 Years' },
                  { label: 'Grace Period', val: '6 Months' },
                  { label: 'Origination Fee', val: '1.057%' },
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className="p-3 sm:p-4 rounded-xl border border-cap-red/20"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  >
                    <p className="text-xs text-gray-600 mb-1 break-words">{stat.label}</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base break-words">{stat.val}</p>
                  </div>
                ))}
              </div>
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
                
                <div className="h-40 sm:h-48 flex items-end justify-between gap-3 sm:gap-4 px-2 mb-4 sm:mb-6">
                  {scenarios.slice(0, 2).map((scenario, idx) => {
                    const maxCost = Math.max(...scenarios.map(s => s.totalCost));
                    const height = (scenario.totalCost / maxCost) * 100;
                    return (
                      <div key={scenario.id} className="w-full flex flex-col gap-2 group cursor-pointer">
                        <div 
                          className="w-full rounded-t-sm relative opacity-90 group-hover:opacity-100 transition-opacity bg-cap-red"
                          style={{ 
                            height: `${Math.min(height, 100)}%`,
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(200, 16, 46, 0.3)'
                          }}
                        >
                          <div 
                            className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 text-gray-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 border border-cap-red/20"
                            style={{
                              background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                              boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                            }}
                          >
                            ${(scenario.totalCost / 1000).toFixed(0)}k
                          </div>
                        </div>
                        <div className="w-full rounded-b-sm bg-cap-navy h-8 sm:h-10" style={{
                          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 48, 135, 0.3)'
                        }}></div>
                        <span className="text-xs text-center text-gray-700 font-medium">{scenario.name}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Button onClick={() => setPage('optimizer')} className="w-full text-sm">
                    Send to Optimizer <ArrowRight size={16} className="inline" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full border-cap-red/20 text-gray-900 hover:/10 hover:border-cap-red/40 text-sm"
                    onClick={handleExportSummary}
                    icon="download"
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
