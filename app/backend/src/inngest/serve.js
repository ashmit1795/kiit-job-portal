import { serve } from "inngest/express";
import { inngest } from "./client.js";
import { sendWelcomeEmail } from "./functions/auth/sendWelcomeEmail.js";

export const inngestHandler = serve({
	client: inngest,

	functions: [sendWelcomeEmail],
});
