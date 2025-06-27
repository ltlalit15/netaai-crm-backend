// In Routers/NotesRouter.js
import express from 'express';
import CommentsController from '../Controllers/commentsCtrl.js';

const router = express.Router();

// Define your routes here
router.post('/comments', CommentsController.createComment);
router.get('/comments', CommentsController.getAllComments);
router.get('/comments/:id', CommentsController.getCommentById);
router.get('/getCommentsByDailyLog/:dailylog_id', CommentsController.getCommentsByDailyLog);
router.patch('/comments/:id', CommentsController.updateComment);
router.delete('/comments/:id', CommentsController.deleteComment);



// Export the router with default export
export default router;
