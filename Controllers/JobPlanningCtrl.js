import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const JobTable = new Controllers("job_planning");

class JobController {
    // Create Job
    static async createJob(req, res) {
        try {
            const {
                proposal_id,
                estimated_start,
                estimated_completion,
                total_budget,
                phase_name,
                materials_budget,
                labor_budget,
                subcontractors_budget,
                equipment_budget,
                miscellanea_budget
            } = req.body;

           

            const data = {
                proposal_id,
                estimated_start,
                estimated_completion,
                total_budget,
                phase_name,
                materials_budget,
                labor_budget,
                subcontractors_budget,
                equipment_budget,
                miscellanea_budget
            };

            const result = await JobTable.create(data);
            const inserted = await JobTable.getById(result.insertId);

            return successResponse(res, 201, "Job created successfully", inserted);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All Jobs
    static async getAllJobs(req, res) {
        try {
            const jobs = await JobTable.getAll();
            return successResponse(res, 200, "All jobs fetched", jobs);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get Job by ID
    static async getJobById(req, res) {
        try {
            const { id } = req.params;
            const job = await JobTable.getById(id);

            if (!job) {
                return errorResponse(res, 404, "Job not found");
            }

            return successResponse(res, 200, "Job fetched", job);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update Job
    static async updateJob(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            const existing = await JobTable.getById(id);
            if (!existing) {
                return errorResponse(res, 404, "Job not found");
            }

            await JobTable.update(id, data);
            const updated = await JobTable.getById(id);

            return successResponse(res, 200, "Job updated successfully", updated);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Delete Job
    static async deleteJob(req, res) {
        try {
            const { id } = req.params;

            const existing = await JobTable.getById(id);
            if (!existing) {
                return errorResponse(res, 404, "Job not found");
            }

            await JobTable.delete(id);
            return successResponse(res, 200, "Job deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default JobController;
