import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Questa riga "esporta" la connessione così page.tsx può usarla
export const supabase = createClient(supabaseUrl, supabaseAnonKey)