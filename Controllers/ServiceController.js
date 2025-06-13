import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const ServiceTable = new Controllers("services");

class ServiceController {
    // Create
    static async createService(req, res) {
        try {
            const {
                name,
                description,
                default_scope_of_work,
                tags,
                price,
                is_subitem,
                is_template
            } = req.body;

            if (!name || !price || is_subitem === undefined || is_template === undefined) {
                return errorResponse(res, 400, "Required fields missing: name, price, is_subitem, is_template.");
            }

            const data = {
                name,
                description,
                default_scope_of_work,
                tags: JSON.stringify(tags), 
                price,
                is_subitem,
                is_template
            };

            const result = await ServiceTable.create(data);
            const inserted = await ServiceTable.getById(result.insertId);

            return successResponse(res, 201, "Service created successfully", inserted);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All
    static async getAllServices(req, res) {
        try {
            const result = await ServiceTable.getAll();
            return successResponse(res, 200, "Services fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get by ID
    static async getServiceById(req, res) {
        try {
            const { id } = req.params;
            const result = await ServiceTable.getById(id);
            if (!result) return errorResponse(res, 404, "Service not found.");
            return successResponse(res, 200, "Service retrieved", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update
    static async updateService(req, res) {
        try {
            const { id } = req.params;
            const {
                name,
                description,
                default_scope_of_work,
                tags,
                price,
                is_subitem,
                is_template
            } = req.body;

            const data = {
                name,
                description,
                default_scope_of_work,
                tags: JSON.stringify(tags), 
                price,
                is_subitem,
                is_template
            };

            await ServiceTable.update(id, data);
            const updated = await ServiceTable.getById(id);

            return successResponse(res, 200, "Service updated successfully", updated);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Delete
    static async deleteService(req, res) {
        try {
            const { id } = req.params;
            await ServiceTable.delete(id);
            return successResponse(res, 200, "Service deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default ServiceController;
