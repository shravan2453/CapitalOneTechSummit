import { useEffect, useState } from 'react';
import { Card, Button, PageHeader, Badge } from '../components/shared';
import { Wallet, Calendar, Percent, TrendingUp, GraduationCap, Target, BarChart3, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { loanService, LoanRecord } from '../services/loanService';
import { userService } from '../services/userService';

interface DashboardPageProps {
  setPage?: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setPage }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          setUserName(authData.user.user_metadata?.full_name || authData.user.email || null);
          
          const userRecord = await userService.getUserByEmail(authData.user.email || '');
          if (userRecord) {
            const userLoans = await loanService.getAllLoans();
            setLoans(userLoans);
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate metrics
  const totalBalance = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
  
  // Paid/Unpaid tracking
  const paidLoans = loans.filter(loan => loan.is_paid);
  const unpaidLoans = loans.filter(loan => !loan.is_paid);
  const paidBalance = paidLoans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
  const unpaidBalance = unpaidLoans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
  const progressPercentage = totalBalance > 0 ? (paidBalance / totalBalance) * 100 : 0;
  
  const avgInterestRate = loans.length > 0
    ? loans.reduce((sum, loan) => sum + loan.interest_rate, 0) / loans.length
    : 0;

  const calculateMonthlyPayment = (loan: LoanRecord): number => {
    if (!loan.amount || loan.amount <= 0 || !loan.interest_rate || loan.term_years <= 0) {
      return 0;
    }
    const monthlyRate = loan.interest_rate / 100 / 12;
    const numPayments = loan.term_years * 12;
    if (monthlyRate === 0) {
      return loan.amount / numPayments;
    }
    return (loan.amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const totalMonthlyPayment = loans.reduce((sum, loan) => sum + calculateMonthlyPayment(loan), 0);

  const calculateTotalInterest = (loan: LoanRecord): number => {
    const monthlyPayment = calculateMonthlyPayment(loan);
    const totalPayments = monthlyPayment * loan.term_years * 12;
    return totalPayments - (loan.amount || 0);
  };

  const totalInterest = loans.reduce((sum, loan) => sum + calculateTotalInterest(loan), 0);
  const totalCost = totalBalance + totalInterest;

  // Group loans by type
  const loansByType = {
    federal: loans.filter(l => l.type === 'federal'),
    state: loans.filter(l => l.type === 'state'),
    private: loans.filter(l => l.type === 'private'),
  };

  const federalTotal = loansByType.federal.reduce((sum, l) => sum + (l.amount || 0), 0);
  const stateTotal = loansByType.state.reduce((sum, l) => sum + (l.amount || 0), 0);
  const privateTotal = loansByType.private.reduce((sum, l) => sum + (l.amount || 0), 0);

  // Group loans by year level
  const loansByYear = loans.reduce((acc, loan) => {
    const year = loan.year_level || 'unspecified';
    if (!acc[year]) acc[year] = [];
    acc[year].push(loan);
    return acc;
  }, {} as Record<string, LoanRecord[]>);

  const yearOrder = ['freshman', 'sophomore', 'junior', 'senior', 'unspecified'];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLoanTypeColor = (type: string): string => {
    switch (type) {
      case 'federal': return 'bg-cap-navy';
      case 'state': return 'bg-green-500';
      case 'private': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="animate-enter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-cap-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-enter">
      <PageHeader 
        title="Financial Overview" 
        subtitle={`Welcome back${userName ? `, ${userName}` : ''}. ${loans.length > 0 ? 'Your loan portfolio is set up.' : 'Get started by optimizing your loans.'}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {loans.length === 0 ? (
          /* Empty State */
          <Card className="!py-20">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-cap-red/10 to-cap-red/5 flex items-center justify-center">
                <BarChart3 size={48} className="text-cap-red" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Loans Yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                Use the Loan Optimizer to create a personalized funding plan, or add loans manually.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" onClick={() => setPage?.('optimizer')}>
                  <Target size={18} className="mr-2" />
                  Open Loan Optimizer
                </Button>
                <Button variant="secondary" onClick={() => setPage?.('my-loans')}>
                  <Wallet size={18} className="mr-2" />
                  Add Loans Manually
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Loan Progress Card */}
            <Card highlight className="mb-8 !p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-xl mb-4">Loan Repayment Progress</h3>
                  
                  {/* Progress Bar */}
                  <div className="relative h-4 rounded-full overflow-hidden bg-gray-200 mb-4">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {formatCurrency(paidBalance)} paid of {formatCurrency(totalBalance)}
                    </span>
                    <span className="font-bold text-green-600">{progressPercentage.toFixed(1)}% complete</span>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex gap-6 lg:gap-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Circle size={18} className="text-amber-500" />
                      <span className="text-2xl font-bold text-gray-900">{unpaidLoans.length}</span>
                    </div>
                    <p className="text-sm text-gray-500">Unpaid</p>
                    <p className="text-xs text-amber-600 font-medium">{formatCurrency(unpaidBalance)}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CheckCircle2 size={18} className="text-green-500" />
                      <span className="text-2xl font-bold text-gray-900">{paidLoans.length}</span>
                    </div>
                    <p className="text-sm text-gray-500">Paid Off</p>
                    <p className="text-xs text-green-600 font-medium">{formatCurrency(paidBalance)}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Wallet size={18} className="text-gray-500" />
                      <span className="text-2xl font-bold text-gray-900">{loans.length}</span>
                    </div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xs text-gray-600 font-medium">{formatCurrency(totalBalance)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <Card highlight className="!p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Remaining Balance</p>
                    <h2 className="text-3xl font-bold text-amber-600 mt-2">
                      {formatCurrency(unpaidBalance)}
                    </h2>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-100">
                    <Wallet size={24} className="text-amber-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {unpaidLoans.length} {unpaidLoans.length === 1 ? 'loan' : 'loans'} remaining
                </p>
              </Card>
              
              <Card highlight className="!p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Monthly Payment</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2">
                      {formatCurrency(totalMonthlyPayment)}
                    </h2>
                  </div>
                  <div className="p-3 rounded-xl bg-green-100">
                    <Calendar size={24} className="text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  After graduation
                </p>
              </Card>
              
              <Card highlight className="!p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Interest</p>
                    <h2 className="text-3xl font-bold text-cap-red mt-2">
                      {formatCurrency(totalInterest)}
                    </h2>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-100">
                    <TrendingUp size={24} className="text-amber-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Over loan term
                </p>
              </Card>
              
              <Card highlight className="!p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Avg. Interest Rate</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2">
                      {avgInterestRate > 0 ? `${avgInterestRate.toFixed(2)}%` : 'N/A'}
                    </h2>
                  </div>
                  <div className="p-3 rounded-xl bg-cap-navy/10">
                    <Percent size={24} className="text-cap-navy" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Weighted average
                </p>
              </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Loan Mix Chart */}
              <div className="lg:col-span-2">
                <Card className="h-full !p-8">
                  <h3 className="font-bold text-gray-900 text-xl mb-6">Portfolio Breakdown</h3>
                  
                  {/* Source Mix Bar */}
                  <div className="mb-8">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">By Loan Source</p>
                    <div className="flex gap-1 h-6 rounded-full overflow-hidden bg-gray-100 mb-4">
                      {federalTotal > 0 && (
                        <div 
                          className="bg-cap-navy h-full transition-all rounded-l-full" 
                          style={{ width: `${(federalTotal / totalBalance) * 100}%` }}
                        />
                      )}
                      {stateTotal > 0 && (
                        <div 
                          className="bg-green-500 h-full transition-all" 
                          style={{ width: `${(stateTotal / totalBalance) * 100}%` }}
                        />
                      )}
                      {privateTotal > 0 && (
                        <div 
                          className="bg-amber-500 h-full transition-all rounded-r-full" 
                          style={{ width: `${(privateTotal / totalBalance) * 100}%` }}
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-6">
                      {federalTotal > 0 && (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-cap-navy"></div>
                          <div>
                            <span className="font-bold text-gray-900">{formatCurrency(federalTotal)}</span>
                            <span className="text-gray-500 text-sm ml-2">Federal ({Math.round((federalTotal / totalBalance) * 100)}%)</span>
                          </div>
                        </div>
                      )}
                      {stateTotal > 0 && (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <div>
                            <span className="font-bold text-gray-900">{formatCurrency(stateTotal)}</span>
                            <span className="text-gray-500 text-sm ml-2">State ({Math.round((stateTotal / totalBalance) * 100)}%)</span>
                          </div>
                        </div>
                      )}
                      {privateTotal > 0 && (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                          <div>
                            <span className="font-bold text-gray-900">{formatCurrency(privateTotal)}</span>
                            <span className="text-gray-500 text-sm ml-2">Private ({Math.round((privateTotal / totalBalance) * 100)}%)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* By Year Level */}
                  {Object.keys(loansByYear).length > 1 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">By Year Level</p>
                      <div className="space-y-4">
                        {yearOrder.filter(year => loansByYear[year]).map(year => {
                          const yearLoans = loansByYear[year];
                          const yearTotal = yearLoans.reduce((sum, l) => sum + (l.amount || 0), 0);
                          return (
                            <div key={year} className="flex items-center gap-4">
                              <div className="w-28 shrink-0">
                                <span className="text-sm font-semibold text-gray-700 capitalize">{year}</span>
                              </div>
                              <div className="flex-1 h-8 rounded-lg overflow-hidden bg-gray-100 flex">
                                {yearLoans.map((loan, i) => (
                                  <div 
                                    key={i}
                                    className={`h-full ${getLoanTypeColor(loan.type)}`}
                                    style={{ width: `${((loan.amount || 0) / yearTotal) * 100}%` }}
                                    title={`${loan.name}: ${formatCurrency(loan.amount || 0)}`}
                                  />
                                ))}
                              </div>
                              <div className="w-24 text-right shrink-0">
                                <span className="font-bold text-gray-900">{formatCurrency(yearTotal)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Total Cost Summary */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Total Cost (Principal + Interest)</span>
                      <span className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Loan List */}
              <div>
                <Card className="h-full !p-6">
                  <h3 className="font-bold text-gray-900 text-xl mb-6">Your Loans</h3>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {loans.slice(0, 10).map((loan) => (
                      <div 
                        key={loan.id} 
                        className={`p-4 rounded-xl border-2 transition-all ${
                          loan.is_paid 
                            ? 'border-green-200 bg-green-50/50' 
                            : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {loan.is_paid ? (
                              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                            ) : (
                              <div className={`w-3 h-3 rounded-full shrink-0 ${getLoanTypeColor(loan.type)}`}></div>
                            )}
                            <span className={`text-sm font-bold truncate ${loan.is_paid ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {loan.name}
                            </span>
                          </div>
                          {loan.is_paid ? (
                            <Badge color="green" className="shrink-0 text-xs">Paid</Badge>
                          ) : (
                            <Badge color={loan.type === 'federal' ? 'navy' : loan.type === 'state' ? 'green' : 'amber'} className="shrink-0 text-xs">
                              {loan.type}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-lg font-bold ${loan.is_paid ? 'text-gray-400' : 'text-gray-900'}`}>
                            {formatCurrency(loan.amount || 0)}
                          </span>
                          <span className="text-sm text-gray-500">{Number(loan.interest_rate).toFixed(2)}% • {loan.term_years}yr</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {loans.length > 10 && (
                    <p className="text-sm text-gray-500 text-center mt-4">
                      +{loans.length - 10} more loans
                    </p>
                  )}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button 
                      variant="secondary" 
                      fullWidth
                      onClick={() => setPage?.('my-loans')}
                    >
                      View All Loans
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Card className="!p-6 hover:border-cap-red/40 transition-colors cursor-pointer group" onClick={() => setPage?.('optimizer')}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cap-red/10 group-hover:bg-cap-red/20 transition-colors">
                    <Target size={24} className="text-cap-red" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-cap-red transition-colors">Re-optimize Plan</h4>
                    <p className="text-sm text-gray-500">Adjust your strategy</p>
                  </div>
                </div>
              </Card>
              <Card className="!p-6 hover:border-cap-red/40 transition-colors cursor-pointer group" onClick={() => setPage?.('calculator')}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-100 group-hover:bg-green-200 transition-colors">
                    <BarChart3 size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-cap-red transition-colors">Loan Calculator</h4>
                    <p className="text-sm text-gray-500">Run payment scenarios</p>
                  </div>
                </div>
              </Card>
              <Card className="!p-6 hover:border-cap-red/40 transition-colors cursor-pointer group" onClick={() => setPage?.('education')}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cap-navy/10 group-hover:bg-cap-navy/20 transition-colors">
                    <GraduationCap size={24} className="text-cap-navy" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-cap-red transition-colors">Learn More</h4>
                    <p className="text-sm text-gray-500">Loan education center</p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
