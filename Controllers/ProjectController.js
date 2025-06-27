import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const ProjectTable = new Controllers("projects");

class ProjectController {
    // Create
    static async createProject(req, res) {
        try {
            const {
                project_title,
                created_date,
                client_contact,
                status,
                age,
                confidence_percent,
                estimated_revenue_min
            } = req.body;

            if (!project_title || !created_date || !status || !age || !confidence_percent || !estimated_revenue_min) {
                return errorResponse(res, 400, "Required fields are missing.");
            }

            const data = {
                project_title,
                created_date,
                client_contact,
                status,
                age,
                confidence_percent,
                estimated_revenue_min
            };

            const result = await ProjectTable.create(data);
            const inserted = await ProjectTable.getById(result.insertId);

            return successResponse(res, 201, "Project created successfully", inserted);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All
    static async getAllProjects(req, res) {
        try {
            const projects = await ProjectTable.getAll();
            return successResponse(res, 200, "Projects fetched successfully", projects);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get By ID
    static async getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = await ProjectTable.getById(id);
            if (!project) return errorResponse(res, 404, "Project not found");
            return successResponse(res, 200, "Project found", project);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update
    static async updateProject(req, res) {
        try {
            const { id } = req.params;
            const {
                project_title,
                created_date,
                client_contact,
                status,
                age,
                confidence_percent,
                estimated_revenue_min
            } = req.body;

            const data = {
                project_title,
                created_date,
                client_contact,
                status,
                age,
                confidence_percent,
                estimated_revenue_min
            };

            await ProjectTable.update(id, data);
            const updated = await ProjectTable.getById(id);
            return successResponse(res, 200, "Project updated successfully", updated);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Delete
    static async deleteProject(req, res) {
        try {
            const { id } = req.params;
            await ProjectTable.delete(id);
            return successResponse(res, 200, "Project deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default ProjectController;
