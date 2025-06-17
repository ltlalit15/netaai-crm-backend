import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const RoleTable = new Controllers("role");

class RoleController {
    static async createRole(req, res) {
        try {
            const { role, billing_rate, budget_rate } = req.body;

            if (!role) {
                return errorResponse(res, 400, "Role name is required.");
            }

            const data = {
                role,
                billing_rate: billing_rate || 0.00,
                budget_rate: budget_rate || 0.00
            };

            const result = await RoleTable.create(data);
            const insertedData = await RoleTable.getById(result.insertId);
            return successResponse(res, 201, "Role created successfully", insertedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async getAllRoles(req, res) {
        try {
            const result = await RoleTable.getAll();
            return successResponse(res, 200, "All roles fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async getRoleById(req, res) {
        try {
            const { id } = req.params;
            const result = await RoleTable.getById(id);
            if (!result) return errorResponse(res, 404, "Role not found.");
            return successResponse(res, 200, "Role fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async updateRole(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            await RoleTable.update(id, data);
            const updatedData = await RoleTable.getById(id);
            return successResponse(res, 200, "Role updated successfully", updatedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async deleteRole(req, res) {
        try {
            const { id } = req.params;
            await RoleTable.delete(id);
            return successResponse(res, 200, "Role deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default RoleController;
