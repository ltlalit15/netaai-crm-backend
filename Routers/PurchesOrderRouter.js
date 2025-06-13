// routes/purchaseOrderRoutes.js
import express from 'express';
import PurchaseOrderController from '../Controllers/PurchesOrderCtrl.js';

const router = express.Router();

router.post('/purchase-order', PurchaseOrderController.createPurchaseOrder);
router.get('/purchase-order', PurchaseOrderController.getAllPurchaseOrders);
router.get('/purchase-order/:id', PurchaseOrderController.getPurchaseOrderById);
router.put('/purchase-order/:id', PurchaseOrderController.updatePurchaseOrder);
router.delete('/purchase-order/:id', PurchaseOrderController.deletePurchaseOrder);

export default router;
