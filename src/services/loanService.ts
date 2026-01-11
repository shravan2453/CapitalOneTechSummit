import { supabase } from '../lib/supabase';
import { userService } from './userService';

export interface LoanRecord {
  id: string;
  created_at: string;
  user_id: string | null;
  name: string;
  type: string;
  lender: string | null;
  interest_rate: number;
  term_years: number;
  fixed_variable: string | null;
  origination_fee: number | null;
  grace_period: number | null;
  min_payment: number | null;
  max_amount: number | null;
  amount: number | null;
  repayment_plan: string | null;
  loan_category: string | null;
  loan_subtype: string | null;
  year_level: string | null;
  annual_limit: number | null;
  aggregate_limit: number | null;
  in_school_payment_strategy: string | null;
  weighted_avg_rate: number | null;
  total_cost: number | null;
  total_interest: number | null;
  payoff_date: string | null;
  is_paid: boolean;
  paid_date: string | null;
}

export interface CreateLoanData {
  name: string;
  type: string;
  lender?: string;
  interest_rate: number;
  term_years: number;
  fixed_variable?: string;
  origination_fee?: number;
  grace_period?: number;
  min_payment?: number;
  max_amount?: number;
  amount: number;
  repayment_plan?: string;
  loan_category?: string;
  loan_subtype?: string;
  year_level?: string;
  annual_limit?: number;
  aggregate_limit?: number;
  in_school_payment_strategy?: string;
  weighted_avg_rate?: number;
  total_cost?: number;
  total_interest?: number;
  payoff_date?: string;
  is_paid?: boolean;
  paid_date?: string;
}

export const loanService = {
  // Get all loans for the current authenticated user
  // Returns empty array if user doesn't have a profile yet
  async getAllLoans(): Promise<LoanRecord[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      throw new Error('User must be authenticated');
    }

    // Look up user to get correct user_id
    const userRecord = await userService.getUserByEmail(user.email);
    
    if (!userRecord) {
      // User doesn't have a profile yet, return empty array
      return [];
    }

    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', userRecord.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching loans: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Get a specific loan by ID
   * @param id - Loan UUID
   * @returns LoanRecord if found and belongs to user, null if not found
   */
  async getLoanById(id: string): Promise<LoanRecord | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      throw new Error('User must be authenticated');
    }

    // Look up user to get correct user_id
    const userRecord = await userService.getUserByEmail(user.email);
    
    if (!userRecord) {
      return null;
    }

    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('id', id)
      .eq('user_id', userRecord.id)
      .single();

    if (error) {
      // PGRST116 = no rows returned (loan doesn't exist or doesn't belong to user)
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error fetching loan: ${error.message}`);
    }

    return data;
  },

  /**
   * Create a new loan for the current user
   * Automatically sets user_id from authenticated user
   * @param loanData - Loan information including amount and repayment_plan
   * @returns Created loan record
   */
  async createLoan(loanData: CreateLoanData): Promise<LoanRecord> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      throw new Error('User must be authenticated to create a loan');
    }

    // Look up user to get correct user_id
    const userRecord = await userService.getUserByEmail(user.email);
    
    if (!userRecord) {
      throw new Error('User profile not found. Please complete your profile first.');
    }

    const { data, error } = await supabase
      .from('loans')
      .insert([{ ...loanData, user_id: userRecord.id }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating loan: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from insert');
    }

    return data;
  },

  /**
   * Update an existing loan
   * @param id - Loan UUID
   * @param loanData - Partial loan data to update
   * @returns Updated loan record
   */
  async updateLoan(id: string, loanData: Partial<CreateLoanData>): Promise<LoanRecord> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      throw new Error('User must be authenticated');
    }

    // Look up user to get correct user_id
    const userRecord = await userService.getUserByEmail(user.email);
    
    if (!userRecord) {
      throw new Error('User profile not found. Please complete your profile first.');
    }

    const { data, error } = await supabase
      .from('loans')
      .update(loanData)
      .eq('id', id)
      .eq('user_id', userRecord.id) // Ensure user can only update their own
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating loan: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from update');
    }

    return data;
  },

  /**
   * Delete a loan
   * @param id - Loan UUID
   */
  async deleteLoan(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      throw new Error('User must be authenticated');
    }

    // Look up user to get correct user_id
    const userRecord = await userService.getUserByEmail(user.email);
    
    if (!userRecord) {
      throw new Error('User profile not found. Please complete your profile first.');
    }

    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('id', id)
      .eq('user_id', userRecord.id); // Ensure user can only delete their own

    if (error) {
      throw new Error(`Error deleting loan: ${error.message}`);
    }
  },

  /**
   * Create multiple loans at once (for optimizer plan selection)
   * @param loansData - Array of loan data to create
   * @returns Created loan records
   */
  async createLoans(loansData: CreateLoanData[]): Promise<LoanRecord[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      throw new Error('User must be authenticated to create loans');
    }

    const userRecord = await userService.getUserByEmail(user.email);
    
    if (!userRecord) {
      throw new Error('User profile not found. Please complete your profile first.');
    }

    const loansWithUserId = loansData.map(loan => ({
      ...loan,
      user_id: userRecord.id
    }));

    const { data, error } = await supabase
      .from('loans')
      .insert(loansWithUserId)
      .select();

    if (error) {
      throw new Error(`Error creating loans: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Toggle the paid status of a loan
   * @param id - Loan UUID
   * @param isPaid - Whether the loan is paid
   * @returns Updated loan record
   */
  async toggleLoanPaid(id: string, isPaid: boolean): Promise<LoanRecord> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      throw new Error('User must be authenticated');
    }

    const userRecord = await userService.getUserByEmail(user.email);
    
    if (!userRecord) {
      throw new Error('User profile not found.');
    }

    const updateData: { is_paid: boolean; paid_date: string | null } = {
      is_paid: isPaid,
      paid_date: isPaid ? new Date().toISOString().split('T')[0] : null
    };

    const { data, error } = await supabase
      .from('loans')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userRecord.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating loan: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from update');
    }

    return data;
  },

  /**
   * Delete all loans for the current user (to replace with optimizer selection)
   */
  async deleteAllLoans(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.email) {
      throw new Error('User must be authenticated');
    }

    const userRecord = await userService.getUserByEmail(user.email);
    
    if (!userRecord) {
      return; // No user profile, nothing to delete
    }

    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('user_id', userRecord.id);

    if (error) {
      throw new Error(`Error deleting loans: ${error.message}`);
    }
  },
};

