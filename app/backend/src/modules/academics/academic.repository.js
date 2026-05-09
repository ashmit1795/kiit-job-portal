import supabase from "../../config/supabase.js";
import mapSupabaseError from "../../utils/mapSupabaseError.js";

/**
 * Repository class for handling database operations related to academic programs, branches, and batches.
 * It uses Supabase as the database client and provides methods to fetch and create academic entities.
 */
class AcademicRepository {
    /**
     * Fetches all academic programs from the database.
     * It retrieves the program's ID, name, level, and duration in years, and orders the results by name. If any error occurs during the database query, it maps the error to a standardized application error and throws it.
     *
     * @returns {Array} - An array of academic programs.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
	async getPrograms() {
		const { data, error } = await supabase.schema("placement").from("programs").select("id, name, level, duration_years").order("name");

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

    /**
     * Fetches academic branches from the database, optionally filtered by a program ID.
     * It retrieves the branch's ID, name, code, and associated program details. If a `programId` is provided, it filters the branches to only include those that belong to the specified program. The results are ordered by branch name. If any error occurs during the database query, it maps the error to a standardized application error and throws it.
     * @param {uuid|null} programId - The ID of the program to filter branches by, or null to fetch all branches.
     * @returns {Array} - An array of academic branches.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
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
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
	}

    /**
     * Fetches all academic batches from the database.
     * It retrieves the batch's ID and year, and orders the results by year in descending order. If any error occurs during the database query, it maps the error to a standardized application error and throws it.
     * @return {Array} - An array of academic batches.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
	async getBatches() {
		const { data, error } = await supabase.schema("placement").from("batches").select("id, year").order("year", { ascending: false });

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}

		return data;
    }
    
    /**
     * Finds an academic branch by its ID.
     * This method retrieves a branch from the database based on its ID. It returns the branch's data if found, or null if no branch is found with the specified ID. If any database error occurs during the query, it maps the error to a standardized application error and throws it.
     * @param {uuid} branchId - The ID of the branch to find.
     * @returns {Object|null} - The branch data if found, or null if not found.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
    async findBranchById(branchId) {
        const { data, error } = await supabase.schema("placement").from("branches").select("*").eq("id", branchId).single();
        if (error) {
            const mapped = mapSupabaseError(error);
            if (mapped) throw mapped;
        }
        return data;
    }

    /**
     * Finds an academic batch by its ID.
     * This method retrieves a batch from the database based on its ID. It returns the batch's data if found, or null if no batch is found with the specified ID. If any database error occurs during the query, it maps the error to a standardized application error and throws it.
     * @param {uuid} batchId - The ID of the batch to find.
     * @returns {Object|null} - The batch data if found, or null if not found.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
    async findBatchById(batchId) {
        const { data, error } = await supabase.schema("placement").from("batches").select("*").eq("id", batchId).single();
        if (error) {
            const mapped = mapSupabaseError(error);
            if (mapped) throw mapped;
        }
        return data;
    }

    /**
     * Finds an academic program by its ID.
     * This method retrieves a program from the database based on its ID. It returns the program's data if found, or null if no program is found with the specified ID. If any database error occurs during the query, it maps the error to a standardized application error and throws it.
     * @param {uuid} programId - The ID of the program to find.
     * @returns {Object|null} - The program data if found, or null if not found.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
    async findProgramById(programId) {
        const { data, error } = await supabase.schema("placement").from("programs").select("*").eq("id", programId).single();
        if (error) {
            const mapped = mapSupabaseError(error);
            if (mapped) throw mapped;
        }
        return data;
    }

    /**
     * Creates a new academic program in the database.
     * This method inserts a new program record into the database using the provided program data. It returns the created program's data if the insertion is successful. If any database error occurs during the insertion, it maps the error to a standardized application error and throws it.
     * @param {Object} programData - The data for the new program to be created.
     * @returns {Object} - The created program's data.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
	async createProgram(programData) {
		const { data, error } = await supabase.schema("placement").from("programs").insert(programData).select().single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}
		return data;
	}

    /**
     * Creates a new academic branch in the database.
     * This method inserts a new branch record into the database using the provided branch data. It returns the created branch's data if the insertion is successful. If any database error occurs during the insertion, it maps the error to a standardized application error and throws it.
     * @param {Object} branchData - The data for the new branch to be created.
     * @returns {Object} - The created branch's data.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
	async createBranch(branchData) {
		const { data, error } = await supabase.schema("placement").from("branches").insert(branchData).select().single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}
		return data;
	}

    /**
     * Creates a new academic batch in the database.
     * This method inserts a new batch record into the database using the provided batch data. It returns the created batch's data if the insertion is successful. If any database error occurs during the insertion, it maps the error to a standardized application error and throws it.
     * @param {Object} batchData - The data for the new batch to be created.
     * @returns {Object} - The created batch's data.
     * @throws {AppError} - Throws an AppError if a database error occurs that can be mapped to a known error type.
     */
	async createBatch(batchData) {
		const { data, error } = await supabase.schema("placement").from("batches").insert(batchData).select().single();

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
		}
        return data;
        }

        /**
         * Deletes an academic program by ID.
         * @param {uuid} programId - The ID of the program to delete.
         */
        async deleteProgram(programId) {
		const { error } = await supabase.schema("placement").from("programs").delete().eq("id", programId);

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
        }
    }

    /**
     * Deletes an academic branch by ID.
     * @param {uuid} branchId - The ID of the branch to delete.
     */
    async deleteBranch(branchId) {
		const { error } = await supabase.schema("placement").from("branches").delete().eq("id", branchId);

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
        }
    }

    /**
     * Deletes an academic batch by ID.
     * @param {uuid} batchId - The ID of the batch to delete.
     */
    async deleteBatch(batchId) {
		const { error } = await supabase.schema("placement").from("batches").delete().eq("id", batchId);

		if (error) {
			const mapped = mapSupabaseError(error);
			if (mapped) throw mapped;
        }
    }
}

export default new AcademicRepository();
