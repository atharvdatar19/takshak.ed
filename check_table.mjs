import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supUrl = process.env.VITE_SUPABASE_URL;
const supKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supUrl, supKey);

async function check() {
  const { data, error } = await supabase.from('exams_timeline').select('*').limit(1);
  if (error) console.error(error);
  else console.log(JSON.stringify(Object.keys(data[0] || {})));
}
check();
