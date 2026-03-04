import AppResponse from "../../utils/AppResponse.js";
import academicService from "./academic.service.js";

/**
 * Controller for handling academic-related routes.
 */
class AcademicController {

    /**
     * Handles the `GET /academics/programs` route to fetch all academic programs.
     * It calls the academicService to retrieve the list of programs and returns a standardized response. If any error occurs, it passes the error to the next middleware.
     */
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

    /**
     * Handles the `GET /academics/branches` route to fetch branches based on a program ID.
     * It retrieves the `program_id` from the query parameters, calls the academicService to fetch the corresponding branches, and returns a standardized response. If any error occurs, it passes the error to the next middleware.
     */
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

    /**
     * Handles the `GET /academics/batches` route to fetch all academic batches.
     * It calls the academicService to retrieve the list of batches and returns a standardized response. If any error occurs, it passes the error to the next middleware.
     */
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

    /**
     * Handles the `POST /academics/programs` route to create a new academic program.
     * It calls the academicService to create the program and returns a standardized response. If any error occurs, it passes the error to the next middleware.
     */
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

    /**
     * Handles the `POST /academics/branches` route to create a new academic branch.
     * It calls the academicService to create the branch and returns a standardized response. If any error occurs, it passes the error to the next middleware.
     */
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

    /**
     * Handles the `POST /academics/batches` route to create a new academic batch.
     * It calls the academicService to create the batch and returns a standardized response. If any error occurs, it passes the error to the next middleware.
     */
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
