import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const TaskTable = new Controllers("tasks");

class TaskController {
    // Create
    static async createTask(req, res) {
        try {
            const {
                task_description,
                projectId,
                assign_to,
                due_date,
                priority,
                status,
                comment,
                tags,
                subtasks
            } = req.body;

            if (!task_description || !projectId) {
                return errorResponse(res, 400, "Task description and project are required.");
            }

            const data = {
                task_description,
                projectId,
                assign_to: JSON.stringify(assign_to),   // handle multiple assignees
                due_date,
                priority,
                status,
                comment,
                tags: JSON.stringify(tags),
                subtasks: JSON.stringify(subtasks),
            };

            const result = await TaskTable.create(data);
            const inserted = await TaskTable.getById(result.insertId);

            // Parse JSON fields back for response
            if (inserted) {
                inserted.assign_to = JSON.parse(inserted.assign_to || "[]");
                inserted.tags = JSON.parse(inserted.tags || "[]");
                inserted.subtasks = JSON.parse(inserted.subtasks || "[]");
            }

            return successResponse(res, 201, "Task created successfully", inserted);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All
   static async getAllTasks(req, res) {
    try {
        const tasks = await TaskTable.getAll();

        const parsedTasks = tasks.map(task => ({
            ...task,
            assign_to: JSON.parse(task.assign_to || '[]'),
            tags: JSON.parse(task.tags || '[]'),
            subtasks: JSON.parse(task.subtasks || '[]'),
        }));

        return successResponse(res, 200, "Tasks fetched successfully", parsedTasks);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}


    // Get by ID
    static async getTaskById(req, res) {
    try {
        const { id } = req.params;
        const task = await TaskTable.getById(id);

        if (!task) return errorResponse(res, 404, "Task not found");

        const parsedTask = {
            ...task,
            assign_to: JSON.parse(task.assign_to || '[]'),
            tags: JSON.parse(task.tags || '[]'),
            subtasks: JSON.parse(task.subtasks || '[]'),
        };

        return successResponse(res, 200, "Task retrieved successfully", parsedTask);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}


    // Update
    static async updateTask(req, res) {
    try {
        const { id } = req.params;
        const {
            task_description,
            projectId,
            assign_to,
            due_date,
            priority,
            status,
            comment,
            tags,
            subtasks
        } = req.body;

        const data = {
            task_description,
            projectId,
            assign_to: JSON.stringify(assign_to),  // handle multiple assignees
            due_date,
            priority,
            status,
            comment,
            tags: JSON.stringify(tags),
            subtasks: JSON.stringify(subtasks),
        };

        await TaskTable.update(id, data);
        const updated = await TaskTable.getById(id);

        // parse fields back to array before returning
        if (updated) {
            updated.assign_to = JSON.parse(updated.assign_to || "[]");
            updated.tags = JSON.parse(updated.tags || "[]");
            updated.subtasks = JSON.parse(updated.subtasks || "[]");
        }

        return successResponse(res, 200, "Task updated successfully", updated);
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
}

    // Delete
    static async deleteTask(req, res) {
        try {
            const { id } = req.params;
            await TaskTable.delete(id);
            return successResponse(res, 200, "Task deleted successfully");
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}


export default TaskController;
