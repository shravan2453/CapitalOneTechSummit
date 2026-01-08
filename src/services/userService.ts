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

/**
 * Service for managing user profiles
 * Handles CRUD operations on the users table
 */
export const userService = {
  /**
   * Get user by email address
   * This is the primary method used in the app because Supabase Auth provides user.email
   * when a user logs in. Email is also the unique identifier in the users table.
   * 
   * @param email - User's email address
   * @returns UserRecord if found, null if user doesn't exist (first-time user)
   */
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      // PGRST116 = no rows returned (user doesn't exist - normal for first-time users)
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  },

  /**
   * Get user by UUID ID
   * This method exists for potential future use cases, such as:
   * - Looking up users by their database ID
   * - Working with foreign key relationships
   * - Admin operations that might have the ID but not the email
   * 
   * Currently not used in the app, but kept for flexibility.
   * 
   * @param id - User's UUID from the database
   * @returns UserRecord if found, null if user doesn't exist
   */
  async getUserById(id: string): Promise<UserRecord | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  },

  /**
   * Create or update user profile (uses email as unique identifier)
   * If user exists, updates their profile. If not, creates a new profile.
   * 
   * @param userData - User profile data (email is required and used as unique identifier)
   * @returns Created or updated user record
   */
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

  /**
   * Check if user profile is complete
   * A complete profile has all required fields filled in
   * 
   * @param user - UserRecord to check, or null
   * @returns true if profile is complete, false otherwise
   */
  isProfileComplete(user: UserRecord | null): boolean {
    if (!user) return false;
    
    // Required fields for a complete profile:
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

