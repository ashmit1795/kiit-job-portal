import AppResponse from "../../utils/AppResponse.js";
import adminService from "./admin.service.js";

class AdminController {
	async dashboard(req, res, next) {
		try {
			const stats = await adminService.dashboard(req.user);

			return new AppResponse({
				message: "Dashboard data fetched successfully",
				data: stats,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async listUsers(req, res, next) {
		try {
			const users = await adminService.listUsers(req.user, req.query);

			return new AppResponse({
				message: "Users fetched successfully",
				data: users,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async getUser(req, res, next) {
		try {
			const user = await adminService.getUserById(req.user, req.params.id);

			return new AppResponse({
				message: "User details fetched successfully",
				data: user,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async updateUserRole(req, res, next) {
		try {
			const updated = await adminService.updateUserRole(req.user, req.params.id, req.body.role);

			return new AppResponse({
				message: "User role updated successfully",
				data: updated,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async deleteUser(req, res, next) {
		try {
			await adminService.deleteUser(req.user, req.params.id);

			return new AppResponse({
				message: "User removed successfully",
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async jobStats(req, res, next) {
		try {
			const stats = await adminService.jobStats(req.user);

			return new AppResponse({
				message: "Job stats fetched successfully",
				data: stats,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}
}

export default new AdminController();
