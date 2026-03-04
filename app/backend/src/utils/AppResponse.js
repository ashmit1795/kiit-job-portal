/**
 * AppResponse class for standardized API responses.
 * This class provides a consistent structure for API responses across the application. It includes properties such as success, message, data, meta, and statusCode to convey the outcome of an API request. The send method formats the response and sends it using the provided Express response object.
 * Example usage:
 * return new AppResponse({
 *   success: true,
 *   message: "Data fetched successfully",
 *   data: { userId: 123, name: "John Doe" },
 *   meta: { page: 1, limit: 10 },
 *   statusCode: 200
 * }).send(res);
 */
class AppResponse {
	constructor({ success = true, message = "Request successful", data = null, meta = null, statusCode = 200 }) {
		this.success = success;
		this.message = message;
		this.data = data;
		this.meta = meta;
		this.statusCode = statusCode;
	}

	send(res) {
		const responseBody = {
			success: this.success,
			message: this.message,
		};

		if (this.data !== null) {
			responseBody.data = this.data;
		}

		if (this.meta !== null) {
			responseBody.meta = this.meta;
		}

		return res.status(this.statusCode).json(responseBody);
	}
}

export default AppResponse;
