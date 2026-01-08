import { supabase } from '../lib/supabase';

export interface UserRecord {
  id: string;
  created_at: string;
  email: string;
  name: string | null;
  age: number | null;
  graduation_date: string | null;
  expected_income: number;
  credit_score_range: string | null;
  state_of_residence: string | null;
  school_name: string | null;
  program_type: string | null;
  enrollment_status: string | null;
  current_savings: number | null;
  monthly_budget: number;
  other_debt: number | null;
  financial_dependents: number | null;
  risk_preference: string;
  target_payoff_date: string | null;
  prioritize: string;
}

export const userService = {
  // Get user by email
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      // PGRST116 = no rows returned (user doesn't exist, first time user)
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  },

  // Get user by ID (for future use!)
  async getUserById(id: string): Promise<UserRecord | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Same error handling as getUserByEmail
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  },

  // Create or update user profile (uses email as unique identifier)
  async upsertUser(userData: {
    email: string;
    name?: string;
    age?: number;
    graduation_date?: string;
    expected_income: number;
    monthly_budget: number;
    credit_score_range?: string;
    state_of_residence?: string;
    school_name?: string;
    program_type?: string;
    enrollment_status?: string;
    current_savings?: number;
    other_debt?: number;
    financial_dependents?: number;
    risk_preference?: string;
    target_payoff_date?: string;
    prioritize?: string;
  }): Promise<UserRecord> {
    const { data, error } = await supabase
      .from('users')
      .upsert([userData], {
        onConflict: 'email',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error saving user: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from upsert');
    }

    return data;
  },

  // Check if profile is complete
  isProfileComplete(user: UserRecord | null): boolean {
    if (!user) return false;
    
    // Required fields:
    return !!(
      user.name &&
      user.age &&
      user.graduation_date &&
      user.expected_income &&
      user.monthly_budget &&
      user.school_name &&
      user.program_type &&
      user.enrollment_status
    );
  },
};

