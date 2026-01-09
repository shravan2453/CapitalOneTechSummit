import React, { useState } from 'react';
import { Card, Button, PageHeader } from '../components/shared';
import { InfoTooltip, educationalContent } from '../components/InfoTooltip';
import { calculateScenario, generateAmortizationSchedule, type ScenarioInput } from '../utils/calculations';
import { repaymentStrategies } from '../data/loans';
import { exportAmortizationTable } from '../utils/export';
import { ChevronDown, Save, Table2, TrendingUp } from 'lucide-react';

const CalculatorPage: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(30000);
  const [rate, setRate] = useState<number>(5.5);
  const [termYears, setTermYears] = useState<number>(10);
  const [repaymentStrategy, setRepaymentStrategy] = useState<string>('standard');
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [includeExtraPayments, setIncludeExtraPayments] = useState<boolean>(false);
  const [showAmortizationTable, setShowAmortizationTable] = useState<boolean>(false);
  
  // Calculate using utility functions
  const scenarioInput: ScenarioInput = {
    loanAmount: principal,
    interestRate: rate,
    termYears,
    repaymentStrategy,
    extraPayment: includeExtraPayments ? extraPayment : 0,
    startDate: new Date()
  };
  
  const calculation = calculateScenario(scenarioInput);
  const monthlyPayment = calculation.monthlyPayment;
  const totalCost = calculation.totalCost;
  const totalInterest = calculation.totalInterest;
  const amortizationSchedule = calculation.amortizationSchedule;

  return (
    <div className="animate-enter">
      <PageHeader 
        title="Loan Calculator" 
        subtitle="Instant feedback on how extra payments affect your timeline."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <Card highlight>
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-gray-900">Loan Principal</label>
                    <span className="text-sm font-bold text-gray-900 px-2.5 py-1 rounded-md border border-cap-red/20" style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}>
                      ${principal.toLocaleString()}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="5000" 
                    max="100000" 
                    step="1000" 
                    value={principal} 
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full mb-4 h-2"
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold text-lg">$</span>
                    <input 
                      type="number" 
                      value={principal} 
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-3 border border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none font-bold text-gray-900 text-base" style={{
                        background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                      }} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Interest Rate (%)</label>
                    <input 
                      type="number" 
                      value={rate}
                      step="0.1" 
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none font-bold text-gray-900 text-base" style={{
                        background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                      }} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Term (Years)</label>
                    <div className="relative">
                      <select 
                        value={termYears}
                        onChange={(e) => setTermYears(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none font-bold text-gray-900 text-base appearance-none cursor-pointer" style={{
                          background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                        }}
                      >
                        <option value="10">10 Years</option>
                        <option value="15">15 Years</option>
                        <option value="20">20 Years</option>
                        <option value="25">25 Years</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Repayment Strategy
                    <InfoTooltip content="Choose how you want to repay your loan. Different strategies affect total cost and monthly payments." />
                  </label>
                  <select
                    value={repaymentStrategy}
                    onChange={(e) => setRepaymentStrategy(e.target.value)}
                    className="w-full px-4 py-3 border border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none font-bold text-gray-900 text-base appearance-none cursor-pointer" style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  >
                    {repaymentStrategies.map((strategy) => (
                      <option key={strategy.id} value={strategy.id}>
                        {strategy.name} - {strategy.description}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-4 border-t border-cap-red/20">
                  <label 
                    className="flex items-center justify-between p-4 border border-cap-red/20 rounded-xl cursor-pointer transition-colors group"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                    onClick={() => setIncludeExtraPayments(!includeExtraPayments)}
                  >
                    <div>
                      <span className="block text-sm font-bold text-gray-900">Include Extra Payments</span>
                      <span className="block text-xs text-gray-600">Add monthly contributions to pay off faster</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${
                      includeExtraPayments ? 'bg-cap-red' : 'bg-gray-300'
                    }`} style={{
                      boxShadow: includeExtraPayments 
                        ? 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(200, 16, 46, 0.3)' 
                        : 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                        includeExtraPayments ? 'left-7' : 'left-1'
                      }`} style={{
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                      }}></div>
                    </div>
                  </label>
                  
                  {includeExtraPayments && (
                    <div className="mt-4">
                      <label className="block text-sm font-bold text-gray-900 mb-2">Extra Monthly Payment</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold">$</span>
                        <input
                          type="number"
                          value={extraPayment}
                          onChange={(e) => setExtraPayment(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 border border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none font-bold text-gray-900 text-base"
                          style={{
                            background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                          }}
                          placeholder="0"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Paying ${extraPayment.toLocaleString()} extra per month could save you approximately $
                        {((totalInterest - (totalCost - principal - (extraPayment * amortizationSchedule.length)))).toFixed(2)} in interest
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">Amortization Preview</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    className="text-xs h-8 px-2 shrink-0"
                    onClick={() => setShowAmortizationTable(!showAmortizationTable)}
                  >
                    {showAmortizationTable ? 'Hide Table' : 'View Table'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-xs h-8 px-2 shrink-0"
                    onClick={() => exportAmortizationTable(amortizationSchedule)}
                    icon="download"
                  >
                    Export
                  </Button>
                </div>
              </div>
              
              {showAmortizationTable ? (
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="sticky top-0 border-b border-cap-red/20" style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}>
                      <tr>
                        <th className="px-3 py-2 text-left font-bold text-gray-900">Month</th>
                        <th className="px-3 py-2 text-right font-bold text-gray-900">Payment</th>
                        <th className="px-3 py-2 text-right font-bold text-gray-900">Principal</th>
                        <th className="px-3 py-2 text-right font-bold text-gray-900">Interest</th>
                        <th className="px-3 py-2 text-right font-bold text-gray-900">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cap-red/10">
                      {amortizationSchedule.slice(0, 120).map((payment) => (
                        <tr key={payment.month} className="hover:bg-cap-red/5" style={{
                          background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)'
                        }}>
                          <td className="px-3 py-2 text-gray-900">{payment.month}</td>
                          <td className="px-3 py-2 text-right font-semibold text-gray-900">${payment.payment.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right text-gray-900">${payment.principal.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right text-gray-900">${payment.interest.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right text-gray-900">${payment.remainingBalance.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <>
                  <div className="h-48 sm:h-56 md:h-64 flex items-end gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto pb-2">
                    {amortizationSchedule.slice(0, 24).map((payment, i) => {
                      const maxBalance = Math.max(...amortizationSchedule.map(p => p.remainingBalance));
                      const h = (payment.remainingBalance / maxBalance) * 100;
                      return (
                        <div key={i} className="flex-1 min-w-[10px] sm:min-w-[12px] rounded-t-sm relative group overflow-hidden cursor-pointer border border-cap-red/20" style={{
                          background: 'linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)',
                          boxShadow: 'inset 0 1px 2px rgba(200, 16, 46, 0.1)'
                        }}>
                          <div className="absolute bottom-0 w-full bg-cap-red transition-all duration-300 group-hover:bg-cap-redHover rounded-t-sm" style={{
                            height: `${h}%`,
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(200, 16, 46, 0.3)'
                          }}></div>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-cap-red/20" style={{
                            background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                          }}>
                            Month {payment.month}: ${payment.remainingBalance.toFixed(0)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 text-xs text-gray-600 text-center">
                    Hover over bars to see remaining balance
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="border-2 border-cap-red/20 relative overflow-hidden p-6 sm:p-8" style={{
                background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 8px 16px rgba(200, 16, 46, 0.2), 0 0 0 2px rgba(200, 16, 46, 0.15)'
              }}>
                <div className="text-center border-b border-cap-red/20 pb-4 sm:pb-6 mb-4 sm:mb-6">
                  <p className="text-cap-red text-xs sm:text-sm font-medium mb-3 uppercase tracking-wide">Estimated Monthly Payment</p>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cap-red">${monthlyPayment.toFixed(2)}</h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Total Principal</span>
                    <span className="font-bold text-gray-900">${principal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Total Interest</span>
                    <span className="font-bold text-cap-red bg-cap-red/10 px-2 py-0.5 rounded whitespace-nowrap" style={{
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(200, 16, 46, 0.2)'
                    }}>
                      + ${(totalCost - principal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-base sm:text-lg pt-3 sm:pt-4 border-t border-cap-red/20">
                    <span className="font-bold text-gray-900">Total Cost</span>
                    <span className="font-bold text-cap-red">${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 pt-1">
                    <span>Payoff Date</span>
                    <span className="text-gray-900 font-medium">{calculation.payoffDate.toLocaleDateString()}</span>
                  </div>
                  {includeExtraPayments && extraPayment > 0 && (
                    <div className="mt-3 pt-3 border-t border-cap-red/20">
                      <div className="flex items-center gap-2 text-xs text-cap-red">
                        <TrendingUp size={14} />
                        <span>Extra payments save ${(totalInterest - (totalCost - principal - (extraPayment * amortizationSchedule.length))).toFixed(2)} in interest</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              <Button fullWidth variant="primary" icon="save" className="text-sm py-3">Save Calculation</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
