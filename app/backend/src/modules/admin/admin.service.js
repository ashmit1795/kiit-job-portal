import AppError from "../../utils/AppError.js";
import adminRepository from "./admin.repository.js";

class AdminService {
	/**
	 * Derive an action label for role changes.
	 * @param {string} fromRole - Current role.
	 * @param {string} toRole - Target role.
	 * @return {string} - Action label.
	 */
	getRoleChangeAction(fromRole, toRole) {
		const roleRank = {
			student: 1,
			volunteer: 2,
			admin: 3,
		};

		if (fromRole === toRole) return "change_user_role";
		return roleRank[toRole] > roleRank[fromRole] ? "promote_user" : "demote_user";
	}

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

		const targetUser = await adminRepository.getUserById(userId);
		if (!targetUser) {
			throw new AppError("User not found", 404);
		}

		const updated = await adminRepository.updateUserRole(userId, role);

		if (targetUser.role !== role) {
			await adminRepository.insertLog({
				admin_id: user.id,
				action: this.getRoleChangeAction(targetUser.role, role),
				target_type: "user",
				target_id: userId,
				details: {
					from_role: targetUser.role,
					to_role: role,
					user_email: targetUser.email,
				},
			});
		}

		return updated;
	}

	async deleteUser(user, userId) {
		if (user.role !== "admin") {
			throw new AppError("Admin access required", 403);
		}

		const targetUser = await adminRepository.getUserById(userId);
		if (!targetUser) {
			throw new AppError("User not found", 404);
		}

		await adminRepository.deactivateUser(userId);

		await adminRepository.insertLog({
			admin_id: user.id,
			action: "delete_user",
			target_type: "user",
			target_id: userId,
			details: {
				user_email: targetUser.email,
				user_role: targetUser.role,
			},
		});
	}

	async listAllJobs(user, query) {
		if (user.role !== "admin" && user.role !== "volunteer") {
			throw new AppError("Admin access required", 403);
		}

		return adminRepository.listAllJobs(query);
	}

	async getUserJobs(user, userId) {
		if (user.role !== "admin") {
			throw new AppError("Admin access required", 403);
		}

		const targetUser = await adminRepository.getUserById(userId);
		if (!targetUser) {
			throw new AppError("User not found", 404);
		}

		const jobs = await adminRepository.getUserJobs(userId);
		const stats = jobs.reduce(
			(acc, job) => {
				acc.total += 1;
				if (job.approval_status === "approved") acc.approved += 1;
				if (job.approval_status === "pending") acc.pending += 1;
				if (job.approval_status === "rejected") acc.rejected += 1;
				return acc;
			},
			{ total: 0, approved: 0, pending: 0, rejected: 0 },
		);

		return {
			user: {
				id: targetUser.id,
				email: targetUser.email,
				full_name: targetUser.full_name,
				role: targetUser.role,
			},
			jobs,
			stats,
		};
	}

	async getLogs(user, query) {
		if (user.role !== "admin") {
			throw new AppError("Admin access required", 403);
		}

		return adminRepository.getLogs(query);
	}

	async jobStats(user) {
		if (user.role !== "admin") {
			throw new AppError("Admin access required", 403);
		}

		return adminRepository.jobStats();
	}
}

export default new AdminService();
