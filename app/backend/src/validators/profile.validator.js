import { z } from "zod";

/* =============================
Complete Profile Schema
============================= */
/**
 * Schema for validating the completion of a user's profile. It ensures that the branch ID and batch ID are valid UUIDs, and that the CGPA, 10th percentage, and 12th percentage are within acceptable ranges. If any of the fields fail validation, a descriptive error message will be provided.
 * - `branch_id`: A required string that must be a valid UUID representing the ID of the user's academic branch.
 * - `batch_id`: A required string that must be a valid UUID representing the ID of the user's academic batch.
 * - `cgpa`: A required number representing the user's CGPA, which must be between 0 and 10.
 * - `tenth_percentage`: A required number representing the user's 10th percentage, which must be between 0 and 100.
 * - `twelfth_percentage`: A required number representing the user's 12th percentage, which must be between 0 and 100.
 * If any of the fields fail validation, a descriptive error message will be provided.
 */
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
/**
 * Schema for validating the update of a user's profile. It allows optional updates to the branch ID, batch ID, CGPA, 10th percentage, and 12th percentage. It ensures that if provided, the branch ID and batch ID are valid UUIDs, and that the CGPA, 10th percentage, and 12th percentage are within acceptable ranges. Additionally, it requires that at least one field is provided for update. If any of the fields fail validation, a descriptive error message will be provided.
 * - `branch_id`: An optional string that must be a valid UUID representing the ID of the user's academic branch.
 * - `batch_id`: An optional string that must be a valid UUID representing the ID of the user's academic batch.
 * - `cgpa`: An optional number representing the user's CGPA, which must be between 0 and 10 if provided.
 * - `tenth_percentage`: An optional number representing the user's 10th percentage, which must be between 0 and 100 if provided.
 * - `twelfth_percentage`: An optional number representing the user's 12th percentage, which must be between 0 and 100 if provided.
 * Additionally, at least one of the fields must be provided for update. If any of the fields fail validation, a descriptive error message will be provided.
 */
export const updateProfileSchema = z
	.object({
		branch_id: z.string().uuid("Invalid branch ID").optional(),
		batch_id: z.string().uuid("Invalid batch ID").optional(),

		cgpa: z.number().min(0).max(10).optional(),

		tenth_percentage: z.number().min(0).max(100).optional(),

		twelfth_percentage: z.number().min(0).max(100).optional(),

		phone_number: z
			.string()
			.trim()
			.min(7, "Phone number must be at least 7 characters")
			.max(20, "Phone number must be 20 characters or less")
			.regex(/^[0-9+()\-\s]+$/, "Invalid phone number")
			.nullable()
			.optional(),

		personal_email: z.string().email("Personal email must be valid").nullable().optional(),

		linkedin_url: z.string().url("LinkedIn URL must be valid").nullable().optional(),
		github_url: z.string().url("GitHub URL must be valid").nullable().optional(),
		portfolio_url: z.string().url("Portfolio URL must be valid").nullable().optional(),
	})
	.refine((data) => Object.keys(data).length > 0, { message: "At least one field must be updated" });
