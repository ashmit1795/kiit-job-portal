import { z } from "zod";

/* =============================
Program Schema
============================= */

/**
 * Schema for validating the creation of a new academic program. It ensures that the program name is provided, the level is either "UG" or "PG", and the duration in years is a positive integer.
 * - `name`: A required string representing the name of the program.
 * - `level`: A required enum that must be either "UG" (Undergraduate) or "PG" (Postgraduate).
 * - `duration_years`: A required positive integer representing the duration of the program in years.
 * If any of the fields fail validation, a descriptive error message will be provided.
 */
export const createProgramSchema = z.object({
	name: z.string().min(1, "Program name is required"),

	level: z.enum(["UG", "PG"], {
		errorMap: () => ({ message: "Level must be UG or PG" }),
	}),

	duration_years: z
		.number({
			invalid_type_error: "Duration must be a number",
		})
		.int("Duration must be an integer")
		.positive("Duration must be positive"),
});

/* =============================
Branch Schema
============================= */
/**
 * Schema for validating the creation of a new academic branch. It ensures that the branch name and code are provided, and that the code is transformed to uppercase. It also validates that the associated program ID is a valid UUID.
 * - `name`: A required string representing the name of the branch.
 * - `code`: A required string representing the code of the branch, which will be transformed to uppercase.
 * - `program_id`: A required string that must be a valid UUID representing the ID of the associated academic program.
 * If any of the fields fail validation, a descriptive error message will be provided.
 */
export const createBranchSchema = z.object({
	name: z.string().min(1, "Branch name is required"),

	code: z
		.string()
		.min(1, "Branch code is required")
		.transform((val) => val.toUpperCase()),

	program_id: z.string().uuid("Invalid program ID"),
});

/* =============================
Batch Schema
============================= */
/**
 * Schema for validating the creation of a new academic batch. It ensures that the year is provided, is an integer, and falls within a reasonable range (between 2000 and 2100). If the year fails validation, a descriptive error message will be provided.
 * - `year`: A required number representing the year of the batch. It must be an integer between 2000 and 2100.
 * If the field fails validation, a descriptive error message will be provided.
 */
export const createBatchSchema = z.object({
	year: z
		.number({
			invalid_type_error: "Year must be a number",
		})
		.int("Year must be an integer")
		.min(2000, "Invalid year")
		.max(2100, "Invalid year"),
});
