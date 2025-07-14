import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const NotesTable = new Controllers("notes");

class NotesController {
    // Create Note
    static async createNote(req, res) {
        try {
            const { project_id, name, note } = req.body;

           // if (!name || !note) {
           //     return errorResponse(res, 400, "Name and Note are required.");
          //  }

            const data = {
                project_id,
                name,
                note
            };

            const result = await NotesTable.create(data);
            const inserted = await NotesTable.getById(result.insertId);

            return successResponse(res, 201, "Note created successfully", inserted);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get all Notes
    static async getAllNotes(req, res) {
        try {
            const notes = await NotesTable.getAll();
            return successResponse(res, 200, "Notes fetched successfully", notes);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get Note by ID
    static async getNoteById(req, res) {
        const { id } = req.params;
        try {
            const note = await NotesTable.getById(id);
            if (!note) {
                return errorResponse(res, 404, "Note not found");
            }
            return successResponse(res, 200, "Note fetched successfully", note);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Update Note
    static async updateNote(req, res) {
        const { id } = req.params;
        const { project_id, name, note } = req.body;

        try {
            const updatedNote = await NotesTable.update(id, { project_id, name, note });

            if (!updatedNote) {
                return errorResponse(res, 404, "Note not found");
            }

            return successResponse(res, 200, "Note updated successfully", updatedNote);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Delete Note
    static async deleteNote(req, res) {
        const { id } = req.params;

        try {
            const deletedNote = await NotesTable.delete(id);
            if (!deletedNote) {
                return errorResponse(res, 404, "Note not found");
            }

            return successResponse(res, 200, "Note deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}


export default NotesController;
