import { inngest } from "../../client.js";
import userRepository from "../../../modules/users/user.repository.js";
import emailService from "../../../emails/email.service.js";
import { profileReminderTemplate } from "../../../emails/templates/profileReminder.template.js";
import env from "../../../config/env.js";

export const sendProfileReminder = inngest.createFunction(
	{
		id: "send-profile-reminder",
		cancelOn: [
			{
				event: "user/profile_completed",
				if: "async.data.id == event.data.id",
			},
		],

		triggers: [
			{
				event: "user/signed_up",
			},
		],
	},
	async ({ event, step }) => {
		// Wait 24 hours
		if (env.NODE_ENV === "production") {
			await step.sleep("wait-before-reminder", "24h");
		} else {
			await step.sleep("wait-before-reminder", "1m"); // Change to "24h" in production
		}
		// Fetch latest user state
		const user = await step.run("fetch-user", async () => {
			return userRepository.findById(event.data.id);
		});

		// User may no longer exist
		if (!user) {
			return;
		}

		// Skip if already completed
		if (user.profile_completed) {
			return;
		}

		// Send reminder
		await step.run("send-reminder-email", async () => {
			await emailService.send({
				to: user.email,
				subject: "Complete Your Avsaar Profile",
				html: profileReminderTemplate(user),
			});
		});
	},
);
