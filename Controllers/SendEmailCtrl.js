import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";
import { sendEmail } from "../Utils/emailService.js";
import bcrypt from "bcrypt";

import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const ClientTable = new Controllers("clients");


class SendEmailController {
    static async sendProposalEmail(req, res) {
    try {
      const { email, subject, message } = req.body;

      // 🔍 Validate client
      const client = await ClientTable.findByEmailPropsal(email.trim().toLowerCase());
      if (!client) {
        return res.status(404).json({ success: false, message: "Client not found." });
      }

      // 📁 Upload file if present
      let attachmentUrl = null;
      if (req.files && req.files.attachment) {
        const uploadResult = await cloudinary.uploader.upload(req.files.attachment.tempFilePath, {
          folder: "proposal_attachments",
          resource_type: "auto",
        });
        attachmentUrl = uploadResult.secure_url;
      }

      // ✉️ Styled HTML Email Content
      const htmlContent = `
        <div style="background-color:#f4f4f4;padding:40px 0;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <div style="padding:30px 30px 20px 30px;border-bottom:1px solid #eee;">
              <h2 style="margin:0;font-size:22px;color:#333;">Proposal from <span style="color:#0e76a8;">Bon Bon</span></h2>
            </div>
            <div style="padding:30px;">
              <p style="font-size:16px;color:#333;margin-bottom:20px;">Dear ${client.client_name || "Client"},</p>
              <p style="font-size:15px;color:#555;line-height:1.6;margin-bottom:25px;">
                ${message || "Please review the proposal attached below."}
              </p>
              ${attachmentUrl ? `
              <div style="margin-bottom:30px;">
                <p style="font-size:15px;margin:0;"><strong>Download:</strong></p>
                <a href="${attachmentUrl}" style="display:inline-block;margin-top:8px;background:#0e76a8;color:#ffffff;padding:10px 20px;border-radius:5px;text-decoration:none;font-size:15px;">View Proposal</a>
              </div>
              ` : ''}
              <p style="font-size:15px;color:#777;">Best regards,<br/>The Bon Bon Team</p>
              <p style="margin-top:20px;font-size:13px;color:#999;">
                For any questions, contact us at 
                <a href="mailto:support@bonbon.com" style="color:#0e76a8;text-decoration:none;">support@bonbon.com</a>
              </p>
            </div>
          </div>
        </div>
      `;

      // 📧 Send email
      await sendEmail(email, subject || "Proposal from Bon Bon", htmlContent);

      return res.status(200).json({
        success: true,
        message: "Email sent successfully",
        email_to: email,
        attachment: attachmentUrl,
      });
    } catch (error) {
      console.error("Error sending proposal email:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default SendEmailController;
