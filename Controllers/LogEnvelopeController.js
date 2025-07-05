import Controllers from "../Models/Model.js";
import { successResponse, errorResponse } from "../Utils/responseHandler.js";

// 🧠 Separate instances for separate tables
const ClientTable = new Controllers("clients");
const EnvelopeLogTable = new Controllers("envelope_logs"); // ✅ Yeh naya

class LogEnvelopeController {
  static async LogEnvelope(req, res) {
    try {
      const { client_id, email, envelope_id, status, sent_at } = req.body;

      // ✅ Validation
      if (!email || !envelope_id) {
        return errorResponse(res, 400, "Missing required fields");
      }

    //   // ✅ Confirm client exists
    //   const client = await ClientTable.findById(client_id);
    //   if (!client) {
    //     return errorResponse(res, 404, "Client not found");
    //   }

      // ✅ Insert into envelope_logs
      const log = await EnvelopeLogTable.create({
        client_id,
        email,
        envelope_id,
        status: status || "sent",
        sent_at: sent_at || new Date().toISOString(),
      });

      console.log("📥 Envelope Log saved:", log);

      return successResponse(res, 200, "Envelope log saved successfully", log);
    } catch (error) {
      console.error("❌ Envelope log error:", error.message);
      return errorResponse(res, 500, "Internal Server Error");
    }
  }
}

export default LogEnvelopeController;
