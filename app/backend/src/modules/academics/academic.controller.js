import AppResponse from "../../utils/AppResponse.js";
import academicService from "./academic.service.js";
import { createProgramSchema, createBranchSchema, createBatchSchema } from "../../validators/academic.validator.js";

class AcademicController {
	async getPrograms(req, res, next) {
		try {
			const programs = await academicService.fetchPrograms();

			return new AppResponse({
				message: "Programs fetched successfully",
				data: programs,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async getBranches(req, res, next) {
		try {
			const { program_id } = req.query;

			const branches = await academicService.fetchBranches(program_id);

			return new AppResponse({
				message: "Branches fetched successfully",
				data: branches,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async getBatches(req, res, next) {
		try {
			const batches = await academicService.fetchBatches();

			return new AppResponse({
				message: "Batches fetched successfully",
				data: batches,
			}).send(res);
		} catch (err) {
			next(err);
		}
	}

	async createProgram  (req, res, next) {
		try {
			const program = await academicService.createProgram(req.body);

			return new AppResponse({
				message: "Program created successfully",
				data: program,
			}).send(res);
		} catch (err) {
			next(err);
		}
	};

	async createBranch (req, res, next) {
		try {
			const branch = await academicService.createBranch(req.body);

			return new AppResponse({
				message: "Branch created successfully",
				data: branch,
			}).send(res);
		} catch (err) {
			next(err);
		}
	};

	async createBatch (req, res, next) {
		try {
			const batch = await academicService.createBatch(req.body);

			return new AppResponse({
				message: "Batch created successfully",
				data: batch,
			}).send(res);
		} catch (err) {
			next(err);
		}
	};
}

export default new AcademicController();
