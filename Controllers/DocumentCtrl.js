import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";
import cloudinary from "cloudinary";
import path from "path";

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const DocumentTable = new Controllers("projects_document");

class DocumentController {

    //  CREATE
static async createDocument(req, res) {
  try {
    const { proposal_id, folder_name = null, title, created_by } = req.body;
    let fileUrls = [];

    if (!proposal_id || !title) {
      return errorResponse(res, 400, "proposal_id and title are required");
    }

    if (req.files && req.files.fileUrls) {
      let files = req.files.fileUrls;
      if (!Array.isArray(files)) files = [files];

      const allowedExtensions = [
        'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
        'png', 'jpg', 'jpeg', 'ocx', 'zip', 'ptx', 'txt'
      ];

      for (const file of files) {
        const fileName = file.name || '';
        const ext = path.extname(fileName).replace('.', '').toLowerCase();

        const isImage = ['jpg', 'jpeg', 'png'].includes(ext);
        const resourceType = isImage ? 'image' : 'raw';

        console.log(`🟡 Uploading: ${file.name}`);
        console.log(`📎 Extension: .${ext}`);
        console.log(`📦 Resource Type: ${resourceType}`);
        console.log(`📂 Temp Path: ${file.tempFilePath}`);

        if (!allowedExtensions.includes(ext)) {
          return errorResponse(res, 400, `File type .${ext} is not allowed`);
        }

        try {
          let uploadResult;
          const uploadOptions = {
            folder: 'projects_document',
            use_filename: true,
            unique_filename: false,
            upload_preset: 'raw_uploads' // ✅ Critical line to make Cloudinary accept raw uploads
          };

          if (isImage) {
            uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
              ...uploadOptions,
              resource_type: 'image'
            });
          } else {
            uploadResult = await cloudinary.uploader.upload_large(file.tempFilePath, {
              ...uploadOptions,
              resource_type: 'raw'
            });
          }

          // ✅ Push uploaded file info with URL
          fileUrls.push({
            url: uploadResult.secure_url || '⛔ MISSING URL',
            original_name: file.name,
            type: file.mimetype,
            size: file.size
          });

        } catch (uploadErr) {
          console.error(`❌ Upload failed for ${file.name}:`, uploadErr);
          const msg = uploadErr?.message || 'Unknown Cloudinary error';
          return errorResponse(res, 500, `Upload failed for file ${file.name}: ${msg}`);
        }
      }
    }

    const data = {
      proposal_id,
      folder_name: folder_name === "" ? null : folder_name,
      title: title === "" ? null : title,
      created_by: created_by === "" ? null : created_by,
      file_urls: fileUrls.length > 0 ? JSON.stringify(fileUrls) : null,
    };

    const result = await DocumentTable.create(data);
    const inserted = await DocumentTable.getById(result.insertId);
    inserted.file_urls = inserted.file_urls ? JSON.parse(inserted.file_urls) : [];

    console.log("🧾 Final file_urls response:", inserted.file_urls);

    return successResponse(res, 201, "📁 Document created successfully", inserted);

  } catch (error) {
    console.error("🚨 Error in createDocument:", error);
    return errorResponse(res, 500, error.message || "Internal server error");
  }
}

    //  UPDATE (title or folder name only — file updates not handled here)
    static async updateDocument(req, res) {
        try {
            const { id } = req.params;
            const { proposal_id, folder_name = null, title, created_by } = req.body;
            let fileUrls = [];

            if (!id || !proposal_id) {
                return errorResponse(res, 400, "id, proposal_id, and title are required");
            }

            // Upload new files if present
            if (req.files && req.files.fileUrls) {
                let files = req.files.fileUrls;
                if (!Array.isArray(files)) files = [files];

                for (const file of files) {
                    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
                        folder: 'projects_document',
                        resource_type: 'auto',
                    });
                    fileUrls.push(uploadResult.secure_url);
                }
            }

            // Fetch existing document to preserve old file_urls if no new files are uploaded
            const existing = await DocumentTable.getById(id);
            let finalFileUrls = [];

            if (fileUrls.length > 0) {
                finalFileUrls = fileUrls;
            } else if (existing && existing.file_urls) {
                finalFileUrls = JSON.parse(existing.file_urls);
            }

            const data = {
                proposal_id,
                folder_name: folder_name === "" ? null : folder_name,
                title: title === "" ? null : title,
                created_by: created_by === "" ? null : created_by,
                file_urls: finalFileUrls.length > 0 ? JSON.stringify(finalFileUrls) : null,
            };

            await DocumentTable.update(id, data);
            const updated = await DocumentTable.getById(id);
            updated.file_urls = updated.file_urls ? JSON.parse(updated.file_urls) : [];

            return successResponse(res, 200, "Document updated", updated);
        } catch (error) {
            console.error("Error in updateDocument:", error);
            return errorResponse(res, 500, error.message);
        }
    }


    // ✅ DELETE
    static async deleteDocument(req, res) {
        try {
            const { id } = req.params;
            const existing = await DocumentTable.getById(id);
            if (!existing) return errorResponse(res, 404, "Document not found");

            await DocumentTable.delete(id);
            return successResponse(res, 200, "Document deleted");
        } catch (err) {
            return errorResponse(res, 500, err.message);
        }
    }

    static async getDocumentsByProposalId(req, res) {
        try {
            const { proposal_id } = req.params;
            console.log("📥 Received proposal_id:", proposal_id);

            const documents = await DocumentTable.getDocument(proposal_id);
            console.log("📦 Fetched Documents:", documents);

            if (!documents || documents.length === 0) {
                return errorResponse(res, 404, "Document not found");
            }

            const enrichedDocuments = documents.map(doc => ({
                ...doc,
                file_urls: doc.file_urls ? JSON.parse(doc.file_urls) : []
            }));

            return successResponse(res, 200, "Documents fetched by proposal_id", enrichedDocuments);
        } catch (error) {
            console.error("❌ Error in getDocumentsByProposalId:", error.message);
            return errorResponse(res, 500, error.message);
        }
    }


}





export default DocumentController;
