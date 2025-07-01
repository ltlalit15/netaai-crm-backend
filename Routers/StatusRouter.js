import express from 'express';
import StatusController from '../Controllers/StatusCtrl.js';

const router = express.Router();


router.put('/status/:id', StatusController.updateProposalStatus);


export default router;




