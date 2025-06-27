import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const CatalogTable = new Controllers("catalog_items");

class CatalogController {

    // Create
    static async createItem(req, res) {
        try {
            const {
                name,
                type,
                description,
                default_scope_of_work,
                tags,
                price,
                is_subitem
            } = req.body;

            if (!name || !type) {
                return errorResponse(res, 400, "Name and type are required.");
            }

            const data = {
                name,
                type,
                description,
                default_scope_of_work,
                tags,
                price,
                is_subitem
            };

            const result = await CatalogTable.create(data);
            const insertedData = await CatalogTable.getById(result.insertId);

            return successResponse(res, 201, "Catalog item created successfully", insertedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All
    static async getAllItems(req, res) {
        try {
            const result = await CatalogTable.getAll();
            return successResponse(res, 200, "All catalog items fetched", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get by ID
    static async getItemById(req, res) {
        try {
            const { id } = req.params;
            const result = await CatalogTable.getById(id);
            if (!result) {
                return errorResponse(res, 404, "Catalog item not found.");
            }
            return successResponse(res, 200, "Catalog item fetched", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update
    static async updateItem(req, res) {
        try {
            const { id } = req.params;
            const {
                name,
                type,
                description,
                default_scope_of_work,
                tags,
                price,
                is_subitem
            } = req.body;

            const data = {
                name,
                type,
                description,
                default_scope_of_work,
                tags,
                price,
                is_subitem
            };

            await CatalogTable.update(id, data);
            const updatedData = await CatalogTable.getById(id);

            return successResponse(res, 200, "Catalog item updated", updatedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }


    // Delete
    static async deleteItem(req, res) {
        try {
            const { id } = req.params;
            await CatalogTable.delete(id);
            return successResponse(res, 200, "Catalog item deleted");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}


export default CatalogController;
