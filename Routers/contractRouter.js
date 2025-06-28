import express from "express";
import ContractController from "../Controllers/contractCtrl.js";

const router = express.Router();

router.post("/contracts", ContractController.createContract);
router.get("/contracts", ContractController.getAllContracts);
router.get("/contracts/:id", ContractController.getContractById);
router.patch("/contracts/:id", ContractController.updateContract);
router.delete("/contracts/:id", ContractController.deleteContract);

router.get("/contracts/:proposal_id", ContractController.getContractsByProposalId);


export default router;
