import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite and sanitize
const rawUrl = import.meta.env.VITE_SUPABASE_URL || ""; 
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const supabaseUrl = rawUrl.trim().replace(/[\r\n\t]/g, "");
const supabaseKey = rawKey.trim().replace(/[\r\n\t]/g, "");

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL:", supabaseUrl);
  console.error("Supabase Anon Key:", supabaseKey);
  throw new Error("Supabase URL and Anon Key are required. Check your .env file and ensure they are prefixed with VITE_ and the dev server was restarted.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);