import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const TaxTable = new Controllers("taxes");

class TaxController {
   static async createTax(req, res) {
    try {
        const { name, rate, job_costing } = req.body;

        // if (!name || rate === undefined) {
        //     return errorResponse(res, 400, "Name and rate are required.");
        // }

        const data = {
            name,
            rate: parseFloat(rate),
            job_costing: job_costing ? 1 : 0
        };

        console.log("Inserting tax data:", data);  // For debugging

        const result = await TaxTable.create(data);
        const insertedData = await TaxTable.getById(result.insertId);

        return successResponse(res, 201, "Tax created successfully", insertedData);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}


    static async getAllTaxes(req, res) {
        try {
            const data = await TaxTable.getAll();
            return successResponse(res, 200, "Tax list retrieved successfully", data);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async getTaxById(req, res) {
        try {
            const { id } = req.params;
            const data = await TaxTable.getById(id);
            if (!data) return errorResponse(res, 404, "Tax not found");
            return successResponse(res, 200, "Tax retrieved successfully", data);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

  static async updateTax(req, res) {
    try {
        const { id } = req.params;
        const { name, rate, job_costing } = req.body;

        // if (!name || rate === undefined) {
        //     return errorResponse(res, 400, "Name and rate are required.");
        // }

        const existing = await TaxTable.getById(id);
        if (!existing) {
            return errorResponse(res, 404, "Tax not found.");
        }

        const data = {
            name,
            rate: parseFloat(rate),
            job_costing: job_costing ? 1 : 0
        };

        console.log("Updating tax ID", id, "with data:", data);  // For debugging

        await TaxTable.update(id, data);
        const updatedData = await TaxTable.getById(id);

        return successResponse(res, 200, "Tax updated successfully", updatedData);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}


    static async deleteTax(req, res) {
        try {
            const { id } = req.params;
            await TaxTable.delete(id);
            return successResponse(res, 200, "Tax deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default TaxController;
