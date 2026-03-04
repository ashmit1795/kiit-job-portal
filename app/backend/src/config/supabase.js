import { createClient } from "@supabase/supabase-js";
import env from "./env.js";

/**
 * Initializes and exports a Supabase client instance for interacting with the Supabase backend services. The client is configured using the Supabase URL and secret key from the environment variables. The authentication settings are configured to disable session persistence and automatic token refreshing, which is suitable for server-side applications where sessions are not maintained across requests. This client can be imported and used throughout the application to perform various operations such as authentication, database queries, and file storage interactions with Supabase.
 */
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
});

export default supabase;
