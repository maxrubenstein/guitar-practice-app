import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Single-user app: no auth, no service role key exposed.
// RLS is intentionally permissive on all tables — this is a private, single-user deployment.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
