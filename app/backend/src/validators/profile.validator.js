import { z } from "zod";

/* =============================
Complete Profile Schema
============================= */

export const completeProfileSchema = z.object({
	branch_id: z.string().uuid("Invalid branch ID"),
	batch_id: z.string().uuid("Invalid batch ID"),

	cgpa: z.number("CGPA is required").min(0, "CGPA must be >= 0").max(10, "CGPA must be <= 10"),

	tenth_percentage: z.number("10th % is required").min(0, "10th % must be >= 0").max(100, "10th % must be <= 100"),

	twelfth_percentage: z.number("12th % is required").min(0, "12th % must be >= 0").max(100, "12th % must be <= 100"),
});

/* =============================
Update Profile Schema
============================= */

export const updateProfileSchema = z
	.object({
		branch_id: z.string().uuid("Invalid branch ID").optional(),
		batch_id: z.string().uuid("Invalid batch ID").optional(),

		cgpa: z.number().min(0).max(10).optional(),

		tenth_percentage: z.number().min(0).max(100).optional(),

		twelfth_percentage: z.number().min(0).max(100).optional(),
	})
	.refine((data) => Object.keys(data).length > 0, { message: "At least one field must be updated" });