import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { Card, Button, PageHeader } from '../components/shared';
import { School, Users, DollarSign, Target, GraduationCap, AlertCircle } from 'lucide-react';

// Required field indicator component
const RequiredStar: React.FC = () => (
  <span className="text-cap-red ml-0.5">*</span>
);

// Optional field indicator component
const OptionalTag: React.FC = () => (
  <span className="text-gray-400 text-xs font-normal ml-1">(optional)</span>
);

interface ProfilePageProps {
  isNewUser?: boolean;
  onProfileComplete?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isNewUser = false, onProfileComplete }) => {
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
    dependencyStatus: '',
    yearLevel: '',
    
    // School & Enrollment
    schoolName: '',
    programType: '',
    enrollmentStatus: '',
    
    // Financial Profile
    projectedIncome: 0,
    currentSavings: 0,
    monthlyBudget: 0,
    otherDebt: 0,
    financialDependents: 0,
    familySize: 1,
    annualGap: null as number | null,
    tuitionGrowthRate: 7,
    
    // Eligibility
    subsidizable: false,
    felsEligible: false,
    cosigner: false,
    parentPlus: false,
    
    // Loan Preferences
    riskTolerance: 'conservative',
    prioritize: 'min total cost',
    targetPayoffYear: new Date().getFullYear() + 10,
    targetPayoffDuration: null as number | null,
    maxMonthlyPayment: null as number | null,
    optimizeBy: '',
    inSchoolPayment: 'defer'
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
          dependencyStatus: userRecord.dependency_status || '',
          yearLevel: userRecord.year_level || '',
          
          schoolName: userRecord.school_name || '',
          programType: userRecord.program_type || '',
          enrollmentStatus: userRecord.enrollment_status || '',
          
          projectedIncome: Number(userRecord.expected_income) || 0,
          currentSavings: Number(userRecord.current_savings) || 0,
          monthlyBudget: Number(userRecord.monthly_budget) || 0,
          otherDebt: Number(userRecord.other_debt) || 0,
          financialDependents: userRecord.financial_dependents || 0,
          familySize: userRecord.family_size || 1,
          annualGap: userRecord.annual_gap,
          tuitionGrowthRate: userRecord.tuition_growth_rate || 7,
          
          subsidizable: userRecord.subsidizable || false,
          felsEligible: userRecord.fels_eligible || false,
          cosigner: userRecord.cosigner || false,
          parentPlus: userRecord.parent_plus || false,
          
          riskTolerance: userRecord.risk_preference || 'conservative',
          prioritize: userRecord.prioritize || 'min total cost',
          targetPayoffYear: targetYear,
          targetPayoffDuration: userRecord.target_payoff_duration,
          maxMonthlyPayment: userRecord.max_monthly_payment,
          optimizeBy: userRecord.optimize_by || '',
          inSchoolPayment: userRecord.in_school_payment || 'defer'
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
        setError('Expected starting salary is required and must be greater than 0');
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
      
      if (!profile.yearLevel) {
        setError('Year level is required');
        setSaving(false);
        return;
      }
      
      if (!profile.dependencyStatus) {
        setError('Dependency status is required');
        setSaving(false);
        return;
      }
      
      if (!profile.annualGap || profile.annualGap <= 0) {
        setError('Annual funding gap is required and must be greater than 0');
        setSaving(false);
        return;
      }
      
      if (!profile.optimizeBy) {
        setError('Please select how you want to optimize (Target Payoff Years or Max Monthly Payment)');
        setSaving(false);
        return;
      }
      
      if (profile.optimizeBy === 'target_payoff_years' && !profile.targetPayoffDuration) {
        setError('Target payoff duration is required when optimizing by payoff years');
        setSaving(false);
        return;
      }
      
      if (profile.optimizeBy === 'max_monthly_payment' && !profile.maxMonthlyPayment) {
        setError('Max monthly payment is required when optimizing by monthly payment');
        setSaving(false);
        return;
      }
      
      // Convert form data to database format
      const name = `${profile.firstName} ${profile.lastName}`.trim();
      const targetPayoffDate = new Date(profile.targetPayoffYear, 0, 1).toISOString().split('T')[0];
      
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
        prioritize: profile.prioritize,
        dependency_status: profile.dependencyStatus || undefined,
        year_level: profile.yearLevel || undefined,
        annual_gap: profile.annualGap ?? undefined,
        cosigner: profile.cosigner || undefined,
        subsidizable: profile.subsidizable || undefined,
        fels_eligible: profile.felsEligible || undefined,
        parent_plus: profile.parentPlus || undefined,
        target_payoff_duration: profile.targetPayoffDuration ?? undefined,
        max_monthly_payment: profile.maxMonthlyPayment ?? undefined,
        in_school_payment: profile.inSchoolPayment || undefined,
        tuition_growth_rate: profile.tuitionGrowthRate ?? undefined,
        optimize_by: profile.optimizeBy || undefined,
        family_size: profile.familySize ?? undefined
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
      
      // Call completion callback for new users
      if (onProfileComplete) {
        onProfileComplete();
      }
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
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
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          {/* New User Welcome Banner */}
          {isNewUser && (
            <div className="mb-6 p-5 bg-cap-navy/5 border-2 border-cap-navy/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cap-navy/10 rounded-xl">
                  <AlertCircle size={24} className="text-cap-navy" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Complete Your Profile</h3>
                  <p className="text-gray-600">
                    Please fill out your profile information to use the loan optimizer and other features. 
                    Fields marked with <span className="text-cap-red font-bold">*</span> are required.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mb-6 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-cap-red font-bold">*</span>
              <span className="text-gray-600">Required field</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">(optional)</span>
              <span className="text-gray-600">Optional field</span>
            </div>
          </div>

          {/* Personal Profile Section */}
          <Card highlight>
            <div className="flex items-center gap-2 mb-6">
              <Users size={20} className="text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">Personal Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">First Name<RequiredStar /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name<RequiredStar /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Age<OptionalTag /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">State of Residence<OptionalTag /></label>
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
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{profile.state || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Dependency Status<RequiredStar /></label>
                {isEditing ? (
                  <select
                    value={profile.dependencyStatus}
                    onChange={(e) => handleInputChange('dependencyStatus', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="dependent">Dependent</option>
                    <option value="independent">Independent</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{profile.dependencyStatus || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Year Level<RequiredStar /></label>
                {isEditing ? (
                  <select
                    value={profile.yearLevel}
                    onChange={(e) => handleInputChange('yearLevel', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                    required
                  >
                    <option value="">Select year</option>
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{profile.yearLevel || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Graduation Date<RequiredStar /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Credit Score Range<OptionalTag /></label>
                {isEditing ? (
                  <select
                    value={profile.creditScore}
                    onChange={(e) => handleInputChange('creditScore', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                  >
                    <option value="">Select range</option>
                    <option value="poor">Poor (300-579)</option>
                    <option value="fair">Fair (580-669)</option>
                    <option value="good">Good (670-739)</option>
                    <option value="excellent">Excellent (740-850)</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {profile.creditScore === 'poor' ? 'Poor (300-579)' :
                     profile.creditScore === 'fair' ? 'Fair (580-669)' :
                     profile.creditScore === 'good' ? 'Good (670-739)' :
                     profile.creditScore === 'excellent' ? 'Excellent (740-850)' :
                     'Not set'}
                  </p>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">School Name<RequiredStar /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Program Type<RequiredStar /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Enrollment Status<RequiredStar /></label>
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

          {/* Eligibility Section */}
          <Card highlight>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap size={20} className="text-cap-red" />
              <h2 className="text-xl font-bold text-gray-900">Loan Eligibility</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={profile.subsidizable}
                    onChange={(e) => handleInputChange('subsidizable', e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-cap-red/20 text-cap-red focus:ring-cap-red/20"
                  />
                ) : (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${profile.subsidizable ? 'bg-cap-red border-cap-red' : 'border-gray-300'}`}>
                    {profile.subsidizable && <span className="text-white text-xs">✓</span>}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-900">Eligible for Subsidized Loans</label>
                  <p className="text-xs text-gray-600">Based on FAFSA financial need</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={profile.felsEligible}
                    onChange={(e) => handleInputChange('felsEligible', e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-cap-red/20 text-cap-red focus:ring-cap-red/20"
                  />
                ) : (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${profile.felsEligible ? 'bg-cap-red border-cap-red' : 'border-gray-300'}`}>
                    {profile.felsEligible && <span className="text-white text-xs">✓</span>}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-900">Eligible for NC FELS</label>
                  <p className="text-xs text-gray-600">NC residents in qualifying fields</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={profile.cosigner}
                    onChange={(e) => handleInputChange('cosigner', e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-cap-red/20 text-cap-red focus:ring-cap-red/20"
                  />
                ) : (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${profile.cosigner ? 'bg-cap-red border-cap-red' : 'border-gray-300'}`}>
                    {profile.cosigner && <span className="text-white text-xs">✓</span>}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-900">Have a Cosigner?</label>
                  <p className="text-xs text-gray-600">Can lower private loan rates</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={profile.parentPlus}
                    onChange={(e) => handleInputChange('parentPlus', e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-cap-red/20 text-cap-red focus:ring-cap-red/20"
                  />
                ) : (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${profile.parentPlus ? 'bg-cap-red border-cap-red' : 'border-gray-300'}`}>
                    {profile.parentPlus && <span className="text-white text-xs">✓</span>}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-900">Parent PLUS Available</label>
                  <p className="text-xs text-gray-600">Parent can borrow on your behalf</p>
                </div>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Expected Starting Salary (Annual)<RequiredStar /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Monthly Budget<RequiredStar /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Annual Funding Gap<RequiredStar /></label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={profile.annualGap || ''}
                      onChange={(e) => handleInputChange('annualGap', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full pl-8 pr-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                      required
                      min="0"
                      placeholder="COA minus grants/scholarships"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">${profile.annualGap?.toLocaleString() || 'Not set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Current Savings<OptionalTag /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Other Debt Obligations<OptionalTag /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Financial Dependents<OptionalTag /></label>
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
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Family Size<OptionalTag /></label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.familySize || ''}
                    onChange={(e) => handleInputChange('familySize', parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    min="1"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.familySize}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Tuition Growth Rate (%)<OptionalTag /></label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="number"
                      value={profile.tuitionGrowthRate || ''}
                      onChange={(e) => handleInputChange('tuitionGrowthRate', parseFloat(e.target.value) || 7)}
                      className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                      min="0"
                      max="20"
                      step="0.1"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">%</span>
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">{profile.tuitionGrowthRate}%</p>
                )}
              </div>
            </div>
          </Card>

          {/* Repayment Preferences Section */}
          <Card highlight>
            <div className="flex items-center gap-2 mb-6">
              <Target size={20} className="text-cap-red" />
              <h2 className="text-xl font-bold text-gray-900">Repayment Preferences</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">In-School Payment<RequiredStar /></label>
                {isEditing ? (
                  <select
                    value={profile.inSchoolPayment}
                    onChange={(e) => handleInputChange('inSchoolPayment', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                    required
                  >
                    <option value="defer">Full Deferment</option>
                    <option value="interest-only">Interest Only</option>
                    <option value="fixed-25">Fixed $25</option>
                    <option value="full">Full Payment</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {profile.inSchoolPayment === 'defer' ? 'Full Deferment' :
                     profile.inSchoolPayment === 'interest-only' ? 'Interest Only' :
                     profile.inSchoolPayment === 'fixed-25' ? 'Fixed $25' : 'Full Payment'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Risk Tolerance<OptionalTag /></label>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Prioritize<OptionalTag /></label>
                {isEditing ? (
                  <select
                    value={profile.prioritize}
                    onChange={(e) => handleInputChange('prioritize', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                  >
                    <option value="min total cost">Minimize Total Cost</option>
                    <option value="min monthly payment">Minimize Monthly Payment</option>
                    <option value="fastest payoff">Fastest Payoff</option>
                    <option value="lowest risk">Lowest Risk</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {profile.prioritize === 'min total cost' ? 'Minimize Total Cost' :
                     profile.prioritize === 'min monthly payment' ? 'Minimize Monthly Payment' :
                     profile.prioritize === 'fastest payoff' ? 'Fastest Payoff' : 'Lowest Risk'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Optimize By<RequiredStar /></label>
                {isEditing ? (
                  <select
                    value={profile.optimizeBy}
                    onChange={(e) => {
                      handleInputChange('optimizeBy', e.target.value);
                      // Reset dependent fields when switching
                      if (e.target.value === 'target_payoff_years') {
                        handleInputChange('maxMonthlyPayment', null);
                      } else {
                        handleInputChange('targetPayoffDuration', null);
                      }
                    }}
                    className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                    required
                  >
                    <option value="">Select optimization method</option>
                    <option value="target_payoff_years">Target Payoff Years</option>
                    <option value="max_monthly_payment">Max Monthly Payment</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">
                    {profile.optimizeBy === 'target_payoff_years' ? 'Target Payoff Years' :
                     profile.optimizeBy === 'max_monthly_payment' ? 'Max Monthly Payment' : 'Not set'}
                  </p>
                )}
              </div>
              
              {profile.optimizeBy === 'target_payoff_years' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Target Payoff Duration (Years)<RequiredStar /></label>
                  {isEditing ? (
                    <select
                      value={profile.targetPayoffDuration || ''}
                      onChange={(e) => handleInputChange('targetPayoffDuration', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                      required={profile.optimizeBy === 'target_payoff_years'}
                    >
                      <option value="">Select years</option>
                      <option value="5">5 Years</option>
                      <option value="7">7 Years</option>
                      <option value="10">10 Years</option>
                      <option value="15">15 Years</option>
                      <option value="20">20 Years</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.targetPayoffDuration ? `${profile.targetPayoffDuration} years` : 'Not set'}</p>
                  )}
                </div>
              )}
              
              {profile.optimizeBy === 'max_monthly_payment' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Max Monthly Payment ($)<RequiredStar /></label>
                  {isEditing ? (
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                      <input
                        type="number"
                        value={profile.maxMonthlyPayment || ''}
                        onChange={(e) => handleInputChange('maxMonthlyPayment', e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full pl-8 pr-4 py-2 border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                        required={profile.optimizeBy === 'max_monthly_payment'}
                        min="0"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium">${profile.maxMonthlyPayment?.toLocaleString() || 'Not set'}</p>
                  )}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Target Payoff Year<OptionalTag /></label>
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
