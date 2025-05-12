import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jocewjgcokxuijqhptvn.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvY2V3amdjb2t4dWlqcWhwdHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMTAxMDIsImV4cCI6MjA2MjU4NjEwMn0.AF-GBMAGSOVzMRIWZWwjMGBqD0By5FTceRhg8i0sSwI'

// Create a single supabase client for interacting with the database
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
) 