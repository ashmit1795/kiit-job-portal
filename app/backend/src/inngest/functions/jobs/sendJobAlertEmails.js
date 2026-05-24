import { inngest } from "../../client.js";
import env from "../../../config/env.js";
import subscriptionRepository from "../../../modules/users/subscription.repository.js";
import emailService from "../../../emails/email.service.js";
import { jobAlertTemplate, getJobTypeLabel } from "../../../emails/templates/jobAlert.template.js";

const CHUNK_SIZE = 50;

function chunkArray(items, size) {
	const chunks = [];
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size));
	}
	return chunks;
}

export const sendJobAlertEmails = inngest.createFunction(
	{
		id: "send-job-alert-emails",
		triggers: [
			{
				event: "job/posted",
			},
		],
	},
	async ({ event, step }) => {
		// Do not send job alerts if the deadline has already passed
		const deadline = new Date(event.data.deadline);
		if (deadline < new Date()) {
			return { sent: 0, reason: "deadline_passed" };
		}

		const subscribers = await step.run("fetch-eligible-subscribers", async () => {
			return subscriptionRepository.getEligibleSubscribers(event.data.branch_ids, event.data.batch_ids);
		});

		if (!subscribers.length) {
			return { sent: 0 };
		}

		const delay = env.NODE_ENV === "production" ? "2m" : "0s";
		if (delay !== "0s") {
			await step.sleep("wait-before-sending", delay);
		}

		const chunks = chunkArray(subscribers, CHUNK_SIZE);

		for (let i = 0; i < chunks.length; i += 1) {
			await step.run(`send-chunk-${i}`, async () => {
				for (const user of chunks[i]) {
					const jobTypeLabel = getJobTypeLabel(event.data.job_type);
					await emailService.send({
						to: user.email,
						subject: `🚀 New ${jobTypeLabel} at ${event.data.company_name} | अवSaar Alert`,
						html: jobAlertTemplate(event.data, user),
					});
				}
			});
		}

		return { sent: subscribers.length };
	},
);
