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
    // static async sendProposalForSignature(req, res) {
    //     try {
    //         const { email } = req.body;

    //         if (!email) {
    //             return errorResponse(res, 400, "Client email is required");
    //         }

    //         console.log(`📩 Request received to send proposal for: ${email}`);

    //         // ✅ Step 1: Fetch Client
    //         const client = await ClientTable.findByEmailPropsal(email.trim().toLowerCase());
    //         if (!client) {
    //             return errorResponse(res, 404, "Client not found");
    //         }

    //         console.log("🔍 Fetched client:", client);

    //         const signer_name = client.client_name || client.name;
    //         const signer_email = client.email;

    //         // ✅ Step 2: Load sample.pdf from /public
    //         const pdfPath = path.join("public", "sample.pdf");
    //         if (!fs.existsSync(pdfPath)) {
    //             return errorResponse(res, 404, "sample.pdf not found in public folder.");
    //         }

    //         const fileBuffer = fs.readFileSync(pdfPath);
    //         console.log(`📄 PDF loaded from: ${pdfPath}`);

    //         // ✅ Step 3: Get DocuSign Token
    //         console.log("🔐 Getting DocuSign JWT Token...");
    //         const { accessToken, accountId } = await getJWTToken();
    //         console.log("✅ Got JWT Token & Account ID:", accountId);

    //         const envelopeApi = new docusign.EnvelopesApi(apiClient);

    //         // ✅ Step 4: Create Envelope
    //         console.log("📦 Creating envelope definition...");
    //         const envDef = new docusign.EnvelopeDefinition();
    //         envDef.emailSubject = `Please sign the sample proposal`;
    //         envDef.status = "sent";

    //         const doc = new docusign.Document();
    //         doc.documentBase64 = fileBuffer.toString("base64");
    //         doc.name = `sample.pdf`;
    //         doc.fileExtension = "pdf";
    //         doc.documentId = "1";

    //         const signer = docusign.Signer.constructFromObject({
    //             email: signer_email,
    //             name: signer_name,
    //             recipientId: "1",
    //             routingOrder: "1",
    //             tabs: {
    //                 signHereTabs: [
    //                     {
    //                         anchorString: "**signature_here**", // Make sure this exists in your PDF
    //                         anchorUnits: "pixels",
    //                         anchorYOffset: "10",
    //                         anchorXOffset: "20",
    //                     },
    //                 ],
    //             },
    //         });

    //         envDef.documents = [doc];
    //         envDef.recipients = { signers: [signer] };

    //         // ✅ Step 5: Send to DocuSign
    //         console.log("📨 Sending envelope to DocuSign...");
    //         const result = await envelopeApi.createEnvelope(accountId, {
    //             envelopeDefinition: envDef,
    //         });

    //         console.log("✅ Envelope sent. Envelope ID:", result.envelopeId);

    //         // ✅ Step 6: Log envelope (to your backend)
    //         console.log("📝 Logging envelope to external API...");
    //         await axios.post("https://hrb5wx2v-3002.inc1.devtunnels.ms/api/LogEnvelope", {
    //             client_id: client.id,
    //             email: signer_email,
    //             envelope_id: result.envelopeId,
    //             status: "sent",
    //             sent_at: new Date().toISOString(),
    //         });

    //         // ✅ Step 7: Notify client via email (optional)
    //         // ✅ Step 7: Notify client via email
    //         await axios.post("https://hrb5wx2v-3002.inc1.devtunnels.ms/api/sendProposalEmail", {
    //             email: signer_email,
    //             subject: "Proposal Sent for Signature",
    //             message: `Dear ${signer_name},\n\nYour proposal has been sent via DocuSign. Please check your inbox and sign the document.\n\nThank you!`,
    //         });


    //         return successResponse(res, 200, "Proposal sent for signature", {
    //             envelopeId: result.envelopeId,
    //             docusign_status: "sent",
    //         });
    //     } catch (error) {
    //         console.error("❌ DocuSign error:", error.message || error);
    //         return errorResponse(res, 500, error.message || "An error occurred while sending the proposal.");
    //     }
    // }


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
