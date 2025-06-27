import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const CommentsTable = new Controllers("comments");

class CommentsController {
  // Create Comment
  static async createComment(req, res) {
    try {
      const { user_id, dailylog_id, comment } = req.body;

    //   if (!user_id || !dailylog_id || !comment) {
    //     return errorResponse(res, 400, "user_id, dailylog_id, and comment are required.");
    //   }

      const data = {
        user_id,
        dailylog_id,
        comment
      };

      const result = await CommentsTable.create(data);
      const inserted = await CommentsTable.getById(result.insertId);

      return successResponse(res, 201, "Comment created successfully", inserted);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  // Get All Comments
  static async getAllComments(req, res) {
    try {
      const comments = await CommentsTable.getAll();
      return successResponse(res, 200, "Comments fetched successfully", comments);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  // Get Comment by ID
  static async getCommentById(req, res) {
    const { id } = req.params;
    try {
      const comment = await CommentsTable.getById(id);
      if (!comment) {
        return errorResponse(res, 404, "Comment not found");
      }
      return successResponse(res, 200, "Comment fetched successfully", comment);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

static async getCommentsByDailyLog(req, res) {
  const { dailylog_id } = req.params;

  try {
    const result = await CommentsTable.getByDailyLogId(dailylog_id);
    console.log("Comments found:", result.length);

    if (!result || result.length === 0) {
      return successResponse(res, 200, "No comments found for this daily log", []);
    }

    const dailyLogInfo = {
      dailylog_id: result[0].dailylog_id,
      title: result[0].dailylog_title,
      description: result[0].dailylog_description,
      created_at: result[0].log_created_at,
    };

    const comments = result.map(row => ({
      comment_id: row.comment_id,
      user_id: row.user_id,
      comment: row.comment,
      created_at: row.comment_created_at,
    }));

    return successResponse(res, 200, "Comments with daily log fetched successfully", {
      daily_log: dailyLogInfo,
      comments: comments
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}


  // Update Comment
  static async updateComment(req, res) {
    const { id } = req.params;
    const { user_id, dailylog_id, comment } = req.body;

    try {
      const updatedComment = await CommentsTable.update(id, {
        user_id,
        dailylog_id,
        comment
      });

      if (!updatedComment) {
        return errorResponse(res, 404, "Comment not found");
      }

      return successResponse(res, 200, "Comment updated successfully", updatedComment);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  // Delete Comment
  static async deleteComment(req, res) {
    const { id } = req.params;

    try {
      const deletedComment = await CommentsTable.delete(id);
      if (!deletedComment) {
        return errorResponse(res, 404, "Comment not found");
      }

      return successResponse(res, 200, "Comment deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
}

export default CommentsController;
