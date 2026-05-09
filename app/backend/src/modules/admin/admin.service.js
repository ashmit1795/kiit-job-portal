import AppError from "../../utils/AppError.js";
import adminRepository from "./admin.repository.js";

class AdminService {
	async dashboard(user) {
		if (user.role !== "admin") {
			throw new AppError("Admin access required", 403);
		}

		const stats = await adminRepository.getDashboardStats();

		return stats;
	}

	async listUsers(user, query) {
		if (user.role !== "admin") {
			throw new AppError("Admin access required", 403);
		}

		return adminRepository.listUsers(query);
	}

	async getUserById(user, userId) {
		if (user.role !== "admin") {
			throw new AppError("Admin access required", 403);
		}

		const targetUser = await adminRepository.getUserById(userId);

		if (!targetUser) {
			throw new AppError("User not found", 404);
		}

		return targetUser;
	}

	async updateUserRole(user, userId, role) {
		if (user.role !== "admin") {
			throw new AppError("Admin access required", 403);
		}

		if (!["student", "volunteer", "admin"].includes(role)) {
			throw new AppError("Invalid role", 400);
		}

		return adminRepository.updateUserRole(userId, role);
	}

	async deleteUser(user, userId) {
		if (user.role !== "admin") {
			throw new AppError("Admin access required", 403);
		}

		return adminRepository.deactivateUser(userId);
	}

	async jobStats(user) {
		if (user.role !== "admin") {
			throw new AppError("Admin access required", 403);
		}

		return adminRepository.jobStats();
	}
}

export default new AdminService();
