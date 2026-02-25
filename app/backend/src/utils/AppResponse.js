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
