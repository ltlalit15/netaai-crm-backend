import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";
import bcrypt from "bcrypt";

const ClientTable = new Controllers("clients");

class ClientController {

    // Create Client
    static async createclient(req, res) {
        try {
            const {
                client_name,
                contact_name,
                client_type,
                industry,
                company_size,
                business_type,
                is_subclient,
                phone,
                email,
                other_details,
                address_lookup,
                address,
                address_2,
                city,
                state,
                zip_code,
                country,
                notes,
              
               // password
            } = req.body;

            // Ensure that password is provided
            // if (!password) {
            //     return errorResponse(res, 400, "Password is required.");
            // }
            // const hashedPassword = await bcrypt.hash(password, 10);

            const data = {
                client_name,
                contact_name,
                client_type,
                industry,
                company_size,
                business_type,
                is_subclient,
                phone,
                email,
                other_details,
                address_lookup,
                address,
                address_2,
                city,
                state,
                zip_code,
                country,
                notes,
                
                //password: hashedPassword
            };

            const result = await ClientTable.create(data);
            const insertedData = await ClientTable.getById(result.insertId);

            return successResponse(res, 201, "Client created successfully", insertedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All Clients
    static async getAllclient(req, res) {
        try {
            const result = await ClientTable.getAll();
            return successResponse(res, 200, "All clients fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get One Client by ID
    static async getclientById(req, res) {
        try {
            const { id } = req.params;
            const result = await ClientTable.getById(id);
            if (!result) {
                return errorResponse(res, 404, "Client not found.");
            }
            return successResponse(res, 200, "Client fetched successfully", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update Client
    static async updateclient(req, res) {
        try {
            const { id } = req.params;
            const {
                client_name,
                contact_name,
                client_type,
                industry,
                company_size,
                business_type,
                is_subclient,
                phone,
                email,
                other_details,
                address_lookup,
                address,
                address_2,
                city,
                state,
                zip_code,
                country,
                notes,
               
            } = req.body;

            const data = {
                client_name,
                contact_name,
                client_type,
                industry,
                company_size,
                business_type,
                is_subclient,
                phone,
                email,
                other_details,
                address_lookup,
                address,
                address_2,
                city,
                state,
                zip_code,
                country,
                notes,
                
            };

            await ClientTable.update(id, data);
            const updatedData = await ClientTable.getById(id);

            return successResponse(res, 200, "Client updated successfully", updatedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
    

    // Delete Client
    static async deleteclient(req, res) {
        try {
            const { id } = req.params;
            await ClientTable.delete(id);
            return successResponse(res, 200, "Client deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}


export default ClientController;
