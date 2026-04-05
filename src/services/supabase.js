import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sbnfplvkwdcgzunefwbn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibmZwbHZrd2RjZ3p1bmVmd2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzcxNDksImV4cCI6MjA5MDk1MzE0OX0.S0RM3jSmqGcfgL5lGZUFr6pPPPL5NFHoa1Dsv9uUPJo'

export const supabase = createClient(supabaseUrl, supabaseKey)