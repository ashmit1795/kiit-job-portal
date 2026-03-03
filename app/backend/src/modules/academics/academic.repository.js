import supabase from "../../config/supabase.js";
import logger from "../../utils/logger.js";

class AcademicRepository {
	async getPrograms() {
		const { data, error } = await supabase.schema("placement").from("programs").select("id, name, level, duration_years").order("name");

		if (error) {
			logger.error("Error fetching programs", { message: error.message });
			throw error;
		}

		return data;
	}

	async getBranches(programId = null) {
		let query = supabase
			.schema("placement")
			.from("branches")
			.select(
				`
                    id,
                    name,
                    code,
                    program:programs (
                        id,
                        name,
                        level
                    )
                `,
			)
			.order("name");

		if (programId) {
			query = query.eq("program_id", programId);
		}

		const { data, error } = await query;

		if (error) {
			logger.error("Error fetching branches", { message: error.message });
			throw error;
		}

		return data;
	}

	async getBatches() {
		const { data, error } = await supabase.schema("placement").from("batches").select("id, year").order("year", { ascending: false });

		if (error) {
			logger.error("Error fetching batches", { message: error.message });
			throw error;
		}

		return data;
	}

	async createProgram(programData) {
		const { data, error } = await supabase.schema("placement").from("programs").insert(programData).select().single();

		if (error) throw error;
		return data;
	}

	async createBranch(branchData) {
		const { data, error } = await supabase.schema("placement").from("branches").insert(branchData).select().single();

		if (error) throw error;
		return data;
	}

	async createBatch(batchData) {
		const { data, error } = await supabase.schema("placement").from("batches").insert(batchData).select().single();

		if (error) throw error;
		return data;
	}
}

export default new AcademicRepository();
