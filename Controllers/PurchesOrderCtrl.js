import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const PurchaseOrderTable = new Controllers("purchase_order");

class PurchaseOrderController {
    
    // Create Purchase Order
    static async createPurchaseOrder(req, res) {
        try {
            const { purchase_type, item, notes, person_to_be_reimbursed } = req.body;

            if (!purchase_type || !item || !person_to_be_reimbursed) {
                return errorResponse(res, 400, "purchase_type, item, and person_to_be_reimbursed are required.");
            }

            const data = {
                purchase_type,
                item,
                notes,
                person_to_be_reimbursed
            };

            const result = await PurchaseOrderTable.create(data);
            const insertedData = await PurchaseOrderTable.getById(result.insertId);

            return successResponse(res, 201, "Purchase order created successfully", insertedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All Purchase Orders
    static async getAllPurchaseOrders(req, res) {
        try {
            const result = await PurchaseOrderTable.getAll();
            return successResponse(res, 200, "All purchase orders fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get One Purchase Order by ID
    static async getPurchaseOrderById(req, res) {
        try {
            const { id } = req.params;
            const result = await PurchaseOrderTable.getById(id);
            if (!result) {
                return errorResponse(res, 404, "Purchase order not found.");
            }
            return successResponse(res, 200, "Purchase order fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update Purchase Order
    static async updatePurchaseOrder(req, res) {
        try {
            const { id } = req.params;
            const { purchase_type, item, notes, person_to_be_reimbursed } = req.body;

            const data = {
                purchase_type,
                item,
                notes,
                person_to_be_reimbursed
            };

            await PurchaseOrderTable.update(id, data);
            const updatedData = await PurchaseOrderTable.getById(id);

            return successResponse(res, 200, "Purchase order updated successfully", updatedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Delete Purchase Order
    static async deletePurchaseOrder(req, res) {
        try {
            const { id } = req.params;
            await PurchaseOrderTable.delete(id);
            return successResponse(res, 200, "Purchase order deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default PurchaseOrderController;
