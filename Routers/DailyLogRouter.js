// In Routers/NotesRouter.js
import express from 'express';
import DailyLogController from '../Controllers/DailyLogCtrl.js';

const router = express.Router();

// Define your routes here
router.post('/daily_logs', DailyLogController.createLog);
router.get('/daily_logs', DailyLogController.getAllLogs);
router.get('/daily_logs/:id', DailyLogController.getLogById);
router.patch('/daily_logs/:id', DailyLogController.updateLog);
router.delete('/daily_logs/:id', DailyLogController.deleteLog);

// Export the router with default export
export default router;
