import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const ContractTable = new Controllers("contracts");

class ContractController {
    // CREATE
    static async createContract(req, res) {
        try {
            const {
                client_name,
                po_number,
                contract_number,
                start_date,
                end_date,
                payment_terms,
                item_description,
                quantity,
                unit_price,
                taxable,
                applicable_tax_rate,
                comments
            } = req.body;

            // if (
            //     !client_name || !po_number || !contract_number || !start_date ||
            //     !end_date || !payment_terms || !item_description ||
            //     !quantity || !unit_price || !taxable || !applicable_tax_rate
            // ) {
            //     return errorResponse(res, 400, "Required fields are missing.");
            // }

             // Parse numbers
            const qty = parseFloat(quantity);
            const price = parseFloat(unit_price);
            const taxRate = parseFloat(applicable_tax_rate.match(/\d+/)?.[0] || 0);

            // Calculate values
            const subtotal = qty * price;
            const gst_amount = taxable === "true" ? (subtotal * taxRate) / 100 : 0;
            const total = subtotal + gst_amount;

            const data = {
                client_name,
                po_number,
                contract_number,
                start_date,
                end_date,
                payment_terms,
                item_description,
                quantity,
                unit_price,
                taxable,
                applicable_tax_rate,
                comments
            };

            const result = await ContractTable.create(data);
            const inserted = await ContractTable.getById(result.insertId);

              // Include totals in response only
            const responseWithCalc = {
                ...inserted,
                subtotal,
                gst_amount,
                total
            };

            return successResponse(res, 201, "Contract created successfully", responseWithCalc);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // READ ALL
  // READ ALL
static async getAllContracts(req, res) {
    try {
        const contracts = await ContractTable.getAll();

        const enrichedContracts = contracts.map(contract => {
            const qty = parseFloat(contract.quantity);
            const price = parseFloat(contract.unit_price);
            const taxRate = parseFloat(contract.applicable_tax_rate.match(/\d+/)?.[0] || 0);

            const subtotal = qty * price;
            const gst_amount = contract.taxable === "true" ? (subtotal * taxRate) / 100 : 0;
            const total = subtotal + gst_amount;

            return {
                ...contract,
                subtotal,
                gst_amount,
                total
            };
        });

        return successResponse(res, 200, "All contracts fetched", enrichedContracts);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}


    // READ BY ID
    // READ BY ID
static async getContractById(req, res) {
    try {
        const { id } = req.params;
        const contract = await ContractTable.getById(id);

        if (!contract) {
            return errorResponse(res, 404, "Contract not found");
        }

        const qty = parseFloat(contract.quantity);
        const price = parseFloat(contract.unit_price);
        const taxRate = parseFloat(contract.applicable_tax_rate.match(/\d+/)?.[0] || 0);

        const subtotal = qty * price;
        const gst_amount = contract.taxable === "true" ? (subtotal * taxRate) / 100 : 0;
        const total = subtotal + gst_amount;

        const enrichedContract = {
            ...contract,
            subtotal,
            gst_amount,
            total
        };

        return successResponse(res, 200, "Contract fetched", enrichedContract);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}


    // UPDATE
    // UPDATE
static async updateContract(req, res) {
    try {
        const { id } = req.params;
        const existing = await ContractTable.getById(id);

        if (!existing) {
            return errorResponse(res, 404, "Contract not found");
        }

        const {
            client_name,
            po_number,
            contract_number,
            start_date,
            end_date,
            payment_terms,
            item_description,
            quantity,
            unit_price,
            taxable,
            applicable_tax_rate,
            comments
        } = req.body;

        // if (
        //     !client_name || !po_number || !contract_number || !start_date ||
        //     !end_date || !payment_terms || !item_description ||
        //     !quantity || !unit_price || !taxable || !applicable_tax_rate
        // ) {
        //     return errorResponse(res, 400, "Required fields are missing.");
        // }

        // Convert to numbers
        const qty = parseFloat(quantity);
        const price = parseFloat(unit_price);
        const taxRate = parseFloat(applicable_tax_rate.match(/\d+/)?.[0] || 0);

        // Calculate totals
        const subtotal = qty * price;
        const gst_amount = taxable === "true" ? (subtotal * taxRate) / 100 : 0;
        const total = subtotal + gst_amount;

        const updatedData = {
            client_name,
            po_number,
            contract_number,
            start_date,
            end_date,
            payment_terms,
            item_description,
            quantity,
            unit_price,
            taxable,
            applicable_tax_rate,
            comments
        };

        await ContractTable.update(id, updatedData);
        const updatedContract = await ContractTable.getById(id);

        const responseWithCalc = {
            ...updatedContract,
            subtotal,
            gst_amount,
            total
        };

        return successResponse(res, 200, "Contract updated successfully", responseWithCalc);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}


    // DELETE
    static async deleteContract(req, res) {
        try {
            const { id } = req.params;
            const existing = await ContractTable.getById(id);

            if (!existing) {
                return errorResponse(res, 404, "Contract not found");
            }

            await ContractTable.delete(id);
            return successResponse(res, 200, "Contract deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default ContractController;
