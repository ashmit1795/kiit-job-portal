import AppError from "../../utils/AppError.js";
import academicRepository from "./academic.repository.js";

class AcademicService {
	async fetchPrograms() {
		return academicRepository.getPrograms();
	}

	async fetchBranches(programId) {
		return academicRepository.getBranches(programId);
	}

	async fetchBatches() {
		return academicRepository.getBatches();
	}

	async createProgram(payload) {
		return academicRepository.createProgram(payload);
	}

    async createBranch(payload) {
        const program = await academicRepository.findProgramById(payload.program_id);
		if (!program) throw new AppError("Program not found", 404);
		return academicRepository.createBranch(payload);
	}

	async createBatch(payload) {
		return academicRepository.createBatch(payload);
	}
}

export default new AcademicService();
