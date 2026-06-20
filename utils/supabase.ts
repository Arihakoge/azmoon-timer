import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// حالا این ابزار به صورت سراسری در کل پروژه قابل استفاده است
export const supabase = createClient(supabaseUrl, supabaseKey);