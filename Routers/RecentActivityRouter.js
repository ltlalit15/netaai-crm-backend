// routes/recentActivityRoutes.js
import express from 'express';
import RecentActivityController from '../Controllers/RecentActivityController.js';

const router = express.Router();

router.get('/getRecentEntriess', RecentActivityController.getRecentEntries);

export default router;
