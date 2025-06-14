// Controllers/BillController.js
import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const BillTable = new Controllers("bills");

class BillController {
    static async createBill(req, res) {
        try {
            const {
                purchase_id, vendor_name, bill_number, bill_date, amount,
                gst_amount, total_amount, due_date, bill_file, notes, status
            } = req.body;

            if (!vendor_name || !bill_number || !bill_date || !total_amount) {
                return errorResponse(res, 400, "Required fields missing.");
            }

            const data = {
                purchase_id, vendor_name, bill_number, bill_date, amount,
                gst_amount, total_amount, due_date, bill_file, notes, status
            };

            const result = await BillTable.create(data);
            const insertedData = await BillTable.getById(result.insertId);
            return successResponse(res, 201, "Bill created successfully", insertedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async getAllBills(req, res) {
        try {
            const result = await BillTable.getAll();
            return successResponse(res, 200, "All bills fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async getBillById(req, res) {
        try {
            const { id } = req.params;
            const result = await BillTable.getById(id);
            if (!result) return errorResponse(res, 404, "Bill not found.");
            return successResponse(res, 200, "Bill fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async updateBill(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            await BillTable.update(id, data);
            const updatedData = await BillTable.getById(id);
            return successResponse(res, 200, "Bill updated successfully", updatedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async deleteBill(req, res) {
        try {
            const { id } = req.params;
            await BillTable.delete(id);
            return successResponse(res, 200, "Bill deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default BillController;
