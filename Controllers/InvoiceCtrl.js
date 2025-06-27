import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const InvoiceTable = new Controllers("invoices");

class InvoiceController {
    static async createInvoice(req, res) {
        try {
            const {
                client_id, job_id, invoice_number, invoice_date, description,
                subtotal, gst, total_amount, due_date, invoice_file,
                notes, status
            } = req.body;

            if (!client_id || !invoice_number || !invoice_date || !total_amount) {
                return errorResponse(res, 400, "Required fields missing.");
            }

            const data = {
                client_id, job_id, invoice_number, invoice_date, description,
                subtotal, gst, total_amount, due_date, invoice_file,
                notes, status
            };

            const result = await InvoiceTable.create(data);
            const insertedData = await InvoiceTable.getById(result.insertId);
            return successResponse(res, 201, "Invoice created successfully", insertedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async getAllInvoices(req, res) {
        try {
            const result = await InvoiceTable.getAll();
            return successResponse(res, 200, "All invoices fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async getInvoiceById(req, res) {
        try {
            const { id } = req.params;
            const result = await InvoiceTable.getById(id);
            if (!result) return errorResponse(res, 404, "Invoice not found.");
            return successResponse(res, 200, "Invoice fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async updateInvoice(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            await InvoiceTable.update(id, data);
            const updatedData = await InvoiceTable.getById(id);
            return successResponse(res, 200, "Invoice updated successfully", updatedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }


    static async deleteInvoice(req, res) {
        try {
            const { id } = req.params;
            await InvoiceTable.delete(id);
            return successResponse(res, 200, "Invoice deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}



export default InvoiceController;
