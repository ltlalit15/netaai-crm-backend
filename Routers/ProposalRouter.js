// routes/purchaseOrderRoutes.js
import express from 'express';
import PurchaseOrderController from '../Controllers/ProposalCtrl.js';

const router = express.Router();

router.post('/proposals', PurchaseOrderController.createProposal);
router.get('/proposals', PurchaseOrderController.getAllProposals);
router.get('/proposals/:id', PurchaseOrderController.getProposalById);
router.patch('/proposals/:id', PurchaseOrderController.updateProposal);
router.delete('/proposals/:id', PurchaseOrderController.deleteProposal);
router.put('/proposals/:id', PurchaseOrderController.updateProposalStage);

export default router;
