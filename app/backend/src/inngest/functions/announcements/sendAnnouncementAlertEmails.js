import { inngest } from "../../client.js";
import env from "../../../config/env.js";
import subscriptionRepository from "../../../modules/users/subscription.repository.js";
import jobRepository from "../../../modules/job/job.repository.js";
import emailService from "../../../emails/email.service.js";
import { announcementAlertTemplate, getAnnouncementSubject } from "../../../emails/templates/announcementAlert.template.js";

const CHUNK_SIZE = 50;

function chunkArray(items, size) {
	const chunks = [];
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size));
	}
	return chunks;
}

export const sendAnnouncementAlertEmails = inngest.createFunction(
	{
		id: "send-announcement-alert-emails",
		triggers: [
			{
				event: "announcement/posted",
			},
		],
	},
	async ({ event, step }) => {
		const announcement = event.data;

		const subscribers = await step.run("fetch-eligible-subscribers", async () => {
			if (announcement.job_id) {
				const job = await jobRepository.findById(announcement.job_id);
				if (job) {
					const branchIds = job.eligible_branches?.map((b) => b.id) || [];
					const batchIds = job.eligible_batches?.map((b) => b.id) || [];
					return subscriptionRepository.getEligibleSubscribers(branchIds, batchIds);
				}
			} else {
				// Standalone: Check if targeting specific branches/batches
				const branchIds = announcement.eligible_branches?.map((b) => b.id) || [];
				const batchIds = announcement.eligible_batches?.map((b) => b.id) || [];

				if (branchIds.length > 0 || batchIds.length > 0) {
					return subscriptionRepository.getEligibleSubscribers(branchIds, batchIds);
				}
			}
			// Truly Global or fallback: fetch all active subscribers
			return subscriptionRepository.getAllSubscribers();
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
					await emailService.send({
						to: user.email,
						subject: getAnnouncementSubject(announcement),
						html: announcementAlertTemplate(announcement, user),
					});
				}
			});
		}

		return { sent: subscribers.length };
	},
);
