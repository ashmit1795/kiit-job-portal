import { ZodError } from "zod";
import AppError from "../utils/AppError.js";

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
						formattedErrors.map((e) => `${e.field}: ${e.message}`).join(", "),
						400,
						true
					),
				);
			}

			next(err);
		}
	};
};
