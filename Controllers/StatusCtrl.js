import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const ProposalTable = new Controllers("proposals");

class StatusController {

    static async updateProposalStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            // Logging input
            console.log("Update Proposal Status Request");
            console.log("ID:", id);
            console.log("Status:", status);

            // Validation
            if (!status || typeof status !== "string" || status.trim() === "") {
                console.warn("Invalid status value:", status);
                return errorResponse(res, 400, "Status is required and must be a non-empty string");
            }

            // Call model method
            const result = await ProposalTable.updateStatus(id, status);
            console.log("MySQL update result:", result);

            // Row check
            if (!result || result.affectedRows === 0) {
                console.warn("Proposal not found or not updated for ID:", id);
                return errorResponse(res, 404, "Proposal not found or not updated");
            }

            // Fetch and format updated proposal
            const updatedProposal = await ProposalTable.getById(id);
            console.log("Updated Proposal Fetched:", updatedProposal);

            const formattedProposal = {
                ...updatedProposal,
                tags: Array.isArray(updatedProposal.tags)
                    ? updatedProposal.tags
                    : typeof updatedProposal.tags === "string"
                        ? updatedProposal.tags.split(",").map(t => t.trim())
                        : []
            };

            return successResponse(res, 200, "Proposal status updated successfully", formattedProposal);
        } catch (error) {
            console.error("Error in updateProposalStatus:", error.message);
            return errorResponse(res, 500, error.message);
        }
    }

}  


export default StatusController;
