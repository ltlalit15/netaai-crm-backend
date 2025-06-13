import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const TaskTable = new Controllers("tasks");

class TaskController {
    // Create
    static async createTask(req, res) {
        try {
            const {
                task_description,
                project,
                assign_to,
                due_date,
                priority,
                status,
                comment,
                tags,
                subtasks
            } = req.body;

            if (!task_description || !project) {
                return errorResponse(res, 400, "Task description and project are required.");
            }

            const data = {
                task_description,
                project,
                assign_to,
                due_date,
                priority,
                status,
                comment,
                tags: JSON.stringify(tags),
                subtasks: JSON.stringify(subtasks),

            };

            const result = await TaskTable.create(data);
            const inserted = await TaskTable.getById(result.insertId);

            return successResponse(res, 201, "Task created successfully", inserted);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }

    // Get All
    static async getAllTasks(req, res) {
        try {
            const tasks = await TaskTable.getAll();
            return successResponse(res, 200, "Tasks fetched successfully", tasks);
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
            return successResponse(res, 200, "Task retrieved successfully", task);
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
                project,
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
                project,
                assign_to,
                due_date,
                priority,
                status,
                comment,
                tags: JSON.stringify(tags),
                subtasks: JSON.stringify(subtasks),
            };

            await TaskTable.update(id, data);
            const updated = await TaskTable.getById(id);
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
