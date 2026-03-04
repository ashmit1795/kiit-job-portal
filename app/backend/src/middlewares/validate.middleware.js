import { ZodError } from "zod";
import AppError from "../utils/AppError.js";

/**
 * Middleware to validate incoming request data against a specified Zod schema. It can validate data from different sources such as the request body, query parameters, or URL parameters. If the validation fails, it formats the Zod validation errors into a more readable format and throws an AppError with a 400 status code. If the validation succeeds, it attaches the validated data back to the request object and calls the next middleware in the stack.
 * @function validate
 * @param {Object} schema - The Zod schema against which the request data should be validated.
 * @param {string} [source="body"] - The source of the data to validate, which can be "body", "query", or "params". Defaults to "body".
 * @return {Function} A middleware function that performs the validation and either allows the request to proceed or throws an error if validation fails.
 * @throws {AppError} Throws an AppError with a 400 status code if the validation fails, including details about which fields failed validation and why.
 */
export const validate = (schema, source = "body") => {
	return (req, res, next) => {
		try {
			const data = schema.parse(req[source]);
			req[source] = data;
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				const formattedErrors = err.issues.map((issue) => ({
					field: issue.path.join("."),
					message: issue.message,
				}));

				return next(
					new AppError(
						formattedErrors.map((e) => `${e.message}`).join(", "),
						400,
						true,
						formattedErrors, // optional extra metadata
					),
				);
			}

			next(err);
		}
	};
};
