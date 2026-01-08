import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { Card, Button, PageHeader } from '../components/shared';
import { School, Users, DollarSign, Target } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    // Personal Profile
    firstName: '',
    lastName: '',
    age: null as number | null,
    graduationDate: '',
    state: '',
    creditScore: '',
    
    // School & Enrollment
    schoolName: '',
    programType: '',
    enrollmentStatus: '',
    
    // Financial Profile
    currentIncome: 0,
    projectedIncome: 0,
    currentSavings: 0,
    monthlyBudget: 0,
    otherDebt: 0,
    financialDependents: 0,
    
    // Loan Preferences
    riskTolerance: 'conservative',
    primaryGoal: 'minimize-total-cost',
    targetPayoffYear: new Date().getFullYear() + 10,
    prioritizeMonthly: false
  });

  useEffect(() => {
    if (user?.email) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userRecord = await userService.getUserByEmail(user.email);
      
      if (userRecord) {
        
        // Parse name into first and last
        const nameParts = (userRecord.name || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Convert target_payoff_date to year
        const targetYear = userRecord.target_payoff_date 
          ? new Date(userRecord.target_payoff_date).getFullYear()
          : new Date().getFullYear() + 10;
        
        // Map database fields to form fields
        setProfile({
          firstName,
          lastName,
          age: userRecord.age,
          graduationDate: userRecord.graduation_date || '',
          state: userRecord.state_of_residence || '',
          creditScore: userRecord.credit_score_range || '',
          
          schoolName: userRecord.school_name || '',
          programType: userRecord.program_type || '',
          enrollmentStatus: userRecord.enrollment_status || '',
          
          currentIncome: 0, // Not in schema, keep as 0
          projectedIncome: Number(userRecord.expected_income) || 0,
          currentSavings: Number(userRecord.current_savings) || 0,
          monthlyBudget: Number(userRecord.monthly_budget) || 0,
          otherDebt: Number(userRecord.other_debt) || 0,
          financialDependents: userRecord.financial_dependents || 0,
          
          riskTolerance: userRecord.risk_preference || 'conservative',
          primaryGoal: userRecord.prioritize?.includes('monthly') ? 'minimize-monthly' : 'minimize-total-cost',
          targetPayoffYear: targetYear,
          prioritizeMonthly: userRecord.prioritize?.includes('monthly') || false
        });
      } else {
        setIsEditing(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load profile: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.email) return;
    
    setSaving(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!profile.firstName || !profile.lastName) {
        setError('First name and last name are required');
        setSaving(false);
        return;
      }
      
      if (!profile.projectedIncome || profile.projectedIncome <= 0) {
        setError('Projected income is required and must be greater than 0');
        setSaving(false);
        return;
      }
      
      if (!profile.monthlyBudget || profile.monthlyBudget <= 0) {
        setError('Monthly budget is required and must be greater than 0');
        setSaving(false);
        return;
      }
      
      if (!profile.graduationDate) {
        setError('Graduation date is required');
        setSaving(false);
        return;
      }
      
      if (!profile.schoolName || !profile.programType || !profile.enrollmentStatus) {
        setError('School information is required');
        setSaving(false);
        return;
      }
      
      // Convert form data to database format
      const name = `${profile.firstName} ${profile.lastName}`.trim();
      const targetPayoffDate = new Date(profile.targetPayoffYear, 0, 1).toISOString().split('T')[0];
      const prioritize = profile.prioritizeMonthly ? 'min monthly payment' : 'min total cost';
      
      await userService.upsertUser({
        email: user.email,
        name,
        age: profile.age ?? undefined,
        graduation_date: profile.graduationDate,
        expected_income: profile.projectedIncome,
        monthly_budget: profile.monthlyBudget,
        credit_score_range: profile.creditScore || undefined,
        state_of_residence: profile.state || undefined,
        school_name: profile.schoolName,
        program_type: profile.programType,
        enrollment_status: profile.enrollmentStatus,
        current_savings: profile.currentSavings ?? undefined,
        other_debt: profile.otherDebt ?? undefined,
        financial_dependents: profile.financialDependents ?? undefined,
        risk_preference: profile.riskTolerance,
        target_payoff_date: targetPayoffDate,
        prioritize
      });
      
      setIsEditing(false);
      
      // Small delay to ensure database commit, then reload
      setTimeout(async () => {
        try {
          await loadProfile(); // Reload to get updated data
        } catch (reloadError) {
          console.error('Error reloading profile after save:', reloadError);
        }
      }, 500);
      
      // Notify app that profile was updated
      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-enter">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-cap-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-enter">
      <PageHeader 
        title="User Profile" 
        subtitle="Manage your personal details, financial context, and loan preferences."
        action={
          <Button 
            variant={isEditing ? "primary" : "secondary"} 
            icon={isEditing ? "save" : "edit-2"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        }
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          {/* Personal Profile Section */}
          <Card highlight>
            <div className="flex items-center gap-2 mb-6">
              <Users size={20} className="text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">Personal Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">First Name *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    required
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.firstName || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    required
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.lastName || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.age ? `${profile.age} years old` : 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">State of Residence</label>
                {isEditing ? (
                  <select
                    value={profile.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                  >
                    <option value="">Select state</option>
                    <option value="NC">North Carolina</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{profile.state || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Graduation Date *</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profile.graduationDate}
                    onChange={(e) => handleInputChange('graduationDate', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    required
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.graduationDate ? new Date(profile.graduationDate).toLocaleDateString() : 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Credit Score Range</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.creditScore}
                    onChange={(e) => handleInputChange('creditScore', e.target.value)}
                    placeholder="e.g., 700-750"
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.creditScore || 'Not set'}</p>
                )}
              </div>
            </div>
          </Card>

          {/* School & Enrollment Section */}
          <Card highlight>
            <div className="flex items-center gap-2 mb-6">
              <School size={20} className="text-cap-red" />
              <h2 className="text-xl font-bold text-gray-900">School & Enrollment</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">School Name *</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    required
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.schoolName || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Program Type *</label>
                {isEditing ? (
                  <select
                    value={profile.programType}
                    onChange={(e) => handleInputChange('programType', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="professional">Professional</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{profile.programType || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Enrollment Status *</label>
                {isEditing ? (
                  <select
                    value={profile.enrollmentStatus}
                    onChange={(e) => handleInputChange('enrollmentStatus', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{profile.enrollmentStatus ? profile.enrollmentStatus.replace('-', ' ') : 'Not set'}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Financial Profile Section */}
          <Card highlight>
            <div className="flex items-center gap-2 mb-6">
              <DollarSign size={20} className="text-cap-red" />
              <h2 className="text-xl font-bold text-gray-900">Financial Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Projected Income (Annual) *</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={profile.projectedIncome || ''}
                      onChange={(e) => handleInputChange('projectedIncome', parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                      required
                      min="0"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">${profile.projectedIncome.toLocaleString()}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Monthly Budget *</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={profile.monthlyBudget || ''}
                      onChange={(e) => handleInputChange('monthlyBudget', parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                      required
                      min="0"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">${profile.monthlyBudget.toLocaleString()}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Current Savings</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={profile.currentSavings || ''}
                      onChange={(e) => handleInputChange('currentSavings', parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                      min="0"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">${profile.currentSavings.toLocaleString()}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Other Debt Obligations</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={profile.otherDebt || ''}
                      onChange={(e) => handleInputChange('otherDebt', parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                      min="0"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">${profile.otherDebt.toLocaleString()}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Financial Dependents</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.financialDependents || ''}
                    onChange={(e) => handleInputChange('financialDependents', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    min="0"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.financialDependents}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Loan Preferences Section */}
          <Card highlight>
            <div className="flex items-center gap-2 mb-6">
              <Target size={20} className="text-cap-red" />
              <h2 className="text-xl font-bold text-gray-900">Loan Preferences</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Risk Tolerance</label>
                {isEditing ? (
                  <select
                    value={profile.riskTolerance}
                    onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{profile.riskTolerance}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Primary Goal</label>
                {isEditing ? (
                  <select
                    value={profile.primaryGoal}
                    onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                  >
                    <option value="minimize-total-cost">Minimize Total Cost</option>
                    <option value="minimize-monthly">Minimize Monthly Payment</option>
                    <option value="fastest-payoff">Fastest Payoff</option>
                    <option value="flexibility">Maximum Flexibility</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {profile.primaryGoal === 'minimize-total-cost' ? 'Minimize Total Cost' :
                     profile.primaryGoal === 'minimize-monthly' ? 'Minimize Monthly Payment' :
                     profile.primaryGoal === 'fastest-payoff' ? 'Fastest Payoff' : 'Maximum Flexibility'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Target Payoff Year</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.targetPayoffYear}
                    onChange={(e) => handleInputChange('targetPayoffYear', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.targetPayoffYear}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Priority</label>
                {isEditing ? (
                  <select
                    value={profile.prioritizeMonthly ? 'monthly' : 'total'}
                    onChange={(e) => handleInputChange('prioritizeMonthly', e.target.value === 'monthly')}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                  >
                    <option value="total">Minimize Total Cost</option>
                    <option value="monthly">Minimize Monthly Payment</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {profile.prioritizeMonthly ? 'Minimize Monthly Payment' : 'Minimize Total Cost'}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
