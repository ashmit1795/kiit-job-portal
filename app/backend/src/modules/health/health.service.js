import healthRepository from "./health.repository.js";

class HealthService {
	constructor() {}

	async getStatus() {
		const dbStatus = await healthRepository.checkConnection();
		
		return {
			status: "API running",
			database: dbStatus ? "connected" : "disconnected",
			timestamp: new Date(),
		};
	}
}

const healthService = new HealthService();

export default healthService;
