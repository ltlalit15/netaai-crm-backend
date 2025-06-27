import express from "express";
import SubTaskController from "../Controllers/subtaskCtrl.js";

const router = express.Router();

router.post("/subtasks", SubTaskController.createSubTask);
router.get("/subtasks", SubTaskController.getAllSubTask);
router.get("/subtasks/:id", SubTaskController.getSubTaskById);
router.patch("/subtasks/:id", SubTaskController.updateSubTask);
router.delete("/subtasks/:id", SubTaskController.deleteSubTask);

export default router;
