import express from "express";
import ClientController from "../Controllers/ClientCtrl.js";

const router = express.Router();

// Create new client
router.post("/client", ClientController.createclient);

// Get all clients
router.get("/client", ClientController.getAllclient);

// Get a specific client by ID
router.get("/client/:id", ClientController.getclientById);

// Update client by ID
router.patch("/client/:id", ClientController.updateclient);

// Delete client by ID
router.delete("/client/:id", ClientController.deleteclient);


export default router;
