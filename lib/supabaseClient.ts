// FIX: Add Vite client types to resolve import.meta.env error.
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

// Use Vite's standard method for accessing environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = "Supabase URL and Anon Key must be provided. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment variables.";
  console.error(errorMsg);
  // In a real app, you might want to show this message in the UI for the user.
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);