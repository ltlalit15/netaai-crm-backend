import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const ProposalTable = new Controllers("proposals");

class ProposalController {
    // Create Proposal
    static async createProposal(req, res) {
        try {
            const {
                job_name,                
                client_name,
                job_type,
                bid_due_date,
                sales_id,
                manager_id,
                job_address,
                apt_suite,
                tags
            } = req.body;

            // Always ensure `tags` is an array
            const tagsArray = Array.isArray(tags)
                ? tags
                : typeof tags === "string"
                    ? tags.split(",").map(tag => tag.trim())
                    : [];

            const data = {
                job_name,
                stage: "Lead",
                client_name,
                job_type,
                bid_due_date,
                sales_id,
                manager_id,
                job_address,
                apt_suite,
                tags: tagsArray
            };

            const result = await ProposalTable.create(data);
            const inserted = await ProposalTable.getById(result.insertId);

            return successResponse(res, 201, "Proposal created successfully", {
                ...inserted,
                tags: Array.isArray(inserted.tags)
                    ? inserted.tags
                    : typeof inserted.tags === "string"
                        ? inserted.tags.split(",").map(t => t.trim())
                        : []
            });
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

   


    // Get all Proposals
  static async getAllProposals(req, res) {
  try {
    const proposals = await ProposalTable.getAllWithUsers();

    const formattedProposals = proposals.map(p => ({
      ...p,
      tags: Array.isArray(p.tags)
        ? p.tags
        : typeof p.tags === "string"
        ? p.tags.split(",").map(t => t.trim())
        : [],
    //   user: {
    //     id: p.user_id || null,
    //     first_name: p.user_first_name || 'N/A',
    //     last_name: p.user_last_name || 'N/A'
    //   },
    //   manager: {
    //     id: p.manager_id || null,
    //     first_name: p.manager_first_name || 'N/A',
    //     last_name: p.manager_last_name || 'N/A'
    //   }
    }));

    return successResponse(res, 200, "Proposals fetched successfully", formattedProposals);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}



    // Get Proposal by ID
    static async getProposalById(req, res) {
        const { id } = req.params;
        try {
            const proposal = await ProposalTable.getById(id);
            if (!proposal) {
                return errorResponse(res, 404, "Proposal not found");
            }

            // Convert tags string to array if necessary
            const formattedProposal = {
                ...proposal,
                tags: Array.isArray(proposal.tags)
                    ? proposal.tags
                    : typeof proposal.tags === "string"
                        ? proposal.tags.split(",").map(t => t.trim())
                        : []
            };

            return successResponse(res, 200, "Proposal fetched successfully", formattedProposal);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }


    // Update Proposal
    static async updateProposal(req, res) {
        const { id } = req.params;
        const {
            job_name,
            stage,
            client_name,
            job_type,
            bid_due_date,
            sales_id,
            manager_id,
            job_address,
            apt_suite,
            tags
        } = req.body;

        try {
            // Ensure tags is always an array
            const tagsArray = Array.isArray(tags)
                ? tags
                : typeof tags === "string"
                    ? tags.split(",").map(t => t.trim())
                    : [];

            const updatedProposal = await ProposalTable.update(id, {
                job_name,
                stage,
                client_name,
                job_type,
                bid_due_date,
                sales_id,
                manager_id,
                job_address,
                apt_suite,
                tags: tagsArray
            });

            if (!updatedProposal) {
                return errorResponse(res, 404, "Proposal not found");
            }

            // Ensure tags in response is returned as an array
            const formattedResponse = {
                ...updatedProposal,
                tags: Array.isArray(updatedProposal.tags)
                    ? updatedProposal.tags
                    : typeof updatedProposal.tags === "string"
                        ? updatedProposal.tags.split(",").map(t => t.trim())
                        : []
            };

            return successResponse(res, 200, "Proposal updated successfully", formattedResponse);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }



    // Delete Proposal
    static async deleteProposal(req, res) {
        const { id } = req.params;

        try {
            const deletedProposal = await ProposalTable.delete(id);
            if (!deletedProposal) {
                return errorResponse(res, 404, "Proposal not found");
            }

            return successResponse(res, 200, "Proposal deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    static async updateProposalStage(req, res) {
    const { id } = req.params;
    const { stage } = req.body;

    try {
        if (!stage) {
            return errorResponse(res, 400, "Stage is required");
        }

        const proposal = await ProposalTable.getById(id);
        if (!proposal) {
            return errorResponse(res, 404, "Proposal not found");
        }

        await ProposalTable.update(id, { stage });

        const updated = await ProposalTable.getById(id);

        // Format tags if needed
        const formattedProposal = {
            ...updated,
            tags: Array.isArray(updated.tags)
                ? updated.tags
                : typeof updated.tags === "string"
                    ? updated.tags.split(",").map(t => t.trim())
                    : []
        };

        return successResponse(res, 200, "Stage updated successfully", formattedProposal);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}
}






export default ProposalController;
