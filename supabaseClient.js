import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://ktrezsjbadwceajiwker.supabase.co'
const supabaseKey = 'sb_publishable_AfDcbKtuQ-otIV9ylWqNbA_2kwaPz5u'
export const supabase = createClient(supabaseUrl, supabaseKey)
