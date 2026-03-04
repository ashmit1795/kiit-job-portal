/**
 * Middleware to handle 404 Not Found errors for undefined routes.
 * @function notFound
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the Express stack.
 */
export default function notFound(req, res, next) {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
}
