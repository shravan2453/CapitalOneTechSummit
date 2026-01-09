import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jtqcwhxjkjnwphheisbg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cWN3aHhqa2pud3BoaGVpc2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MjU0MDEsImV4cCI6MjA4MzQwMTQwMX0.U5RGcGzq93-GnHOtJMUE_lJSAirQ7552E5ja3ZhNT7k';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found, using fallback values');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
