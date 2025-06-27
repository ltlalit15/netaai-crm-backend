import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const DepartmentTable = new Controllers("departments");

class DepartmentController {
    // Create
    static async createDepartment(req, res) {
        try {
            const { department_name } = req.body;

            if (!department_name) {
                return errorResponse(res, 400, "Department name is required.");
            }

            const data = { department_name };
            const result = await DepartmentTable.create(data);
            const inserted = await DepartmentTable.getById(result.insertId);

            return successResponse(res, 201, "Department created successfully", inserted);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All
    static async getAllDepartments(req, res) {
        try {
            const result = await DepartmentTable.getAll();
            return successResponse(res, 200, "Departments fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get by ID
    static async getDepartmentById(req, res) {
        try {
            const { id } = req.params;
            const result = await DepartmentTable.getById(id);
            if (!result) {
                return errorResponse(res, 404, "Department not found.");
            }
            return successResponse(res, 200, "Department found", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update
    static async updateDepartment(req, res) {
        try {
            const { id } = req.params;
            const { department_name } = req.body;

            if (!department_name) {
                return errorResponse(res, 400, "Department name is required.");
            }

            await DepartmentTable.update(id, { department_name });
            const updated = await DepartmentTable.getById(id);

            return successResponse(res, 200, "Department updated successfully", updated);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Delete
    static async deleteDepartment(req, res) {
        try {
            const { id } = req.params;
            await DepartmentTable.delete(id);
            return successResponse(res, 200, "Department deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default DepartmentController;
