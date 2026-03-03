import AppError from "./AppError.js";

export default function mapSupabaseError(error) {
	if (!error?.code) return null;

	const code = error.code.toString();

	// PostgreSQL unique violation
	if (code === "23505") {
		return new AppError("Duplicate record already exists", 409);
	}

	// Foreign key violation
	if (code === "23503") {
		return new AppError("Invalid reference provided", 409);
	}

	// Not null constraint violation
	if (code === "23502") {
		return new AppError("Required field is missing", 400);
	}

	// Undefined function/table errors
	if (code === "42883" || code === "42P01") {
		return new AppError("Resource not found", 404);
    }
    
    if (code === "PGRST116") {
        return null; // No rows found - not an error for our use case
    }

	// PostgREST schema access issues
	if (code.startsWith("PGRST000") || code.startsWith("PGRST001") || code.startsWith("PGRST002")) {
		return new AppError("Database service unavailable", 503, false);
	}

	// Any other PostgREST errors can be considered client mistakes
	if (code.startsWith("PGRST")) {
		return new AppError(error.message || "Bad request", 400);
    }
    

	// Other SQLSTATE classes:
	// If the error is still recognized as a PG error, default to 400
	return new AppError(error.message ?? "Database operation failed", 400);
}
