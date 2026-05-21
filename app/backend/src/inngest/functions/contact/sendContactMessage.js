import { inngest } from "../../client.js";
import emailService from "../../../emails/email.service.js";
import { contactTemplate } from "../../../emails/templates/contact.template.js";

export const sendContactMessage = inngest.createFunction(
	{
		id: "send-contact-message",
		triggers: [
			{
				event: "contact/message_sent",
			},
		],
	},
	async ({ event, step }) => {
		await step.run("send-contact-email", async () => {
			await emailService.send({
				to: "avsaar.careers@gmail.com",
				subject: `New Message from ${event.data.name} via अवSaar Contact Form`,
				html: contactTemplate(event.data),
				replyTo: event.data.email,
			});
		});
	},
);
