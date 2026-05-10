import AppError from "../../utils/AppError.js";
import academicRepository from "./academic.repository.js";
import adminRepository from "../admin/admin.repository.js";

/**
 * Service class for handling academic-related operations.
 * This class provides methods to fetch academic programs, branches, and batches, as well as to create new programs, branches, and batches. It interacts with the academic repository to perform database operations and handles any errors that may occur during these operations by throwing standardized application errors.
 */
class AcademicService {
    /**
     * Ensures the requester is an admin.
     * @param {Object} user - Authenticated user.
     */
    ensureAdmin(user) {
        if (!user || user.role !== "admin") {
            throw new AppError("Admin access required", 403);
        }
    }
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
    async createProgram(user, payload) {
        this.ensureAdmin(user);
        const program = await academicRepository.createProgram(payload);

        await adminRepository.insertLog({
            admin_id: user.id,
            action: "create_program",
            target_type: "program",
            target_id: program.id,
            details: {
                name: program.name,
                level: program.level,
                duration_years: program.duration_years,
            },
        });

        return program;
	}

    /**
     * Creates a new academic branch.
     * This method calls the academic repository to create a new academic branch using the provided branch data. It first checks if the associated program exists. If not, it throws an AppError. If any error occurs during the database insertion, it maps the error to a standardized application error and throws it.
     * @param {Object} payload - The data for the new branch to be created.
     * @return {Object} - The created branch's data.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
    async createBranch(user, payload) {
        this.ensureAdmin(user);
        const program = await academicRepository.findProgramById(payload.program_id);
		if (!program) throw new AppError("Program not found", 404);
        const branch = await academicRepository.createBranch(payload);

        await adminRepository.insertLog({
            admin_id: user.id,
            action: "create_branch",
            target_type: "branch",
            target_id: branch.id,
            details: {
                name: branch.name,
                code: branch.code,
                program_id: branch.program_id,
            },
        });

        return branch;
	}

    /**
     * Creates a new academic batch.
     * This method calls the academic repository to create a new academic batch using the provided batch data. If any error occurs during the database insertion, it maps the error to a standardized application error and throws it.
     * @param {Object} payload - The data for the new batch to be created.
     * @return {Object} - The created batch's data.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
    async createBatch(user, payload) {
        this.ensureAdmin(user);
        const batch = await academicRepository.createBatch(payload);

        await adminRepository.insertLog({
            admin_id: user.id,
            action: "create_batch",
            target_type: "batch",
            target_id: batch.id,
            details: {
                year: batch.year,
            },
        });

        return batch;
	}

    /**
     * Deletes an academic program by ID.
     * @param {Object} user - Authenticated user.
     * @param {uuid} programId - Program ID.
     */
    async deleteProgram(user, programId) {
        this.ensureAdmin(user);
        const program = await academicRepository.findProgramById(programId);
        if (!program) throw new AppError("Program not found", 404);

        await academicRepository.deleteProgram(programId);

        await adminRepository.insertLog({
            admin_id: user.id,
            action: "delete_program",
            target_type: "program",
            target_id: program.id,
            details: {
                name: program.name,
                level: program.level,
            },
        });
    }

    /**
     * Deletes an academic branch by ID.
     * @param {Object} user - Authenticated user.
     * @param {uuid} branchId - Branch ID.
     */
    async deleteBranch(user, branchId) {
        this.ensureAdmin(user);
        const branch = await academicRepository.findBranchById(branchId);
        if (!branch) throw new AppError("Branch not found", 404);

        await academicRepository.deleteBranch(branchId);

        await adminRepository.insertLog({
            admin_id: user.id,
            action: "delete_branch",
            target_type: "branch",
            target_id: branch.id,
            details: {
                name: branch.name,
                code: branch.code,
                program_id: branch.program_id,
            },
        });
    }

    /**
     * Deletes an academic batch by ID.
     * @param {Object} user - Authenticated user.
     * @param {uuid} batchId - Batch ID.
     */
    async deleteBatch(user, batchId) {
        this.ensureAdmin(user);
        const batch = await academicRepository.findBatchById(batchId);
        if (!batch) throw new AppError("Batch not found", 404);

        await academicRepository.deleteBatch(batchId);

        await adminRepository.insertLog({
            admin_id: user.id,
            action: "delete_batch",
            target_type: "batch",
            target_id: batch.id,
            details: {
                year: batch.year,
            },
        });
    }
}

export default new AcademicService();
