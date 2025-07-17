import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

// Table instances
const DocumentRecords = new Controllers("document_records");
const DailyLogs = new Controllers("daily_logs");
const ProjectsDocument = new Controllers("projects_document");
const Comments = new Controllers("comments");
const JobPlanning = new Controllers("job_planning");

class RecentActivityController {
  static async getRecentEntries(req, res) {
    try {
      // Set datetime range from 3 days ago 00:00:00 to today 23:59:59.999 (UTC)
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(today.getDate() - 3);
      threeDaysAgo.setHours(0, 0, 0, 0);

      const startDate = threeDaysAgo.toISOString(); // e.g. "2025-07-14T00:00:00.000Z"
      const endDate = today.toISOString();          // e.g. "2025-07-17T23:59:59.999Z"

      // SQL query with datetime BETWEEN for better accuracy and indexing
      const query = `
        SELECT * FROM ?? 
        WHERE created_at BETWEEN ? AND ?
      `;

      // Fetch data from all tables in parallel
      const [
        documentRecords,
        dailyLogs,
        projectDocs,
        comments,
        jobPlans,
      ] = await Promise.all([
        DocumentRecords.runCustomQuery(query, ["document_records", startDate, endDate]),
        DailyLogs.runCustomQuery(query, ["daily_logs", startDate, endDate]),
        ProjectsDocument.runCustomQuery(query, ["projects_document", startDate, endDate]),
        Comments.runCustomQuery(query, ["comments", startDate, endDate]),
        JobPlanning.runCustomQuery(query, ["job_planning", startDate, endDate]),
      ]);

      // Parse JSON string fields in document_records
      const documentRecordsParsed = documentRecords.map(doc => ({
        ...doc,
        line_items: doc.line_items ? JSON.parse(doc.line_items) : [],
      }));

      // Parse JSON string fields in projects_document
      const projectDocsParsed = projectDocs.map(doc => ({
        ...doc,
        file_urls: doc.file_urls ? JSON.parse(doc.file_urls) : [],
        line_items: doc.line_items ? JSON.parse(doc.line_items) : [],
      }));

      return successResponse(res, 200, "Recent entries (from 3 days ago till today) fetched successfully", {
        document_records: {
          total: documentRecordsParsed.length,
          records: documentRecordsParsed,
        },
        daily_logs: {
          total: dailyLogs.length,
          records: dailyLogs,
        },
        projects_document: {
          total: projectDocsParsed.length,
          records: projectDocsParsed,
        },
        comments: {
          total: comments.length,
          records: comments,
        },
        job_planning: {
          total: jobPlans.length,
          records: jobPlans,
        },
      });
    } catch (error) {
      console.error("Fetch recent entries error:", error.message);
      return errorResponse(res, 500, "Something went wrong", error.message);
    }
  }
}

export default RecentActivityController;
