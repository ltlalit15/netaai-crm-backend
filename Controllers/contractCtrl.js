import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const ContractTable = new Controllers("contracts");

class ContractController {
    

  static async createContract(req, res) {
  try {
    const {
      proposal_id,
      client_name,
      po_number,
      contract_number,
      start_date,
      end_date,
      payment_terms,
      applicable_tax_rate,
      comments,
      items
    } = req.body;

    // Validation
    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 400, "At least one item is required");
    }

    let subtotal = 0;
    const taxRate = parseFloat(applicable_tax_rate.match(/\d+/)?.[0] || 0);
    const processedItems = [];

    // Process each item
    for (const item of items) {
      const qty = parseFloat(item.quantity);
      const price = parseFloat(item.unit_price);
      const itemSubtotal = qty * price;
      subtotal += itemSubtotal;

      processedItems.push({
        item_description: item.item_description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        taxable: item.taxable  // ✅ Fixed missing comma
      });
    }

    // Check if any item is taxable
    const anyTaxable = items.some(item => item.taxable === "true");
    const gst_amount = anyTaxable ? (subtotal * taxRate) / 100 : 0;
    const total = subtotal + gst_amount;

    const data = {
      proposal_id,
      client_name,
      po_number,
      contract_number,
      start_date,
      end_date,
      payment_terms,
      applicable_tax_rate,
      comments,
      items: JSON.stringify(processedItems)
     
    };

    const result = await ContractTable.create(data);
    const inserted = await ContractTable.getById(result.insertId);
    const finalItems = JSON.parse(inserted.items);

    return successResponse(res, 201, "Contract created successfully", {
      ...inserted,
      items: finalItems
    });

  } catch (error) {
    console.error("❌ Error in createContract:", error);
    return errorResponse(res, 500, error.message);
  }
}



    // READ ALL
  // READ ALL
static async getAllContracts(req, res) {
  try {
    const contracts = await ContractTable.getAll();

    const enrichedContracts = contracts.map(contract => {
      let subtotal = 0;
      let gst_amount = 0;
      let total = 0;

      const items = JSON.parse(contract.items || "[]");

      const cleanedItems = items.map(item => {
        const qty = parseFloat(item.quantity);
        const price = parseFloat(item.unit_price);
        subtotal += qty * price;

        return {
          item_description: item.item_description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          taxable: item.taxable // ✅ INCLUDE taxable here
        };
      });

      const taxRate = parseFloat(contract.applicable_tax_rate?.match(/\d+/)?.[0] || 0);
      const anyTaxable = cleanedItems.some(item => item.taxable === "true");

      if (anyTaxable) {
        gst_amount = (subtotal * taxRate) / 100;
      }

      total = subtotal + gst_amount;

      return {
        ...contract,
        items: cleanedItems,
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

    const items = JSON.parse(contract.items || "[]");

    const cleanedItems = items.map(item => ({
      item_description: item.item_description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      taxable: item.taxable // ✅ INCLUDE taxable
    }));

    return successResponse(res, 200, "Contract fetched", {
      ...contract,
      items: cleanedItems
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}

    static async getContractsByProposalId(req, res) {
  try {
    const { proposal_id } = req.params;

    const contracts = await ContractTable.getByProposalId(proposal_id);

    if (!contracts || contracts.length === 0) {
      return errorResponse(res, 404, "No contracts found for this proposal");
    }

    const enrichedContracts = contracts.map(contract => {
      const items = JSON.parse(contract.items || "[]");

      const cleanedItems = items.map(item => ({
        item_description: item.item_description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        taxable: item.taxable
      }));

      return {
        ...contract,
        items: cleanedItems
      };
    });

    return successResponse(res, 200, "Contracts fetched by proposal_id", enrichedContracts);
  } catch (error) {
    console.error("❌ Error in getContractsByProposalId:", error);
    return errorResponse(res, 500, error.message);
  }
}



    // UPDATE
    // UPDATE
static async updateContract(req, res) {
  try {
    const { id } = req.params;

    const {
      proposal_id,
      client_name,
      po_number,
      contract_number,
      start_date,
      end_date,
      payment_terms,
      applicable_tax_rate,
      comments,
      items
    } = req.body;

    // Validation
    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 400, "At least one item is required");
    }

    let subtotal = 0;
    const taxRate = parseFloat(applicable_tax_rate.match(/\d+/)?.[0] || 0);
    const processedItems = [];

    // Process items
    for (const item of items) {
      const qty = parseFloat(item.quantity);
      const price = parseFloat(item.unit_price);
      const itemSubtotal = qty * price;
      subtotal += itemSubtotal;

      processedItems.push({
        item_description: item.item_description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        taxable: item.taxable
      });
    }

    // Check if any item is taxable
    const anyTaxable = processedItems.some(item => item.taxable === "true");
    const gst_amount = anyTaxable ? (subtotal * taxRate) / 100 : 0;
    const total = subtotal + gst_amount;

    // Build update data
    const data = {
      proposal_id,
      client_name,
      po_number,
      contract_number,
      start_date,
      end_date,
      payment_terms,
      applicable_tax_rate,
      comments,
      items: JSON.stringify(processedItems)
      // ⛔ Don't include subtotal/gst_amount/total unless they are in the DB
    };

    const result = await ContractTable.update(id, data);

    if (result.affectedRows === 0) {
      return errorResponse(res, 404, "Contract not found");
    }

    const updated = await ContractTable.getById(id);
    const finalItems = JSON.parse(updated.items);

    return successResponse(res, 200, "Contract updated successfully", {
      ...updated,
      items: finalItems
    });

  } catch (error) {
    console.error("❌ Error in updateContract:", error);
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
