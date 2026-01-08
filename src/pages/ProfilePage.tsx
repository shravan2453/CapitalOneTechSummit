import React, { useState } from 'react';
import { Card, Button, PageHeader } from '../components/shared';
import { Briefcase, Target, Edit2, GraduationCap, MapPin, School, Users, DollarSign, Calendar } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    // Personal Profile
    firstName: 'Alex',
    lastName: 'Mercer',
    age: 22,
    graduationDate: '2025-05-15',
    state: 'NC',
    creditScore: 742,
    
    // School & Enrollment
    schoolName: 'University of North Carolina',
    programType: 'undergraduate',
    enrollmentStatus: 'full-time',
    classYear: '2023',
    major: 'Computer Science',
    
    // Financial Profile
    currentIncome: 0,
    projectedIncome: 65000,
    currentSavings: 5000,
    monthlyBudget: 4200,
    otherDebt: 0,
    financialDependents: 0,
    
    // Loan Preferences
    riskTolerance: 'moderate',
    primaryGoal: 'minimize-total-cost',
    targetPayoffYear: 2033,
    prioritizeMonthly: false
  });

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-enter">
      <PageHeader 
        title="User Profile" 
        subtitle="Manage your personal details, financial context, and loan preferences."
        action={
          <Button 
            variant={isEditing ? "primary" : "secondary"} 
            icon={isEditing ? "save" : "edit-2"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        }
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
        <div className="space-y-6">
          {/* Personal Profile Section */}
          <Card highlight>
            <div className="flex items-center gap-2 mb-6">
              <Users size={20} className="text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">Personal Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.lastName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.age} years old</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">State of Residence</label>
                {isEditing ? (
                  <select
                    value={profile.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                  >
                    <option value="NC">North Carolina</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{profile.state}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Graduation Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profile.graduationDate}
                    onChange={(e) => handleInputChange('graduationDate', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{new Date(profile.graduationDate).toLocaleDateString()}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Credit Score Range</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.creditScore}
                    onChange={(e) => handleInputChange('creditScore', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.creditScore} (Good)</p>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">School Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.schoolName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Program Type</label>
                {isEditing ? (
                  <select
                    value={profile.programType}
                    onChange={(e) => handleInputChange('programType', e.target.value)}
                    className="w-full px-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                  >
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="professional">Professional</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{profile.programType}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Enrollment Status</label>
                {isEditing ? (
                  <select
                    value={profile.enrollmentStatus}
                    onChange={(e) => handleInputChange('enrollmentStatus', e.target.value)}
                    className="w-full px-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                  >
                    <option value="full-time">Full-Time</option>
                    <option value="half-time">Half-Time</option>
                    <option value="part-time">Part-Time</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{profile.enrollmentStatus.replace('-', ' ')}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Major/Program</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.major}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Class Year</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.classYear}
                    onChange={(e) => handleInputChange('classYear', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">Class of {profile.classYear}</p>
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
                <label className="block text-sm font-semibold text-gray-900 mb-2">Current Income (Annual)</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={profile.currentIncome}
                      onChange={(e) => handleInputChange('currentIncome', parseInt(e.target.value))}
                      className="w-full pl-8 pr-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">${profile.currentIncome.toLocaleString()}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Projected Income (Annual)</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={profile.projectedIncome}
                      onChange={(e) => handleInputChange('projectedIncome', parseInt(e.target.value))}
                      className="w-full pl-8 pr-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">${profile.projectedIncome.toLocaleString()}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Current Savings</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={profile.currentSavings}
                      onChange={(e) => handleInputChange('currentSavings', parseInt(e.target.value))}
                      className="w-full pl-8 pr-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">${profile.currentSavings.toLocaleString()}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Monthly Budget</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={profile.monthlyBudget}
                      onChange={(e) => handleInputChange('monthlyBudget', parseInt(e.target.value))}
                      className="w-full pl-8 pr-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">${profile.monthlyBudget.toLocaleString()}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Other Debt Obligations</label>
                {isEditing ? (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={profile.otherDebt}
                      onChange={(e) => handleInputChange('otherDebt', parseInt(e.target.value))}
                      className="w-full pl-8 pr-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
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
                    value={profile.financialDependents}
                    onChange={(e) => handleInputChange('financialDependents', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
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
                    className="w-full px-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
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
                    className="w-full px-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
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
                    style={{
                      background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                    }}
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
                    className="w-full px-4 py-2  border-2 border-cap-red/10 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-cap-red/30 outline-none text-gray-900"
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
