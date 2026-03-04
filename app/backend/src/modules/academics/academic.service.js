import AppError from "../../utils/AppError.js";
import academicRepository from "./academic.repository.js";

/**
 * Service class for handling academic-related operations.
 * This class provides methods to fetch academic programs, branches, and batches, as well as to create new programs, branches, and batches. It interacts with the academic repository to perform database operations and handles any errors that may occur during these operations by throwing standardized application errors.
 */
class AcademicService {
    /**
     * Fetches all academic programs.
     * This method calls the academic repository to retrieve a list of all academic programs. If any error occurs during the database query, it maps the error to a standardized application error and throws it.
     * @return {Array} - An array of academic programs.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
	async fetchPrograms() {
		return academicRepository.getPrograms();
	}

    /**
     * Fetches academic branches, optionally filtered by a program ID.
     * This method calls the academic repository to retrieve a list of academic branches. If a `programId` is provided, it filters the branches to only include those that belong to the specified program. If any error occurs during the database query, it maps the error to a standardized application error and throws it.
     * @param {uuid|null} programId - The ID of the program to filter branches by, or null to fetch all branches.
     * @return {Array} - An array of academic branches.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
	async fetchBranches(programId) {
		return academicRepository.getBranches(programId);
	}

    /**
     * Fetches all academic batches.
     * This method calls the academic repository to retrieve a list of all academic batches. If any error occurs during the database query, it maps the error to a standardized application error and throws it.
     * @return {Array} - An array of academic batches.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
	async fetchBatches() {
		return academicRepository.getBatches();
	}

    /**
     * Creates a new academic program.
     * This method calls the academic repository to create a new academic program using the provided program data. If any error occurs during the database insertion, it maps the error to a standardized application error and throws it.
     * @param {Object} payload - The data for the new program to be created.
     * @return {Object} - The created program's data.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
	async createProgram(payload) {
		return academicRepository.createProgram(payload);
	}

    /**
     * Creates a new academic branch.
     * This method calls the academic repository to create a new academic branch using the provided branch data. It first checks if the associated program exists. If not, it throws an AppError. If any error occurs during the database insertion, it maps the error to a standardized application error and throws it.
     * @param {Object} payload - The data for the new branch to be created.
     * @return {Object} - The created branch's data.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
    async createBranch(payload) {
        const program = await academicRepository.findProgramById(payload.program_id);
		if (!program) throw new AppError("Program not found", 404);
		return academicRepository.createBranch(payload);
	}

    /**
     * Creates a new academic batch.
     * This method calls the academic repository to create a new academic batch using the provided batch data. If any error occurs during the database insertion, it maps the error to a standardized application error and throws it.
     * @param {Object} payload - The data for the new batch to be created.
     * @return {Object} - The created batch's data.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
	async createBatch(payload) {
		return academicRepository.createBatch(payload);
	}
}

export default new AcademicService();
