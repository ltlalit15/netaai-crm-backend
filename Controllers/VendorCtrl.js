// Controllers/VendorController.js
import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const VendorTable = new Controllers("vendors");

class VendorController {

    // Create Vendor
    static async createVendor(req, res) {
        try {
            const {
                vendor_name,
                contact_name,
                address_lookup,
                phone,
                email,
                other_details,
                vendor_type,
                role_trade
            } = req.body;

            if (!vendor_name || !contact_name || !phone || !email) {
                return errorResponse(res, 400, "vendor_name, contact_name, phone, and email are required.");
            }

            const data = {
                vendor_name,
                contact_name,
                address_lookup,
                phone,
                email,
                other_details,
                vendor_type,
                role_trade

            };

            const result = await VendorTable.create(data);
            const insertedData = await VendorTable.getById(result.insertId);

            return successResponse(res, 201, "Vendor created successfully", insertedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All Vendors
    static async getAllVendors(req, res) {
        try {
            const result = await VendorTable.getAll();
            return successResponse(res, 200, "All vendors fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get One Vendor by ID
    static async getVendorById(req, res) {
        try {
            const { id } = req.params;
            const result = await VendorTable.getById(id);
            if (!result) {
                return errorResponse(res, 404, "Vendor not found.");
            }
            return successResponse(res, 200, "Vendor fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update Vendor
    static async updateVendor(req, res) {
        try {
            const { id } = req.params;
            const {
                vendor_name,
                contact_name,
                address_lookup,
                phone,
                email,
                other_details,
                vendor_type,
                role_trade

            } = req.body;

            const data = {
                vendor_name,
                contact_name,
                address_lookup,
                phone,
                email,
                other_details,
                vendor_type,
                role_trade

            };

            await VendorTable.update(id, data);
            const updatedData = await VendorTable.getById(id);

            return successResponse(res, 200, "Vendor updated successfully", updatedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Delete Vendor
    static async deleteVendor(req, res) {
        try {
            const { id } = req.params;
            await VendorTable.delete(id);
            return successResponse(res, 200, "Vendor deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default VendorController;
