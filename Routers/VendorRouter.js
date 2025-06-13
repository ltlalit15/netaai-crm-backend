// routes/vendorRoutes.js
import express from 'express';
import VendorController from '../Controllers/VendorCtrl.js';

const router = express.Router();

router.post('/vendor', VendorController.createVendor);
router.get('/vendor', VendorController.getAllVendors);
router.get('/vendor/:id', VendorController.getVendorById);
router.put('/vendor/:id', VendorController.updateVendor);
router.delete('/vendor/:id', VendorController.deleteVendor);

export default router;
