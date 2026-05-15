import { sendBrevoEmail } from "./providers/brevo.provider.js";
import env from "../config/env.js";
import logger from "../utils/logger.js";

class EmailService {
	async send({ to, subject, html }) {
		try {
			return await sendBrevoEmail({
				apiKey: env.BREVO_API_KEY,
				from: env.MAIL_FROM,
				to,
				subject,
				html,
			});
		} catch (error) {
			logger.error("Error sending email", {
				message: error.message,
				stack: error.stack,
			});
			throw new Error("Failed to send email");
		}
	}
}

export default new EmailService();
