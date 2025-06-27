import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const DailyLogTable = new Controllers("daily_logs");

class DailyLogController {

  // CREATE LOG
static async createLog(req, res) {
  try {
    const {
      job_id,
      date,
      title,
      notes
    } = req.body;

    let imageUrls = []; // Initialize an empty array to store image URLs

    // ✅ Handle multiple image uploads
    if (req.files && req.files.images) {
      let files = req.files.images; // Assuming the input field name is 'images'

      // If only one file is uploaded, it will not be an array, so make it an array
      if (!Array.isArray(files)) {
        files = [files];
      }

      // Loop through each file and upload it to Cloudinary
      for (const file of files) {
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'audit_reports',
          resource_type: 'image',
        });

        console.log("Uploaded image:", uploadResult); // Log the result for debugging

        // Add the uploaded image URL to the array
        imageUrls.push(uploadResult.secure_url);
      }
    }

    // If no images were uploaded, store null. If images were uploaded, store the array as a JSON string
    const images = imageUrls.length > 0 ? JSON.stringify(imageUrls) : null;

    // Prepare the data to insert into the database
    const data = {
      job_id,
      date,
      title,
      notes,
      images // Store the images as a JSON string or null (column name is 'images')
    };

    // Log the data for debugging
    console.log("Inserting data:", data);

    const result = await DailyLogTable.create(data); // Make sure the table name is correct
    const inserted = await DailyLogTable.getById(result.insertId);

    // Return the result with image URLs
    inserted.images = inserted.images ? JSON.parse(inserted.images) : []; // Parse the JSON string back into an array

    return successResponse(res, 201, "Daily log created successfully", inserted);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return errorResponse(res, 500, error.message);
  }
}

  // GET ALL LOGS
  // Get All Logs
// Get All Logs
static async getAllLogs(req, res) {
  try {
    const logs = await DailyLogTable.getAll();
    logs.forEach(log => {
      // Parse 'images' from a string to an array
      if (log.images) {
        log.images = JSON.parse(log.images); // Convert the stringified array back to an array
      }
    });
    return successResponse(res, 200, "All daily logs fetched", logs);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}

// Get Log By ID
static async getLogById(req, res) {
  try {
    const { id } = req.params;
    const log = await DailyLogTable.getById(id);
    if (!log) return errorResponse(res, 404, "Log not found");

    // Parse 'images' from a string to an array
    if (log.images) {
      log.images = JSON.parse(log.images); // Convert the stringified array back to an array
    }

    return successResponse(res, 200, "Daily log fetched", log);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}

  // UPDATE LOG
  static async updateLog(req, res) {
  try {
    const { id } = req.params;
    const {
      job_id,
      date,
      title,
      notes
    } = req.body;

    let imageUrls = []; // Initialize an array to store image URLs

    // ✅ Upload new images only if sent
    if (req.files && req.files.images) {
      let files = req.files.images; // Get images from request

      // If only one file is uploaded, it will not be an array, so make it an array
      if (!Array.isArray(files)) {
        files = [files];
      }

      // Loop through each file and upload it to Cloudinary
      for (const file of files) {
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'audit_reports',
          resource_type: 'image',
        });

        // Add the uploaded image URL to the array
        imageUrls.push(uploadResult.secure_url);
      }
    }

    // Build the update data object
    const data = {
      job_id,
      date,
      title,
      notes
    };

    // ✅ Only add images if new ones were uploaded
    if (imageUrls.length > 0) {
      data.images = JSON.stringify(imageUrls); // Store images as a JSON string
    }

    // ✅ Update the record
    await DailyLogTable.update(id, data);

    // ✅ Fetch updated data
    const updated = await DailyLogTable.getById(id);

    // ✅ Normalize images field to an array format in response
    if (updated.images) {
      updated.images = JSON.parse(updated.images); // Parse the JSON string back to an array
    } else {
      updated.images = []; // If no images, return an empty array
    }

    return successResponse(res, 200, "Daily log updated successfully", updated);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}



  // DELETE LOG
  static async deleteLog(req, res) {
    try {
      const { id } = req.params;
      await DailyLogTable.delete(id);
      return successResponse(res, 200, "Daily log deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
}

export default DailyLogController;
