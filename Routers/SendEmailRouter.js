import express from 'express';
import SendEmailController from '../Controllers/SendEmailCtrl.js';

const router = express.Router();


router.post('/sendProposalEmail', SendEmailController.sendProposalEmail);


export default router;

