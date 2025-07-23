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
                miscellanea_budget,
                notes
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
                miscellanea_budget,
                notes
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



    static async getBudgetSummaryByProposalId(req, res) {
        try {
            const { proposal_id } = req.params;

            if (!proposal_id || typeof proposal_id !== 'string' || proposal_id.trim() === '') {
                return res.status(400).json({ error: "Proposal ID is required and must be a non-empty string" });
            }

            const jobPlanningRecords = await JobTable.getJobPlanningProposal(proposal_id);

            if (!jobPlanningRecords || jobPlanningRecords.length === 0) {
                return res.status(404).json({ error: "No job planning data found for this proposal ID" });
            }

            const total_budget = jobPlanningRecords.reduce((sum, record) => {
                return sum + parseFloat(record.total_budget || 0);
            }, 0).toFixed(2);

            return res.status(200).json({
                status: true,
                message: "Budget summary fetched successfully",
                job_count: jobPlanningRecords.length,
                records: jobPlanningRecords,
                proposal_id,
                total_budget
            });

        } catch (error) {
            console.error('Error in getBudgetSummaryByProposalId:', error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default JobController;
