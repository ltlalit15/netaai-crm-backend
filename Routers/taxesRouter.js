import express from "express";
import TaxController from "../Controllers/taxesCtrl.js";

const router = express.Router();

router.post("/taxes", TaxController.createTax);
router.get("/taxes", TaxController.getAllTaxes);
router.get("/taxes/:id", TaxController.getTaxById);
router.patch("/taxes/:id", TaxController.updateTax);
router.delete("/taxes/:id", TaxController.deleteTax);

export default router;
