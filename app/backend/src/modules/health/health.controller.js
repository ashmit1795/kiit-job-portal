import AppResponse from "../../utils/AppResponse.js";
import healthService from "./health.service.js";

class HealthController {
	constructor() {}

	async check (req, res, next) {
		try {
			const data = await healthService.getStatus();
			return new AppResponse({
				message: "Health check successful",
				data,
				statusCode: 200,
				success: true,
			}).send(res);
		} catch (error) {
			next(error);
		}
	};
}

const healthController = new HealthController();

export default healthController;
