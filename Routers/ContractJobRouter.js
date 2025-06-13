import express from 'express';
import ContractJobController from '../Controllers/ContractJobCtrl.js';

const router = express.Router();

router.post('/contract-jobs', ContractJobController.createJob);
router.get('/contract-jobs', ContractJobController.getAllJobs);
router.get('/contract-jobs/:id', ContractJobController.getJobById);
router.put('/contract-jobs/:id', ContractJobController.updateJob);
router.delete('/contract-jobs/:id', ContractJobController.deleteJob);

export default router;
