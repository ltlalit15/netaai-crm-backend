import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const JobTable = new Controllers("contract_jobs");

class ContractJobController {
    // Create
    static async createJob(req, res) {
        try {
            const {
                job_name,
                client_name,
                job_type,
                tags,
                bid_due_date,
                scheduling_color,
                sales_lead,
                project_manager,
                job_address,
                address_optional
            } = req.body;

            if (!client_name) {
                return errorResponse(res, 400, "Client name is required.");
            }

            const data = {
                job_name,
                client_name,
                job_type,
                tags: JSON.stringify(tags),
                bid_due_date,
                scheduling_color,
                sales_lead,
                project_manager,
                job_address,
                address_optional
            };

            const result = await JobTable.create(data);
            const inserted = await JobTable.getById(result.insertId);

            return successResponse(res, 201, "Contract job created successfully", inserted);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All
    static async getAllJobs(req, res) {
        try {
            const result = await JobTable.getAll();
            return successResponse(res, 200, "All contract jobs fetched", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get by ID
    static async getJobById(req, res) {
        try {
            const { id } = req.params;
            const result = await JobTable.getById(id);
            if (!result) return errorResponse(res, 404, "Job not found.");
            return successResponse(res, 200, "Job retrieved", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update
    static async updateJob(req, res) {
        try {
            const { id } = req.params;
            const {
                job_name,
                client_name,
                job_type,
                tags,
                bid_due_date,
                scheduling_color,
                sales_lead,
                project_manager,
                job_address,
                address_optional
            } = req.body;

            const data = {
                job_name,
                client_name,
                job_type,
                tags: JSON.stringify(tags),
                bid_due_date,
                scheduling_color,
                sales_lead,
                project_manager,
                job_address,
                address_optional
            };

            await JobTable.update(id, data);
            const updated = await JobTable.getById(id);
            return successResponse(res, 200, "Contract job updated", updated);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Delete
    static async deleteJob(req, res) {
        try {
            const { id } = req.params;
            await JobTable.delete(id);
            return successResponse(res, 200, "Contract job deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default ContractJobController;
