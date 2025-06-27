// In Routers/NotesRouter.js
import express from 'express';
import NotesController from '../Controllers/NotesCtrl.js';

const router = express.Router();

// Define your routes here
router.post('/notes', NotesController.createNote);
router.get('/notes', NotesController.getAllNotes);
router.get('/notes/:id', NotesController.getNoteById);
router.patch('/notes/:id', NotesController.updateNote);
router.delete('/notes/:id', NotesController.deleteNote);

// Export the router with default export
export default router;
