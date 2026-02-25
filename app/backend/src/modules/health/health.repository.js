class HealthRepository {
	constructor() {}

	async checkConnection() {
		return true;
	}
}

const healthRepository = new HealthRepository();

export default healthRepository;
