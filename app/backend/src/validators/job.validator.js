import { z } from "zod";

/* =============================
Create Job Schema
============================= */
/**
 * Schema for validating job creation requests.
 * Ensures that required job details such as circular number, company name,
 * role title, job type, and deadline are provided and valid.
 * It also validates the eligibility arrays for branches and batches.
 *
 * - `circular_number`: Required string representing the official placement circular number.
 * - `company_name`: Required string representing the company offering the role.
 * - `role_title`: Required string representing the job role.
 * - `job_type`: Required enum indicating whether the job is an internship,
 *   placement, or internship with PPO.
 * - `ctc`: Optional string representing compensation details.
 * - `min_cgpa`: Optional number representing the minimum CGPA eligibility (0–10).
 * - `deadline`: Required ISO datetime string representing the application deadline.
 * - `description`: Optional string containing job description or notes.
 * - `circular_url`: Required valid URL pointing to the official placement circular.
 * - `branches`: Required array of branch UUIDs indicating eligible branches.
 * - `batches`: Required array of batch UUIDs indicating eligible batches.
 */

// export const createJobSchema = z.object({
// 	circular_number: z.string("Circular number is required").min(1, "Circular number cannot be empty"),
// 	company_name: z.string("Company name is required").min(1, "Company name cannot be empty"),
// 	role_title: z.string("Role title is required").min(1, "Role title cannot be empty"),
// 	job_type: z.enum(["placement", "internship", "internship_fulltime", "webinar", "hackathon", "talk"], {
// 		errorMap: () => ({ message: "Invalid job type" }),
// 	}),

// 	ctc: z.string().optional().default(null),
// 	stipend: z.string().optional().default(null),
// 	min_cgpa: z.coerce.number().min(0, "Minimum CGPA must be >= 0").max(10, "Minimum CGPA must be <= 10").optional().default(null),
// 	deadline: z.coerce.string("Deadline is required").datetime("Invalid deadline format. Expected ISO datetime"),
// 	joining_date: z.string().optional().default(null),
// 	description: z.string().optional().default(null),
// 	branches: z.array(z.string().uuid("Invalid branch ID")).min(1, "At least one eligible branch must be provided"),
// 	batches: z.array(z.string().uuid("Invalid batch ID")).min(1, "At least one eligible batch must be provided"),
// 	locations: z.array(z.string().min(1, "Location cannot be empty")).optional().default([]),
// });

export const createJobSchema = z.object({
	circular_number: z.string("Circular number is required").min(1, "Circular number cannot be empty"),

	company_name: z.string("Company name is required").min(1, "Company name cannot be empty"),

	role_title: z.string("Role title is required").min(1, "Role title cannot be empty"),

	job_type: z.enum(["placement", "internship", "internship_fulltime", "webinar", "hackathon", "talk"], {
		errorMap: () => ({ message: "Invalid job type" }),
	}),

	ctc: z.string().optional().default(null),

	stipend: z.string().optional().default(null),

	min_cgpa: z.coerce.number().min(0, "Minimum CGPA must be >= 0").max(10, "Minimum CGPA must be <= 10").optional().default(null),

	deadline: z.coerce.string("Deadline is required").datetime("Invalid deadline format. Expected ISO datetime"),

	joining_date: z.string().optional().default(null),

	description: z.string().optional().default(null),

	/* =============================
	Apply Links
	============================= */

	apply_link_1: z
		.string()
		.url("apply_link_1 must be a valid URL")
		.optional()
		.or(z.literal(""))
		.transform((v) => (v === "" ? null : v))
		.default(null),

	apply_link_2: z
		.string()
		.url("apply_link_2 must be a valid URL")
		.optional()
		.or(z.literal(""))
		.transform((v) => (v === "" ? null : v))
		.default(null),

	/* =============================
	Eligibility
	============================= */

	branches: z.array(z.string().uuid("Invalid branch ID")).min(1, "At least one eligible branch must be provided"),

	batches: z.array(z.string().uuid("Invalid batch ID")).min(1, "At least one eligible batch must be provided"),

	locations: z.array(z.string().min(1, "Location cannot be empty")).optional().default([]),
});
