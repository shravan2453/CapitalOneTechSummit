import { useEffect, useState } from 'react';
import { Card, Button, PageHeader } from '../components/shared';
import { Wallet, Calendar, Percent } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { loanService, LoanRecord } from '../services/loanService';
import { userService } from '../services/userService';

const payoffPlans: Record<string, number[]> = {
  'standard': [65, 62, 58, 55, 50, 48, 45, 42, 38, 35, 30, 25],
  'aggressive': [65, 55, 48, 42, 36, 30, 25, 20, 15, 10, 6, 3],
};

interface DashboardPageProps {
  setPage?: (page: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ setPage }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("standard");
  const payoffChartData = payoffPlans[plan];

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

  const totalBalance = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
  
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

  const nextPayment = loans.reduce((sum, loan) => sum + calculateMonthlyPayment(loan), 0);

  const getLoanColor = (index: number): string => {
    const colors = ['bg-cap-red', 'bg-cap-navy', 'bg-cap-redLight'];
    return colors[index % colors.length];
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="animate-enter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
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
        subtitle={`Welcome back${userName ? `, ${userName}` : ''}. Your loan optimization is on track.`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card highlight>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Balance</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 break-words">
                  {formatCurrency(totalBalance)}
                </h2>
              </div>
              <div 
                className="p-2 rounded-lg shrink-0 ml-2 border border-cap-red/20"
                style={{
                  background: 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                }}
              >
                <Wallet size={20} className="text-cap-red" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-gray-600">
                {loans.length} {loans.length === 1 ? 'loan' : 'loans'}
              </span>
            </div>
          </Card>
          
          <Card highlight>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Next Payment</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 break-words">
                  {formatCurrency(nextPayment)}
                </h2>
              </div>
              <div 
                className="p-2 rounded-lg shrink-0 ml-2 border border-cap-red/20"
                style={{
                  background: 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                }}
              >
                <Calendar size={20} className="text-cap-red" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-gray-600">Monthly payment estimate</span>
            </div>
          </Card>
          
          <Card highlight>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Interest Rate</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 break-words">
                  {avgInterestRate > 0 ? `${avgInterestRate.toFixed(2)}%` : 'N/A'}
                </h2>
              </div>
              <div 
                className="p-2 rounded-lg shrink-0 ml-2 border border-cap-red/20"
                style={{
                  background: 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                }}
              >
                <Percent size={20} className="text-cap-red" />
              </div>
            </div>
            <div className="h-1.5 rounded-full mt-3 overflow-hidden border border-cap-red/20" style={{
              background: 'linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 100%)',
              boxShadow: 'inset 0 1px 2px rgba(200, 16, 46, 0.1)'
            }}>
              <div 
                className="h-full rounded-full bg-cap-red" 
                style={{
                  width: `${Math.min(100, (avgInterestRate / 10) * 100)}%`,
                  boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(200, 16, 46, 0.3)'
                }}
              ></div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">Payoff Trajectory</h3>
                <select 
                  value={plan}
                  onChange={(e)=>setPlan(e.target.value)}
                  className="text-xs border border-cap-red/20 rounded-lg px-3 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cap-red/20 w-full sm:w-auto"
                  style={{
                    background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                  }}
                >
                  <option value="standard">Standard Plan</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <div className="h-48 sm:h-64 flex items-end justify-between gap-2 sm:gap-3 px-2 overflow-x-auto">
                {payoffChartData.map((h, i) => (
                  <div key={i} className="flex-1 min-w-[20px] rounded-t-lg relative group overflow-hidden border border-cap-red/20" style={{
                    height: `${h}%`,
                    background: 'linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)',
                    boxShadow: 'inset 0 1px 2px rgba(200, 16, 46, 0.1)'
                  }}>
                    <div 
                      className="absolute bottom-0 w-full transition-all duration-500 rounded-t-lg bg-cap-red" 
                      style={{
                        height: `${h * 0.8}%`,
                        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(200, 16, 46, 0.3)'
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
                <span>2023</span>
                <span>2028</span>
                <span>2033</span>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4 sm:mb-6">Loan Mix</h3>
              {loans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No loans added yet.</p>
                  <Button variant="secondary" className="text-xs sm:text-sm" onClick={() => setPage?.('my-loans')}>
                    Add Your First Loan
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 sm:space-y-4">
                    {loans.slice(0, 5).map((loan, i) => (
                      <div 
                        key={loan.id} 
                        className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-cap-red/20 hover:border-cap-red/40 transition-colors"
                        style={{
                          background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                        }}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className={`w-3 h-3 rounded-full shrink-0 ${getLoanColor(i)}`} style={{
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                          }}></div>
                          <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                            {loan.name}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap ml-2">
                          {formatCurrency(loan.amount || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-cap-red/20">
                    <Button 
                      variant="secondary" 
                      className="w-full text-xs sm:text-sm" 
                      fullWidth
                      onClick={() => setPage?.('my-loans')}
                    >
                      View All Loans
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
