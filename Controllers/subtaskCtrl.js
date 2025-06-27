import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const SubTaskTable = new Controllers("sub_tasks");

class SubTaskController {
    // 🔹 CREATE
    static async createSubTask(req, res) {
        try {
            const { title, due_date, assigneeId, tasks_id, status } = req.body;

            if (!title || !assigneeId || !tasks_id) {
                return errorResponse(res, 400, "Title, assigneeId, and tasks_id are required.");
            }

            const data = {
                title,
                due_date,
                assigneeId: JSON.stringify(assigneeId),  // Store array as JSON string
                tasks_id,
                status
            };

            const result = await SubTaskTable.create(data);
            const inserted = await SubTaskTable.getById(result.insertId);
            inserted.assigneeId = JSON.parse(inserted.assigneeId);  // Convert back to array

            return successResponse(res, 201, "Sub-task created successfully", inserted);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // 🔹 READ ALL
    static async getAllSubTask(req, res) {
        try {
            const data = await SubTaskTable.getAllSubTasksWithAssigneeDetails();
            return successResponse(res, 200, "Sub-tasks fetched", data);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // 🔹 READ ONE
    static async getSubTaskById(req, res) {
        try {
            const { id } = req.params;
            const data = await SubTaskTable.getById(id);
            if (!data) return errorResponse(res, 404, "Sub-task not found");
            data.assigneeId = JSON.parse(data.assigneeId);
            return successResponse(res, 200, "Sub-task fetched", data);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // 🔹 UPDATE
    static async updateSubTask(req, res) {
        try {
            const { id } = req.params;
            const { title, due_date, assigneeId, tasks_id, status } = req.body;

            const exists = await SubTaskTable.getById(id);
            if (!exists) return errorResponse(res, 404, "Sub-task not found");

            const data = {
                title,
                due_date,
                assigneeId: JSON.stringify(assigneeId),
                tasks_id,
                status
            };

            await SubTaskTable.update(id, data);
            const updated = await SubTaskTable.getById(id);
            updated.assigneeId = JSON.parse(updated.assigneeId);

            return successResponse(res, 200, "Sub-task updated", updated);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // 🔹 DELETE
    static async deleteSubTask(req, res) {
        try {
            const { id } = req.params;

            const exists = await SubTaskTable.getById(id);
            if (!exists) return errorResponse(res, 404, "Sub-task not found");

            await SubTaskTable.delete(id);
            return successResponse(res, 200, "Sub-task deleted");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

export default SubTaskController;
