import express from "express";
import DocumentRecordController from "../Controllers/DocumentRecordCtrl.js";

const router = express.Router();

// Create a document
router.post("/documentsRecord", DocumentRecordController.createDocumentRecord);

// Get all documents
router.get("/documentsRecord", DocumentRecordController.getAllDocumentsRecord);

// Get a document by ID
router.get("/documentsRecord/:id", DocumentRecordController.getDocumentByIdRecord);

// Update a document
router.patch("/documentsRecord/:id", DocumentRecordController.updateDocumentRecord);

router.patch("/documentsRecord/updateDocumentByProposalId/:proposal_id", DocumentRecordController.updateDocumentByProposalId);

// Delete a document
router.delete("/documentsRecord/:id", DocumentRecordController.deleteDocumentRecord);

router.get("/documentsRecord/getDocumentsByProposalId/:proposal_id", DocumentRecordController.getDocumentsByProposalId);

export default router;





