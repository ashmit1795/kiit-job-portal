import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://goocnepzxrpxcugnkhmd.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_K6jWeLTAgsgX-r1RXKi0jQ_2evdBys3";

export const supabase = createClient(supabaseUrl, supabaseKey);
