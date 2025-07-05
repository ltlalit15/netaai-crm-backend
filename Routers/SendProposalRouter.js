import express from 'express';
import SendProposalController from '../Controllers/SendProposal.js';

const router = express.Router();


router.post('/sendProposalForSignature', SendProposalController.sendProposalForSignature);

router.get('/checkIfSigned/:envelopeId', SendProposalController.checkIfSigned);
export default router;


