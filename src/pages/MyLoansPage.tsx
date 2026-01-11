import React, { useState, useEffect } from 'react';
import { loanService, LoanRecord, CreateLoanData } from '../services/loanService';
import { Card, Button, PageHeader, Badge } from '../components/shared';
import { Trash2, Edit2, X, Wallet, ChevronDown, ChevronUp, Plus, CheckCircle2, Circle, Check } from 'lucide-react';

const MyLoansPage: React.FC = () => {
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});
  
  const [loanFormData, setLoanFormData] = useState<CreateLoanData>({
    name: '',
    type: '',
    lender: '',
    interest_rate: 0,
    term_years: 10,
    fixed_variable: 'fixed',
    origination_fee: 0,
    grace_period: 6,
    min_payment: 0,
    max_amount: 0,
    amount: 0,
    repayment_plan: '',
    loan_category: '',
    loan_subtype: '',
    year_level: '',
    annual_limit: undefined,
    aggregate_limit: undefined,
    in_school_payment_strategy: '',
  });

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const userLoans = await loanService.getAllLoans();
      setLoans(userLoans);
      
      // Expand all year sections by default
      const years = [...new Set(userLoans.map(l => l.year_level || 'unspecified'))];
      const expanded: Record<string, boolean> = {};
      years.forEach(y => expanded[y] = true);
      setExpandedYears(expanded);
    } catch (err) {
      console.error('Error loading loans:', err);
      setError(err instanceof Error ? err.message : 'Failed to load loans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLoanFormData({
      name: '',
      type: '',
      lender: '',
      interest_rate: 0,
      term_years: 10,
      fixed_variable: 'fixed',
      origination_fee: 0,
      grace_period: 6,
      min_payment: 0,
      max_amount: 0,
      amount: 0,
      repayment_plan: '',
      loan_category: '',
      loan_subtype: '',
      year_level: '',
      annual_limit: undefined,
      aggregate_limit: undefined,
      in_school_payment_strategy: '',
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleInputChange = (field: keyof CreateLoanData, value: any) => {
    setLoanFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      if (!loanFormData.name || !loanFormData.type) {
        setError('Loan name and type are required');
        setSaving(false);
        return;
      }

      if (!loanFormData.interest_rate || loanFormData.interest_rate <= 0) {
        setError('Interest rate is required and must be greater than 0');
        setSaving(false);
        return;
      }

      if (!loanFormData.term_years || loanFormData.term_years <= 0) {
        setError('Term in years is required and must be greater than 0');
        setSaving(false);
        return;
      }

      if (!loanFormData.amount || loanFormData.amount <= 0) {
        setError('Loan amount is required and must be greater than 0');
        setSaving(false);
        return;
      }

      if (editingId) {
        await loanService.updateLoan(editingId, loanFormData);
      } else {
        await loanService.createLoan(loanFormData);
      }

      resetForm();
      await loadLoans();
    } catch (err) {
      console.error('Error saving loan:', err);
      setError(err instanceof Error ? err.message : 'Failed to save loan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (loan: LoanRecord) => {
    setLoanFormData({
      name: loan.name,
      type: loan.type,
      lender: loan.lender || '',
      interest_rate: loan.interest_rate,
      term_years: loan.term_years,
      fixed_variable: loan.fixed_variable || 'fixed',
      origination_fee: loan.origination_fee || 0,
      grace_period: loan.grace_period || 6,
      min_payment: loan.min_payment || 0,
      max_amount: loan.max_amount || 0,
      amount: loan.amount || 0,
      repayment_plan: loan.repayment_plan || '',
      loan_category: loan.loan_category || '',
      loan_subtype: loan.loan_subtype || '',
      year_level: loan.year_level || '',
      annual_limit: loan.annual_limit ?? undefined,
      aggregate_limit: loan.aggregate_limit ?? undefined,
      in_school_payment_strategy: loan.in_school_payment_strategy || '',
    });
    setEditingId(loan.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this loan?')) {
      return;
    }

    try {
      await loanService.deleteLoan(id);
      await loadLoans();
    } catch (err) {
      console.error('Error deleting user loan:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete loan. Please try again.');
    }
  };

  const handleTogglePaid = async (loan: LoanRecord) => {
    try {
      const newPaidStatus = !loan.is_paid;
      await loanService.toggleLoanPaid(loan.id, newPaidStatus);
      // Update local state immediately for responsiveness
      setLoans(prev => prev.map(l => 
        l.id === loan.id 
          ? { ...l, is_paid: newPaidStatus, paid_date: newPaidStatus ? new Date().toISOString().split('T')[0] : null }
          : l
      ));
    } catch (err) {
      console.error('Error toggling loan paid status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update loan status.');
    }
  };

  const toggleYear = (year: string) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
  };

  // Group loans by year level
  const loansByYear = loans.reduce((acc, loan) => {
    const year = loan.year_level || 'unspecified';
    if (!acc[year]) acc[year] = [];
    acc[year].push(loan);
    return acc;
  }, {} as Record<string, LoanRecord[]>);

  const yearOrder = ['freshman', 'sophomore', 'junior', 'senior', 'unspecified'];
  const sortedYears = yearOrder.filter(y => loansByYear[y]);

  const totalBalance = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
  const paidLoans = loans.filter(loan => loan.is_paid);
  const unpaidLoans = loans.filter(loan => !loan.is_paid);
  const paidBalance = paidLoans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
  const unpaidBalance = unpaidLoans.reduce((sum, loan) => sum + (loan.amount || 0), 0);

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

  const getLoanTypeBadgeColor = (type: string): 'navy' | 'green' | 'amber' => {
    switch (type) {
      case 'federal': return 'navy';
      case 'state': return 'green';
      case 'private': return 'amber';
      default: return 'navy';
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cap-red focus:ring-4 focus:ring-cap-red/10 outline-none transition-all bg-white text-gray-900 font-medium";
  const selectClass = inputClass;

  if (loading) {
    return (
      <div className="animate-enter">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-cap-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading loans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-enter">
      <PageHeader 
        title="My Loans" 
        subtitle={loans.length > 0 ? `${loans.length} loans totaling ${formatCurrency(totalBalance)}` : "Manage your loan portfolio"}
        action={
          <Button 
            variant="primary" 
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
          >
            <Plus size={18} className="mr-2" />
            Add Loan
          </Button>
        }
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {error && (
          <div className="mb-6 p-5 bg-red-50 border-2 border-red-200 rounded-2xl text-red-800 font-medium">
            {error}
          </div>
        )}

        {/* Loan Status Summary */}
        {loans.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="!p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gray-100">
                  <Wallet size={24} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Loans</p>
                  <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(totalBalance)}</p>
                </div>
              </div>
            </Card>
            
            <Card className="!p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-100">
                  <Circle size={24} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Unpaid</p>
                  <p className="text-2xl font-bold text-amber-600">{unpaidLoans.length}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(unpaidBalance)}</p>
                </div>
              </div>
            </Card>
            
            <Card className="!p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Paid Off</p>
                  <p className="text-2xl font-bold text-green-600">{paidLoans.length}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(paidBalance)}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card highlight className="mb-8 !p-0 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Loan' : 'Add New Loan'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-5">Loan Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loan Name *
                    </label>
                    <input
                      type="text"
                      value={loanFormData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={inputClass}
                      placeholder="e.g., Direct Subsidized Loan - Year 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loan Type *
                    </label>
                    <select
                      value={loanFormData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select type</option>
                      <option value="federal">Federal</option>
                      <option value="state">State</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Lender
                    </label>
                    <input
                      type="text"
                      value={loanFormData.lender}
                      onChange={(e) => handleInputChange('lender', e.target.value)}
                      className={inputClass}
                      placeholder="e.g., Sallie Mae"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loan Amount *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        value={loanFormData.amount || ''}
                        onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                        className={`${inputClass} pl-9`}
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Interest Rate (%) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={loanFormData.interest_rate || ''}
                      onChange={(e) => handleInputChange('interest_rate', parseFloat(e.target.value) || 0)}
                      className={inputClass}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Term (Years) *
                    </label>
                    <input
                      type="number"
                      value={loanFormData.term_years || ''}
                      onChange={(e) => handleInputChange('term_years', parseInt(e.target.value) || 0)}
                      className={inputClass}
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Year Level
                    </label>
                    <select
                      value={loanFormData.year_level || ''}
                      onChange={(e) => handleInputChange('year_level', e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select year</option>
                      <option value="freshman">Freshman</option>
                      <option value="sophomore">Sophomore</option>
                      <option value="junior">Junior</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Details (collapsed by default in visual) */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-5">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fixed or Variable
                    </label>
                    <select
                      value={loanFormData.fixed_variable || 'fixed'}
                      onChange={(e) => handleInputChange('fixed_variable', e.target.value)}
                      className={selectClass}
                    >
                      <option value="fixed">Fixed</option>
                      <option value="variable">Variable</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Repayment Plan
                    </label>
                    <select
                      value={loanFormData.repayment_plan || ''}
                      onChange={(e) => handleInputChange('repayment_plan', e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select plan</option>
                      <option value="standard">Standard</option>
                      <option value="graduated">Graduated</option>
                      <option value="extended">Extended</option>
                      <option value="SAVE">SAVE</option>
                      <option value="IBR">IBR</option>
                      <option value="PAYE">PAYE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      In-School Strategy
                    </label>
                    <select
                      value={loanFormData.in_school_payment_strategy || ''}
                      onChange={(e) => handleInputChange('in_school_payment_strategy', e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select strategy</option>
                      <option value="defer">Full Deferment</option>
                      <option value="interest-only">Interest Only</option>
                      <option value="fixed-25">Fixed $25</option>
                      <option value="full">Full Payment</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? 'Saving...' : editingId ? 'Update Loan' : 'Add Loan'}
              </Button>
              <Button
                variant="secondary"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {loans.length === 0 && !showAddForm ? (
          <Card className="!py-20">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-cap-red/10 to-cap-red/5 flex items-center justify-center">
                <Wallet size={48} className="text-cap-red" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Loans Yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                Add your loans manually or use the Loan Optimizer to create a personalized plan.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}
              >
                <Plus size={18} className="mr-2" />
                Add Your First Loan
              </Button>
            </div>
          </Card>
        ) : loans.length > 0 && (
          /* Loans List Grouped by Year */
          <div className="space-y-6">
            {sortedYears.map((year) => {
              const yearLoans = loansByYear[year];
              const yearTotal = yearLoans.reduce((sum, l) => sum + (l.amount || 0), 0);
              const isExpanded = expandedYears[year] !== false;
              
              return (
                <div key={year} className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-cap-navy/10">
                        <Wallet size={20} className="text-cap-navy" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg capitalize">
                          {year === 'unspecified' ? 'Other Loans' : `${year} Year`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {yearLoans.length} {yearLoans.length === 1 ? 'loan' : 'loans'} • {formatCurrency(yearTotal)}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={22} className="text-gray-400" /> : <ChevronDown size={22} className="text-gray-400" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4">
                      {yearLoans.map((loan) => (
                        <div 
                          key={loan.id} 
                          className={`p-5 rounded-xl border-2 transition-all ${
                            loan.is_paid 
                              ? 'border-green-300 bg-green-50/50' 
                              : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <button
                              onClick={() => handleTogglePaid(loan)}
                              className={`mt-1 shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                                loan.is_paid
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                              }`}
                              title={loan.is_paid ? 'Mark as unpaid' : 'Mark as paid'}
                            >
                              {loan.is_paid && <Check size={16} strokeWidth={3} />}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-3 h-3 rounded-full ${getLoanTypeColor(loan.type)}`}></div>
                                <h4 className={`font-bold text-lg truncate ${loan.is_paid ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                  {loan.name}
                                </h4>
                                <Badge color={getLoanTypeBadgeColor(loan.type)} className="shrink-0">
                                  {loan.type}
                                </Badge>
                                {loan.is_paid && (
                                  <Badge color="green" className="shrink-0">
                                    Paid
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500 font-medium">Amount</p>
                                  <p className={`font-bold text-lg ${loan.is_paid ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {formatCurrency(loan.amount || 0)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 font-medium">Interest Rate</p>
                                  <p className={`font-bold text-lg ${loan.is_paid ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {Number(loan.interest_rate).toFixed(2)}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 font-medium">Term</p>
                                  <p className={`font-bold text-lg ${loan.is_paid ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {loan.term_years} years
                                  </p>
                                </div>
                                {loan.is_paid && loan.paid_date ? (
                                  <div>
                                    <p className="text-gray-500 font-medium">Paid On</p>
                                    <p className="font-bold text-green-600">
                                      {new Date(loan.paid_date).toLocaleDateString()}
                                    </p>
                                  </div>
                                ) : loan.lender ? (
                                  <div>
                                    <p className="text-gray-500 font-medium">Lender</p>
                                    <p className={`font-bold ${loan.is_paid ? 'text-gray-400' : 'text-gray-900'}`}>
                                      {loan.lender}
                                    </p>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => handleEdit(loan)}
                                className="p-2.5 text-gray-500 hover:text-cap-red hover:bg-cap-red/10 rounded-xl transition-colors"
                                title="Edit loan"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(loan.id)}
                                className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                title="Delete loan"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoansPage;
