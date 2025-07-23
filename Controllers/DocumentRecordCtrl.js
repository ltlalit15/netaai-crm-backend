import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const DocumentRecordTable = new Controllers("document_records");

class DocumentRecordController {
    // Create Document
    static async createDocumentRecord(req, res) {
        try {
            const {
                client_id,
                proposal_id,
                start_date,
                end_date,
                line_items // array from frontend
                
            } = req.body;

            const data = {
                client_id: String(client_id),
                proposal_id: String(proposal_id),
                start_date,
                end_date,
                line_items: JSON.stringify(line_items)
                
            };

            const result = await DocumentRecordTable.create(data);
            const insertedData = await DocumentRecordTable.getById(result.insertId);

            // Parse line_items before sending response
            insertedData.line_items = JSON.parse(insertedData.line_items);
            insertedData.client_id = String(insertedData.client_id);
            insertedData.proposal_id = String(insertedData.proposal_id);
                       

            return successResponse(res, 201, "Document created successfully", insertedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All Documents
    static async getAllDocumentsRecord(req, res) {
        try {
            const result = await DocumentRecordTable.getAll();

            // Parse line_items for each document
            const parsedResult = result.map(doc => ({
                ...doc,
                line_items: JSON.parse(doc.line_items)
            }));

            return successResponse(res, 200, "Documents fetched", parsedResult);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get Document by ID
    static async getDocumentByIdRecord(req, res) {
        try {
            const { id } = req.params;
            const result = await DocumentRecordTable.getById(id);

            if (!result) {
                return errorResponse(res, 404, "Document not found");
            }

            result.line_items = JSON.parse(result.line_items);

            return successResponse(res, 200, "Document fetched", result);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update Document
    static async updateDocumentRecord(req, res) {
        try {
            const { id } = req.params;
            const {
                client_id,
                proposal_id,
                start_date,
                end_date,
                line_items
               
            } = req.body;

            const data = {
                client_id: String(client_id),
                proposal_id: String(proposal_id),
                start_date,
                end_date,
                line_items: JSON.stringify(line_items)
                
            };

            await DocumentRecordTable.update(id, data);
            const updatedData = await DocumentRecordTable.getById(id);
            updatedData.line_items = JSON.parse(updatedData.line_items);
            updatedData.client_id = String(updatedData.client_id);
            updatedData.proposal_id = String(updatedData.proposal_id);
           

            return successResponse(res, 200, "Document updated", updatedData);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Delete Document
    static async deleteDocumentRecord(req, res) {
        try {
            const { id } = req.params;
            await DocumentRecordTable.delete(id);
            return successResponse(res, 200, "Document deleted");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }


    // Get documents by proposal_id
    static async getDocumentsByProposalId(req, res) {
        try {
            const { proposal_id } = req.params;

            const result = await DocumentRecordTable.getDocumentRecordByProposalId(proposal_id);

            // Parse line_items for each document
            const parsedResult = result.map(doc => ({
                ...doc,
                line_items: JSON.parse(doc.line_items)
            }));

            return successResponse(res, 200, "Documents by proposal_id fetched", parsedResult);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

}

export default DocumentRecordController;
