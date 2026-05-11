import { inngest } from "../../client.js";

import emailService from "../../../emails/email.service.js";

import { welcomeTemplate } from "../../../emails/templates/welcome.template.js";

export const sendWelcomeEmail = inngest.createFunction(
	{
		id: "send-welcome-email",

		triggers: [
			{
				event: "user/signed_up",
			},
		],
	},

	async ({ event, step }) => {
		await step.run("send-welcome-email", async () => {
			await emailService.send({
				to: event.data.email,
				subject: "Welcome to Avsaar",
				html: welcomeTemplate(event.data),
			});
		});
	},
);
