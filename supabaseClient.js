import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv"
dotenv.config()
// SUPABASE Connection Code
const supabaseUrl = 'https://mukjuqbxvlzhivroqeyk.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;