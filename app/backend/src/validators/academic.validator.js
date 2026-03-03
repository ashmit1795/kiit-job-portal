import { z } from "zod";

/* =============================
Program Schema
============================= */

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

export const createBatchSchema = z.object({
	year: z
		.number({
			invalid_type_error: "Year must be a number",
		})
		.int("Year must be an integer")
		.min(2000, "Invalid year")
		.max(2100, "Invalid year"),
});
