import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://noalfakyypbtsvbrlgep.supabase.co'
const supabaseKey = 'sb_publishable_hLKZZyFHr4nXoQqWZrjlmg_UpQtctOD'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)