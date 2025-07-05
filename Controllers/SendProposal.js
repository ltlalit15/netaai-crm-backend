import fs from "fs";
import axios from "axios";
import path from "path";
import docusign from "docusign-esign";
import { getJWTToken, apiClient } from "../Utils/docusignAuth.js";
import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

const ClientTable = new Controllers("clients");

import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

class SendProposalController {
    


 static async sendProposalForSignature(req, res) {
  try {
    const { email, name } = req.body;

    if (!email) {
      return errorResponse(res, 400, "Client email is required");
    }

    const signer_email = email.trim().toLowerCase();
    const signer_name = name || "Client";

    // ✅ Upload to Cloudinary
    let attachmentUrl = null;

    if (req.files && req.files.attachment && req.files.attachment.tempFilePath) {
      const uploadResult = await cloudinary.uploader.upload(req.files.attachment.tempFilePath, {
        folder: "proposal_attachments",
        resource_type: "auto",
      });
      attachmentUrl = uploadResult.secure_url;
    } else {
      return errorResponse(res, 400, "Attachment upload failed or missing.");
    }

    // ✅ Download PDF from Cloudinary
    const pdfResponse = await axios.get(attachmentUrl, { responseType: "arraybuffer" });
    const fileBuffer = Buffer.from(pdfResponse.data, "binary");

    // ✅ Step 1: Get JWT token
    const { accessToken, accountId, basePath } = await getJWTToken(); // Make sure basePath is returned too

    // ✅ Step 2: Setup API client with token
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(basePath || "https://demo.docusign.net/restapi");
    apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

    const envelopeApi = new docusign.EnvelopesApi(apiClient);

    // ✅ Step 3: Create Envelope
    const envDef = new docusign.EnvelopeDefinition();
    envDef.emailSubject = "Please sign the proposal";
    envDef.status = "sent";

    const doc = new docusign.Document();
    doc.documentBase64 = fileBuffer.toString("base64");
    doc.name = "Uploaded Proposal";
    doc.fileExtension = "pdf";
    doc.documentId = "1";

    const signer = docusign.Signer.constructFromObject({
      email: signer_email,
      name: signer_name,
      recipientId: "1",
      routingOrder: "1",
      tabs: {
        signHereTabs: [
          {
            anchorString: "**signature_here**",
            anchorUnits: "pixels",
            anchorYOffset: "10",
            anchorXOffset: "20",
          },
        ],
      },
    });

    envDef.documents = [doc];
    envDef.recipients = { signers: [signer] };

    // ✅ Step 4: Send envelope
    const result = await envelopeApi.createEnvelope(accountId, {
      envelopeDefinition: envDef,
    });

    // ✅ Step 5: Log & Email
    await axios.post("https://netaai-crm-backend-production-c306.up.railway.app/api/LogEnvelope", {
      client_id: null,
      email: signer_email,
      envelope_id: result.envelopeId,
      status: "sent",
      sent_at: new Date().toISOString(),
    });

    await axios.post("https://netaai-crm-backend-production-c306.up.railway.app/api/sendProposalEmail", {
      email: signer_email,
      subject: "Proposal Sent for Signature",
      message: `Dear ${signer_name},\n\nYour proposal has been sent via DocuSign. Please check your inbox and sign the document.\n\nThank you!`,
    });

    return successResponse(res, 200, "Proposal sent for signature", {
      envelopeId: result.envelopeId,
      docusign_status: "sent",
    });

  } catch (error) {
    console.error("❌ DocuSign error:", error.message || error);
    return errorResponse(res, 500, error.message || "An error occurred while sending the proposal.");
  }
}




static async checkIfSigned(req, res) {
  try {
    const { envelopeId } = req.params;

    if (!envelopeId) {
      return res.status(400).json({ success: false, message: "Envelope ID is required" });
    }

    const { accessToken, accountId } = await getJWTToken();
    const envelopeApi = new docusign.EnvelopesApi(apiClient);

    const envelope = await envelopeApi.getEnvelope(accountId, envelopeId);

    const status = envelope.status; // sent, delivered, completed, voided, etc.

    return res.status(200).json({
      success: true,
      envelopeId,
      status,
      message: `Envelope is currently: ${status}`,
    });
  } catch (error) {
    console.error("Error checking envelope status:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}






}

export default SendProposalController;
