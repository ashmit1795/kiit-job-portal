import dotenv from "dotenv";

dotenv.config();

/**
 * Environment configuration class that loads and validates environment variables for the application. It ensures that required variables such as Supabase credentials are present and provides default values for optional variables. The class also includes a validation method to check for the presence of critical environment variables and logs warnings if they are missing. This centralized configuration allows for easy management of environment-specific settings and helps prevent runtime errors due to missing configurations.
 */
class Env {
	constructor() {
		this.PORT = process.env.PORT || 5000;
		this.NODE_ENV = process.env.NODE_ENV || "development";
		this.SUPABASE_URL = process.env.SUPABASE_URL;
		this.SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
		this.DEV_AUTH_ENABLED = process.env.DEV_AUTH_ENABLED === "true";
		this.MAIL_FROM = process.env.MAIL_FROM;
		this.BREVO_API_KEY = process.env.BREVO_API_KEY;
		this.INNGEST_EVENT_KEY = process.env.INNGEST_EVENT_KEY;
		this.INNGEST_SIGNING_KEY = process.env.INNGEST_SIGNING_KEY;
		this.INNGEST_DEV = process.env.INNGEST_DEV;

		this.ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim()) : [];

		this.validate();
	}

	/**
	 * Validates the presence of critical environment variables and logs warnings if they are missing. This method checks for the Supabase URL and secret key, which are essential for the application's authentication and database interactions. If either of these variables is not set, a warning is logged to alert developers or administrators to the missing configuration, which could lead to runtime errors if not addressed.
	 */
	validate() {
		if (!this.SUPABASE_URL) {
			console.warn("⚠️ SUPABASE_URL not set");
		}

		if (!this.SUPABASE_SECRET_KEY) {
			console.warn("⚠️ SUPABASE_SECRET_KEY not set");
		}

		if (!this.INNGEST_EVENT_KEY) {
			console.warn("⚠️ INNGEST_EVENT_KEY not set");
		}

		if (!this.BREVO_API_KEY) {
			console.warn("⚠️ BREVO_API_KEY not set");
		}
	}
}

export default new Env();
