import React, { useState } from 'react';
import { Card, Button, PageHeader, Badge } from '../components/shared';
import { optimizeStrategy, type OptimizationWeights, type OptimizedStrategy } from '../utils/calculations';
import { generatePDFSummary, exportScenarioComparison } from '../utils/export';
import { Sliders, Trophy, CheckCircle, RefreshCw, Download, Save } from 'lucide-react';

const OptimizerPage: React.FC = () => {
  const [weights, setWeights] = useState<OptimizationWeights>({ totalCost: 80, monthlyPayment: 50, payoffSpeed: 60 });
  const [optimizedStrategies, setOptimizedStrategies] = useState<OptimizedStrategy[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const handleRunOptimization = () => {
    setIsOptimizing(true);
    // Simulate optimization (in production, this would be async)
    setTimeout(() => {
      const results = optimizeStrategy(
        32500, // Total loan amount
        ['direct-subsidized', 'direct-unsubsidized', 'sallie-mae'],
        weights,
        {
          maxMonthlyPayment: 500,
          targetPayoffYear: 2033,
          riskTolerance: 'moderate'
        }
      );
      setOptimizedStrategies(results);
      setIsOptimizing(false);
    }, 1000);
  };
  
  const handleExportPDF = () => {
    generatePDFSummary({
      profile: {},
      scenarios: optimizedStrategies.map(s => ({
        name: s.strategy,
        monthlyPayment: s.monthlyPayment,
        totalCost: s.totalCost,
        totalInterest: s.totalCost - 32500,
        payoffDate: new Date()
      })),
      selectedScenario: optimizedStrategies[0],
      optimizationResults: optimizedStrategies
    });
  };

  return (
    <div className="animate-enter">
      <PageHeader 
        title="Strategy Optimizer" 
        subtitle="AI-driven recommendations based on your financial priorities."
        action={
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button 
              variant="secondary" 
              className="text-sm" 
              icon="download"
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
            <Button variant="primary" icon="save" className="text-sm">Save Plan</Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <Card highlight className="h-full">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sliders size={20} className="text-gray-900" />
                Optimization Goals
              </h3>
              <div className="space-y-8">
                {[
                  { label: 'Minimize Total Cost', key: 'totalCost' as keyof OptimizationWeights },
                  { label: 'Lower Monthly Payment', key: 'monthlyPayment' as keyof OptimizationWeights },
                  { label: 'Payoff Speed', key: 'payoffSpeed' as keyof OptimizationWeights }
                ].map(item => (
                  <div key={item.key}>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-bold text-gray-900">{item.label}</span>
                      <span className="text-gray-900 font-bold">{weights[item.key]}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0"
                      max="100"
                      value={weights[item.key]} 
                      onChange={(e) => setWeights({...weights, [item.key]: Number(e.target.value)})} 
                      className="w-full" 
                    />
                  </div>
                ))}
                <div className="pt-6 border-t border-cap-red/10">
                  <Button 
                    fullWidth 
                    icon="refresh-cw"
                    onClick={handleRunOptimization}
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {optimizedStrategies.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Run optimization to see recommended strategies</p>
                  <p className="text-sm text-gray-600">Adjust the weights above and click "Run Optimization"</p>
                </div>
              </Card>
            ) : (
              <>
                {/* Top Pick */}
                {optimizedStrategies[0] && (
                  <Card className="border-2 border-cap-red/20 shadow-float relative overflow-hidden">
                    <div className="absolute top-0 right-0">
                      <div 
                        className="text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-lg"
                        style={{
                          background: 'linear-gradient(145deg, #C8102E 0%, #E0112F 50%, #a30d25 100%)',
                          boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(163, 13, 37, 0.5), 0 4px 8px rgba(200, 16, 46, 0.3)'
                        }}
                      >
                        #1 Recommendation
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
                      <div 
                        className="p-4 rounded-2xl text-gray-900 shrink-0"
                        style={{
                          background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                          boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 4px 8px rgba(200, 16, 46, 0.15), 0 0 0 1px rgba(200, 16, 46, 0.1)'
                        }}
                      >
                        <Trophy size={32} className="text-cap-red" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{optimizedStrategies[0].strategy}</h2>
                        <p className="text-gray-600 font-medium mt-1">
                          Repayment Plan: {optimizedStrategies[0].repaymentPlan}
                        </p>
                      </div>
                    </div>

                    <div 
                      className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl border-2 border-cap-red/20"
                      style={{
                        background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                      }}
                    >
                      <div>
                        <p className="text-xs text-gray-600 font-bold uppercase mb-1">Monthly Pay</p>
                        <p className="text-lg sm:text-xl font-extrabold text-gray-900 break-words">
                          ${optimizedStrategies[0].monthlyPayment.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold uppercase mb-1">Total Cost</p>
                        <p className="text-lg sm:text-xl font-extrabold text-gray-900 break-words">
                          ${optimizedStrategies[0].totalCost.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold uppercase mb-1">Payoff Years</p>
                        <p className="text-lg sm:text-xl font-extrabold text-gray-900 break-words">
                          {optimizedStrategies[0].payoffYears.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold uppercase mb-1">Optimization Score</p>
                        <p className="text-lg sm:text-xl font-extrabold text-gray-900 break-words">
                          {optimizedStrategies[0].score.toFixed(0)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Loan Mix</h4>
                      <div className="space-y-2">
                        {optimizedStrategies[0].loanMix.map((loan, i) => (
                          <div 
                            key={i} 
                            className="flex items-center justify-between text-sm text-gray-900 p-3 rounded-lg border-2 border-cap-red/10"
                            style={{
                              background: 'linear-gradient(145deg, #F5F5F5 0%, #E5E5E5 100%)',
                              boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            <span className="font-semibold capitalize">{loan.loanId.replace('-', ' ')}</span>
                            <span className="text-gray-900 font-bold">${loan.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Alternatives */}
                {optimizedStrategies.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {optimizedStrategies.slice(1).map((strategy, idx) => (
                      <Card key={idx} className="hover:border-cap-red/40 transition-colors">
                        <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                          <Badge color="navy" className="shrink-0">Rank #{idx + 2}</Badge>
                          <div className="text-right shrink-0">
                            <p className="text-lg sm:text-xl font-bold text-gray-900">
                              ${strategy.monthlyPayment.toFixed(0)}
                            </p>
                            <p className="text-[10px] text-gray-600 font-bold uppercase">Monthly</p>
                          </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">{strategy.strategy}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                          Total Cost: ${strategy.totalCost.toFixed(0)} | Payoff: {strategy.payoffYears.toFixed(1)} years
                        </p>
                        <Button variant="secondary" fullWidth className="text-xs h-8 sm:h-9">View Details</Button>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizerPage;
