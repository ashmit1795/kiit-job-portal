import dotenv from "dotenv";

dotenv.config();

class Env {
	constructor() {
		this.PORT = process.env.PORT || 5000;
		this.NODE_ENV = process.env.NODE_ENV || "development";
		this.SUPABASE_URL = process.env.SUPABASE_URL;
		this.SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

		this.ADMIN_EMAILS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim()) : [];

		this.validate();
	}

	validate() {
		if (!this.SUPABASE_URL) {
			console.warn("⚠️ SUPABASE_URL not set");
		}

		if (!this.SUPABASE_SECRET_KEY) {
			console.warn("⚠️ SUPABASE_SECRET_KEY not set");
		}
	}
}

export default new Env();
