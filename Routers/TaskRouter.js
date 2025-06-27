import express from 'express';
import TaskController from '../Controllers/TaskController.js';

const router = express.Router();

router.post('/tasks', TaskController.createTask);
router.get('/tasks', TaskController.getAllTasks);
router.get('/tasks/:id', TaskController.getTaskById);
router.patch('/tasks/:id', TaskController.updateTask);
router.delete('/tasks/:id', TaskController.deleteTask);

export default router;
