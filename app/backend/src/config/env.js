import dotenv from "dotenv";

dotenv.config();

class Env {
	constructor() {
		this.PORT = process.env.PORT || 5000;
		this.NODE_ENV = process.env.NODE_ENV || "development";
		this.SUPABASE_URL = process.env.SUPABASE_URL;
		this.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

		this.validate();
	}

	validate() {
		if (!this.SUPABASE_URL) {
			console.warn("⚠️ SUPABASE_URL not set");
		}

		if (!this.SUPABASE_ANON_KEY) {
			console.warn("⚠️ SUPABASE_ANON_KEY not set");
		}
	}
}

export default new Env();
