import express from 'express';
import BillController from '../Controllers/BillCtrl.js';

const router = express.Router();

// Create Bill
router.post('/bill', BillController.createBill);

// Get All Bills
router.get('/bill', BillController.getAllBills);

// Get One Bill by ID
router.get('/bill/:id', BillController.getBillById);

// Update Bill
router.put('/bill/:id', BillController.updateBill);

// Delete Bill
router.delete('/bill/:id', BillController.deleteBill);

export default router;
