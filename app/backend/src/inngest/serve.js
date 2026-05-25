import { serve } from "inngest/express";
import { inngest } from "./client.js";
import { sendWelcomeEmail } from "./functions/auth/sendWelcomeEmail.js";
import { sendProfileReminder } from "./functions/auth/sendProfileReminder.js";
import { sendJobAlertEmails } from "./functions/jobs/sendJobAlertEmails.js";
import { sendContactMessage } from "./functions/contact/sendContactMessage.js";
import { sendAnnouncementAlertEmails } from "./functions/announcements/sendAnnouncementAlertEmails.js";

export const inngestHandler = serve({
	client: inngest,

	functions: [sendWelcomeEmail, sendProfileReminder, sendJobAlertEmails, sendContactMessage, sendAnnouncementAlertEmails],
});

