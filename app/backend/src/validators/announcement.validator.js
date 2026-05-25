import { z } from "zod";

export const createAnnouncementSchema = z.object({
	subject: z.string("Subject is required").min(1, "Subject cannot be empty"),

	description: z.string("Description is required").min(1, "Description cannot be empty"),

	job_id: z
		.union([z.string().uuid("Invalid job ID"), z.literal(""), z.null()])
		.optional()
		.transform((value) => (value === "" || value === null ? null : value)),

	circular_number: z.string("Circular number is required").min(1, "Circular number cannot be empty"),

	announcement_type: z
		.enum(
			["general", "deadline_extension", "shortlist", "test_link", "venue_update", "eligibility_update", "joining_update", "result", "warning"],
			{
				errorMap: () => ({ message: "Invalid announcement type" }),
			},
		)
		.optional()
		.default("general"),

	is_pinned: z
		.union([z.boolean(), z.literal("true"), z.literal("false")])
		.transform((val) => val === true || val === "true")
		.optional()
		.default(false),

	branches: z
		.array(z.string().uuid("Invalid branch ID"))
		.optional(),

	batches: z
		.array(z.string().uuid("Invalid batch ID"))
		.optional(),
});
