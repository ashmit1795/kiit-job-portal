import healthService from "./health.service.js";

class HealthController {
	constructor() {}

	async check (req, res, next) {
		try {
			const data = await healthService.getStatus();
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	};
}

const healthController = new HealthController();

export default healthController;
