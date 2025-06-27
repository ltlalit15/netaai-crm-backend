import express from "express";
import JobController from "../Controllers/JobPlanningCtrl.js";

const router = express.Router();

// Create Job
router.post("/job_planning", JobController.createJob);

// Get All Jobs
router.get("/job_planning", JobController.getAllJobs);

// Get Job by ID
router.get("/job_planning/:id", JobController.getJobById);

// Update Job
router.patch("/job_planning/:id", JobController.updateJob);

// Delete Job
router.delete("/job_planning/:id", JobController.deleteJob);

export default router;

