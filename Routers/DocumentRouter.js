// routes/purchaseOrderRoutes.js
import express from 'express';
import DocumentController from '../Controllers/DocumentCtrl.js';

const router = express.Router();

router.post("/projects_document", DocumentController.createDocument);
router.get("/projects_document", DocumentController.getAllDocuments);
router.get("/projects_document/:id", DocumentController.getDocumentById);
router.patch("/projects_document/:id", DocumentController.updateDocument);
router.delete("/projects_document/:id", DocumentController.deleteDocument);
router.get("/projects_document/getDocumentsByProposalId/:proposal_id", DocumentController.getDocumentsByProposalId);

export default router;
