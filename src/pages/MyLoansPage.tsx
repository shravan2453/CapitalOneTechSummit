import React, { useState, useEffect } from 'react';
import { loanService, LoanRecord, CreateLoanData } from '../services/loanService';
import { Card, Button, PageHeader } from '../components/shared';
import { Trash2, Edit2, X, Wallet } from 'lucide-react';

/**
 * My Loans Page Component
 * 
 * Allows users to:
 * - View their personal loans (user-specific, stored in loans table)
 * - Add new loans with all details including amount and repayment plan
 * - Edit their loans
 * - Delete their loans
 */
const MyLoansPage: React.FC = () => {
  // State management
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
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

  // Load loans for the current user
  const loadLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const userLoans = await loanService.getAllLoans();
      setLoans(userLoans);
    } catch (err) {
      console.error('Error loading loans:', err);
      setError(err instanceof Error ? err.message : 'Failed to load loans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form to initial state
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

  // Handle input changes for loan form fields
  const handleInputChange = (field: keyof CreateLoanData, value: any) => {
    setLoanFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      // Validate required fields
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
        // Update existing loan
        await loanService.updateLoan(editingId, loanFormData);
      } else {
        // Create new loan (automatically linked to current user)
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

  // Handle edit button click
  // Populates form with existing loan data
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
      annual_limit: loan.annual_limit,
      aggregate_limit: loan.aggregate_limit,
      in_school_payment_strategy: loan.in_school_payment_strategy || '',
    });
    setEditingId(loan.id);
    setShowAddForm(true);
  };

  // Handle delete button click
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

  if (loading) {
    return (
      <div className="animate-enter">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
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
        subtitle="Add and manage your loan options."
        action={
          <Button 
            variant="primary" 
            icon="plus"
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
          >
            Add Loan
          </Button>
        }
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            {error}
          </div>
        )}

        {showAddForm && (
          <Card highlight className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Loan' : 'Add New Loan'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Loan Name *
                    </label>
                    <input
                      type="text"
                      value={loanFormData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      placeholder="e.g., Direct Subsidized Loan"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Loan Type *
                    </label>
                    <select
                      value={loanFormData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="federal">Federal</option>
                      <option value="private">Private</option>
                      <option value="state">State</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Lender
                    </label>
                    <input
                      type="text"
                      value={loanFormData.lender}
                      onChange={(e) => handleInputChange('lender', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      placeholder="e.g., Sallie Mae, Discover"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Interest Rate (%) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={loanFormData.interest_rate || ''}
                      onChange={(e) => handleInputChange('interest_rate', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Term (Years) *
                    </label>
                    <input
                      type="number"
                      value={loanFormData.term_years || ''}
                      onChange={(e) => handleInputChange('term_years', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Fixed or Variable
                    </label>
                    <select
                      value={loanFormData.fixed_variable || 'fixed'}
                      onChange={(e) => handleInputChange('fixed_variable', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="variable">Variable</option>
                      <option value="both">Both Available</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Origination Fee (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={loanFormData.origination_fee || ''}
                      onChange={(e) => handleInputChange('origination_fee', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Grace Period (Months)
                    </label>
                    <input
                      type="number"
                      value={loanFormData.grace_period || ''}
                      onChange={(e) => handleInputChange('grace_period', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Minimum Payment ($)
                    </label>
                    <input
                      type="number"
                      value={loanFormData.min_payment || ''}
                      onChange={(e) => handleInputChange('min_payment', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Maximum Amount ($)
                    </label>
                    <input
                      type="number"
                      value={loanFormData.max_amount || ''}
                      onChange={(e) => handleInputChange('max_amount', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Repayment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Loan Amount ($) *
                    </label>
                    <input
                      type="number"
                      value={loanFormData.amount || ''}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Repayment Plan
                    </label>
                    <select
                      value={loanFormData.repayment_plan || ''}
                      onChange={(e) => handleInputChange('repayment_plan', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    >
                      <option value="">Select plan</option>
                      <option value="standard">Standard</option>
                      <option value="graduated">Graduated</option>
                      <option value="extended">Extended</option>
                      <option value="SAVE">SAVE</option>
                      <option value="IBR">IBR</option>
                      <option value="PAYE">PAYE</option>
                      <option value="REPAYE">REPAYE</option>
                      <option value="ICR">ICR</option>
                      <option value="interest-only">Interest Only</option>
                      <option value="defer">Defer</option>
                      <option value="biweekly">Biweekly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Loan Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Loan Subtype
                    </label>
                    <input
                      type="text"
                      value={loanFormData.loan_subtype || ''}
                      onChange={(e) => handleInputChange('loan_subtype', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      placeholder="e.g., Direct Subsidized, Parent PLUS"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Year Level
                    </label>
                    <select
                      value={loanFormData.year_level || ''}
                      onChange={(e) => handleInputChange('year_level', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    >
                      <option value="">Select year</option>
                      <option value="freshman">Freshman</option>
                      <option value="sophomore">Sophomore</option>
                      <option value="junior">Junior</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      In-School Payment Strategy
                    </label>
                    <select
                      value={loanFormData.in_school_payment_strategy || ''}
                      onChange={(e) => handleInputChange('in_school_payment_strategy', e.target.value)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    >
                      <option value="">Select strategy</option>
                      <option value="defer">Full Deferment</option>
                      <option value="interest-only">Interest Only</option>
                      <option value="fixed-25">Fixed $25</option>
                      <option value="full">Full Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Annual Limit ($)
                    </label>
                    <input
                      type="number"
                      value={loanFormData.annual_limit || ''}
                      onChange={(e) => handleInputChange('annual_limit', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      min="0"
                      placeholder="Maximum per year"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Aggregate Limit ($)
                    </label>
                    <input
                      type="number"
                      value={loanFormData.aggregate_limit || ''}
                      onChange={(e) => handleInputChange('aggregate_limit', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      min="0"
                      placeholder="Maximum total"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                variant="primary"
                icon="save"
                onClick={handleSubmit}
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

        {loans.length === 0 && !showAddForm ? (
          <Card>
            <div className="text-center py-12">
              <Wallet size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">No loans added yet.</p>
              <Button
                variant="primary"
                icon="plus"
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}
              >
                Add Your First Loan
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <Card key={loan.id} highlight>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{loan.name}</h3>
                      <span className="px-3 py-1 bg-cap-red/10 text-cap-red rounded-full text-xs font-semibold uppercase">
                        {loan.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-500">Loan Amount</p>
                        <p className="font-semibold text-gray-900">${(loan.amount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Interest Rate</p>
                        <p className="font-semibold text-gray-900">{loan.interest_rate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Term</p>
                        <p className="font-semibold text-gray-900">{loan.term_years} years</p>
                      </div>
                      {loan.repayment_plan && (
                        <div>
                          <p className="text-gray-500">Repayment Plan</p>
                          <p className="font-semibold text-gray-900">{loan.repayment_plan}</p>
                        </div>
                      )}
                    </div>
                    {(loan.lender || loan.fixed_variable || loan.year_level || loan.in_school_payment_strategy) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        {loan.lender && (
                          <div>
                            <p className="text-gray-500">Lender</p>
                            <p className="font-semibold text-gray-900">{loan.lender}</p>
                          </div>
                        )}
                        {loan.fixed_variable && (
                          <div>
                            <p className="text-gray-500">Rate Type</p>
                            <p className="font-semibold text-gray-900 capitalize">{loan.fixed_variable}</p>
                          </div>
                        )}
                        {loan.year_level && (
                          <div>
                            <p className="text-gray-500">Year Level</p>
                            <p className="font-semibold text-gray-900 capitalize">{loan.year_level}</p>
                          </div>
                        )}
                        {loan.in_school_payment_strategy && (
                          <div>
                            <p className="text-gray-500">In-School Strategy</p>
                            <p className="font-semibold text-gray-900 capitalize">
                              {loan.in_school_payment_strategy === 'defer' ? 'Full Deferment' :
                               loan.in_school_payment_strategy === 'interest-only' ? 'Interest Only' :
                               loan.in_school_payment_strategy === 'fixed-25' ? 'Fixed $25' :
                               loan.in_school_payment_strategy === 'full' ? 'Full Payment' :
                               loan.in_school_payment_strategy}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {(loan.annual_limit || loan.aggregate_limit) && (
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        {loan.annual_limit && (
                          <div>
                            <p className="text-gray-500">Annual Limit</p>
                            <p className="font-semibold text-gray-900">${loan.annual_limit.toLocaleString()}</p>
                          </div>
                        )}
                        {loan.aggregate_limit && (
                          <div>
                            <p className="text-gray-500">Aggregate Limit</p>
                            <p className="font-semibold text-gray-900">${loan.aggregate_limit.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {(loan.total_cost || loan.total_interest || loan.weighted_avg_rate || loan.payoff_date) && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Calculated Metrics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {loan.total_cost && (
                            <div>
                              <p className="text-gray-500">Total Cost</p>
                              <p className="font-semibold text-gray-900">${loan.total_cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                          )}
                          {loan.total_interest && (
                            <div>
                              <p className="text-gray-500">Total Interest</p>
                              <p className="font-semibold text-gray-900">${loan.total_interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                          )}
                          {loan.weighted_avg_rate && (
                            <div>
                              <p className="text-gray-500">Avg Rate</p>
                              <p className="font-semibold text-gray-900">{loan.weighted_avg_rate.toFixed(2)}%</p>
                            </div>
                          )}
                          {loan.payoff_date && (
                            <div>
                              <p className="text-gray-500">Payoff Date</p>
                              <p className="font-semibold text-gray-900">{new Date(loan.payoff_date).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(loan)}
                      className="p-2 text-gray-600 hover:text-cap-red hover:bg-cap-red/10 rounded-lg transition-colors"
                      title="Edit loan"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(loan.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete loan"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoansPage;
