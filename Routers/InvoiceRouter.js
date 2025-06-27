import express from 'express';
import InvoiceController from '../Controllers/InvoiceCtrl.js';

const router = express.Router();

// Create Invoice
router.post('/invoice', InvoiceController.createInvoice);

// Get All Invoices
router.get('/invoice', InvoiceController.getAllInvoices);

// Get Single Invoice by ID
router.get('/invoice/:id', InvoiceController.getInvoiceById);

// Update Invoice by ID
router.put('/invoice/:id', InvoiceController.updateInvoice);

// Delete Invoice by ID
router.delete('/invoice/:id', InvoiceController.deleteInvoice);

export default router;
