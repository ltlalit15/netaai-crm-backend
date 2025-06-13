import express from 'express';
import ProjectController from '../Controllers/ProjectController.js';

const router = express.Router();

router.post('/projects', ProjectController.createProject);
router.get('/projects', ProjectController.getAllProjects);
router.get('/projects/:id', ProjectController.getProjectById);
router.put('/projects/:id', ProjectController.updateProject);
router.delete('/projects/:id', ProjectController.deleteProject);

export default router;
